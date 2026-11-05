import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type Browser, type BrowserContext, chromium, type Page } from "playwright";
import { startStaticServer } from "./static-server.js";
import { assertAzgaarBuilt, azgaarDist, type FrameBox, type Point, resolvePath, type WorldConfig } from "./world.js";

// Azgaar's Points slider stores a density step; this is its step-to-cell-count table (src/data/graph-density.ts)
const DENSITY_BY_POINTS: Record<number, number> = {
  1000: 1, 2000: 2, 5000: 3, 10000: 4, 20000: 5, 30000: 6, 40000: 7,
  50000: 8, 60000: 9, 70000: 10, 80000: 11, 90000: 12, 100000: 13
};
const MAP_TIMEOUT = 180_000;

/** Id the custom template is registered under in Azgaar's template list for one generation */
const CUSTOM_TEMPLATE = "arpgCustom";

export interface NewMapOptions extends WorldConfig {
  /** one of Azgaar's built-in template ids */
  template?: string;
  /** a custom heightmap template, one Azgaar step per entry ("Hill 1 80-85 40-60 40-60") */
  templateSteps?: string[];
}

export type ListKind = "features" | "burgs" | "markers" | "routes";

export interface SculptEdit {
  polygon: Point[];
  op: "set" | "raise" | "lower" | "smooth" | "roughen";
  value: number;
  featherPx: number;
  noisePx: number;
  /** wobbles the outline by up to this many pixels */
  edgeNoisePx: number;
  seed: number;
  clamp?: [number, number];
}

/**
 * One headless browser page running Azgaar, kept alive for the MCP session so map state persists
 * between tool calls. Calls are serialized: Azgaar is single-threaded state, not a database.
 */
export class AzgaarSession {
  private browser?: Browser;
  private context?: BrowserContext;
  private page?: Page;
  private server?: { url: string; close: () => Promise<void> };
  private queue: Promise<unknown> = Promise.resolve();
  private errors: string[] = [];

  constructor(
    private readonly canvas: { width: number; height: number },
    private readonly headed: boolean
  ) {}

  /** Runs `task` after every earlier call has finished */
  exclusive<T>(task: () => Promise<T>): Promise<T> {
    const next = this.queue.then(task, task);
    this.queue = next.catch(() => undefined);
    return next;
  }

  get isOpen(): boolean {
    return Boolean(this.page && !this.page.isClosed());
  }

  async open(): Promise<Page> {
    if (this.page && !this.page.isClosed()) return this.page;
    assertAzgaarBuilt();
    this.server ??= await startStaticServer(azgaarDist);
    this.browser ??= await chromium.launch({ headless: !this.headed });
    this.context = await this.browser.newContext({ viewport: this.canvas, deviceScaleFactor: 1 });
    // a stored version newer than the app stops the "what's new" notice from covering the map
    await this.context.addInitScript(() => {
      try {
        localStorage.setItem("version", "99.0.0");
      } catch {}
    });
    const page = await this.context.newPage();
    page.on("pageerror", e => this.recordError(`pageerror: ${e.message}`));
    page.on("console", m => {
      if (m.type() === "error" && !m.text().includes("net::ERR_")) this.recordError(`console: ${m.text()}`);
    });
    await page.goto(`${this.server.url}index.html`);
    await page.waitForFunction(() => (window as any).FMG?.mapHistory?.length > 0, undefined, { timeout: MAP_TIMEOUT });
    await page.addStyleTag({ content: "body.mcp-capture > *:not(#map) { visibility: hidden !important; }" });
    this.page = page;
    return page;
  }

  async close(): Promise<void> {
    await this.context?.close().catch(() => undefined);
    await this.browser?.close().catch(() => undefined);
    await this.server?.close().catch(() => undefined);
    this.page = this.context = this.browser = this.server = undefined;
  }

  /** Errors the page reported since the last call, cleared on read */
  takeErrors(): string[] {
    const errors = this.errors;
    this.errors = [];
    return errors;
  }

  async newMap(options: NewMapOptions) {
    const density = DENSITY_BY_POINTS[options.points];
    if (!density) throw new Error(`points must be one of ${Object.keys(DENSITY_BY_POINTS).join(", ")}`);
    if (options.template && options.templateSteps) throw new Error("Pass either template or template_steps, not both.");
    const { geography, climate, generation, lore } = options;
    // a pinned value is what Azgaar keeps instead of re-rolling; undefined clears the pin
    const pins: Record<string, unknown> = {
      points: density,
      mapWidth: options.canvas.width,
      mapHeight: options.canvas.height,
      distanceScale: options.units.distance.scale,
      distanceUnit: options.units.distance.unit,
      template: options.templateSteps ? CUSTOM_TEMPLATE : options.template,
      mapSize: geography?.mapSize,
      latitude: geography?.latitude,
      longitude: geography?.longitude,
      temperatureEquator: climate?.temperature.equator,
      temperatureNorthPole: climate?.temperature.northPole,
      temperatureSouthPole: climate?.temperature.southPole,
      prec: climate?.precipitation,
      statesNumber: generation?.states,
      manors: generation?.burgs,
      religionsNumber: generation?.religions,
      mapName: lore?.name
    };
    const page = await this.open();
    await this.assertNotEditing(page);
    await page.evaluate(
      async ({ seed, width, height, pins, winds, steps, customId, keepMarkers }) => {
        const { Pins } = FMG;
        for (const [key, value] of Object.entries(pins)) {
          if (value === undefined || value === null) Pins.clear(key);
          else Pins.set(key, value);
        }
        if (steps) FMG.heightmapTemplates[customId] = { id: 999, name: "ARPG custom", template: steps, probability: 0 };
        if (winds) FMG.options.map.climate.winds = winds;
        const before = FMG.mapHistory.length;
        FMG.regenerateMap({ seed, width, height });
        while (FMG.mapHistory.length === before) await new Promise(done => setTimeout(done, 100));
        // Azgaar has no pin for markers, so procedural ones are cleared after generation
        if (!keepMarkers) {
          FMG.pack.markers = [];
          FMG.Layers.draw("markers");
        }
        if (steps && FMG.options.generation.template !== customId) {
          throw new Error(`Azgaar generated from "${FMG.options.generation.template}" instead of the custom template.`);
        }
      },
      {
        seed: options.seed,
        width: options.canvas.width,
        height: options.canvas.height,
        pins,
        winds: climate?.winds,
        steps: options.templateSteps?.join("\n"),
        customId: CUSTOM_TEMPLATE,
        keepMarkers: generation?.markers !== 0
      }
    );
    return this.info();
  }

  async saveMap(path: string): Promise<{ path: string; bytes: number }> {
    const page = await this.open();
    await this.assertNotEditing(page);
    const data = await page.evaluate(() => {
      if (FMG.options.map.viewOnly) throw new Error("The map is in view-only mode and cannot be saved.");
      if ((window as any).__mcpTerrainPending) throw new Error("Terrain edits are pending; run finalize_terrain before saving.");
      return FMG.Services.Save.prepareMapData() as string;
    });
    const file = resolvePath(path, true);
    writeFileSync(file, data, "utf8");
    return { path: file, bytes: Buffer.byteLength(data, "utf8") };
  }

  async openMap(path: string) {
    const file = resolvePath(path);
    if (!existsSync(file)) throw new Error(`No map file at ${file}`);
    const page = await this.open();
    await this.assertNotEditing(page);
    const before = await page.evaluate(() => FMG.mapHistory.length as number);
    await page.locator("#mapToLoad").setInputFiles(file);
    try {
      await page.waitForFunction(n => FMG.mapHistory.length > n, before, { timeout: MAP_TIMEOUT });
    } catch {
      const dialog = await page.evaluate(() => document.querySelector("#dialogs")?.textContent?.trim().slice(0, 500));
      throw new Error(`Azgaar did not finish loading ${file}.${dialog ? ` It reported: ${dialog}` : ""}`);
    }
    return this.info();
  }

  /**
   * Edits the raw heightmap (grid.cells.h) inside a polygon in map pixels. Cells inside get the full effect;
   * cells within `featherPx` outside it get a linearly fading share. Nothing downstream is rebuilt until
   * finalizeTerrain(), so several sculpts can stack before one regeneration.
   */
  async sculpt(edit: SculptEdit) {
    const page = await this.open();
    await this.assertNotEditing(page);
    return page.evaluate(edit => {
      const { grid } = FMG;
      const { polygon, op, value, featherPx, noisePx, edgeNoisePx, seed, clamp } = edit;
      const heights: Uint8Array = grid.cells.h;
      const original = Uint8Array.from(heights);
      const xs = polygon.map(p => p[0]);
      const ys = polygon.map(p => p[1]);
      const pad = featherPx + edgeNoisePx;
      const box = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad];

      const inside = (x: number, y: number) => {
        let hit = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const [xi, yi] = polygon[i];
          const [xj, yj] = polygon[j];
          if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
        }
        return hit;
      };
      const edgeDistance = (x: number, y: number) => {
        let best = Infinity;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const [x1, y1] = polygon[j];
          const [x2, y2] = polygon[i];
          const dx = x2 - x1, dy = y2 - y1;
          const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
          best = Math.min(best, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
        }
        return best;
      };
      // deterministic value noise in [-1, 1], one lattice point every noisePx
      const hash = (ix: number, iy: number) => {
        let h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) | 0;
        h = Math.imul(h ^ (h >>> 13), 1274126177);
        return (((h ^ (h >>> 16)) >>> 0) / 4294967295) * 2 - 1;
      };
      const noise = (x: number, y: number) => {
        const gx = x / noisePx, gy = y / noisePx;
        const ix = Math.floor(gx), iy = Math.floor(gy);
        const fx = gx - ix, fy = gy - iy;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const top = hash(ix, iy) * (1 - sx) + hash(ix + 1, iy) * sx;
        const bottom = hash(ix, iy + 1) * (1 - sx) + hash(ix + 1, iy + 1) * sx;
        return top * (1 - sy) + bottom * sy;
      };

      let touched = 0, totalChange = 0;
      for (let i = 0; i < heights.length; i++) {
        const [x, y] = grid.points[i];
        if (x < box[0] || y < box[1] || x > box[2] || y > box[3]) continue;
        // signed distance to the outline, wobbled by edge noise so shapes get natural, irregular borders
        const signed = (inside(x, y) ? -1 : 1) * edgeDistance(x, y) + (edgeNoisePx ? edgeNoisePx * noise(x + 9173, y - 5281) : 0);
        const weight = signed <= 0 ? 1 : featherPx > 0 ? Math.max(0, 1 - signed / featherPx) : 0;
        if (!weight) continue;
        const h = original[i];
        let next = h;
        if (op === "set") next = h + weight * (value - h);
        else if (op === "raise") next = h + weight * value;
        else if (op === "lower") next = h - weight * value;
        else if (op === "roughen") next = h + weight * value * noise(x, y);
        else if (op === "smooth") {
          const around = grid.cells.c[i].map((c: number) => original[c]);
          const mean = (h + around.reduce((a: number, b: number) => a + b, 0)) / (around.length + 1);
          next = h + weight * Math.min(1, value) * (mean - h);
        }
        if (clamp) next = Math.max(clamp[0], Math.min(clamp[1], next));
        heights[i] = Math.max(0, Math.min(100, Math.round(next)));
        if (heights[i] !== h) {
          touched++;
          totalChange += heights[i] - h;
        }
      }
      (window as any).__mcpTerrainPending = true;
      return { cellsChanged: touched, meanChange: touched ? Math.round((totalChange / touched) * 10) / 10 : 0 };
    }, edit);
  }

  /** Rebuilds the map from the edited heightmap, as Azgaar's heightmap editor does when an Erase edit is finalized */
  async finalizeTerrain(keepMarkers: boolean) {
    const page = await this.open();
    await this.assertNotEditing(page);
    await page.evaluate(async keepMarkers => {
      const { pack } = FMG;
      pack.cultures = [];
      pack.burgs = [];
      pack.states = [];
      pack.provinces = [];
      pack.religions = [];
      pack.relief = [];
      await FMG.ErasePipeline.run({ erosion: false });
      if (!keepMarkers) pack.markers = [];
      FMG.Layers.drawAll();
      (window as any).__mcpTerrainPending = false;
    }, keepMarkers);
    return this.info();
  }

  /**
   * Changes the climate of the current map and re-derives temperature, precipitation, rivers and biomes
   * from it, keeping the terrain. Mirrors Azgaar's World Configurator update (src/controllers/world-configurator.ts)
   */
  async setClimate(change: { precipitation?: number; temperature?: { equator?: number; northPole?: number; southPole?: number } }) {
    const page = await this.open();
    await this.assertNotEditing(page);
    await page.evaluate(change => {
      const { climate } = FMG.options.map;
      if (change.precipitation !== undefined) climate.precipitation = change.precipitation;
      Object.assign(climate.temperature, change.temperature ?? {});
      const { pack } = FMG;
      FMG.Temperature.generate();
      FMG.Precipitation.generate();
      const heights = new Uint8Array(pack.cells.h);
      FMG.Rivers.generate(true, FMG.Rivers.getLocked());
      FMG.Rivers.specify();
      FMG.Routes.sync();
      pack.cells.h = new Float32Array(heights); // the river pass erodes heights; the terrain must not change
      FMG.Biomes.define();
      FMG.Features.defineGroups();
      FMG.Features.defineNames();
      FMG.Layers.draw("temperature", "precipitation");
      FMG.Layers.draw("biomes", "coordinates", "rivers");
    }, change);
    return this.info();
  }

  /** Adds or updates a lake or route style group, starting from a stock group's look */
  async defineStyleGroup(layer: "lakes" | "routes", group: string, attrs: Record<string, string | number | null>) {
    const page = await this.open();
    return page.evaluate(
      ({ layer, group, attrs }) => {
        const groups = FMG.styles[layer].groups;
        const created = !groups[group];
        if (created) groups[group] = structuredClone(layer === "lakes" ? groups.freshwater : groups.trails);
        try {
          // Styles.setValue checks each attr against Azgaar's style schema, so the .map reloads with it intact
          for (const [name, value] of Object.entries(attrs)) FMG.Styles.setValue(`${layer}.groups.${group}.attrs.${name}`, value);
        } catch (error) {
          if (created) delete groups[group];
          throw error;
        }
        FMG.Layers.draw(layer);
        FMG.Styles.write(layer);
        return { layer, group, created, attrs: groups[group].attrs };
      },
      { layer, group, attrs }
    );
  }

  /**
   * Founds a locked burg at a map point with a name, population, group and buildings. Azgaar links a new burg to
   * the nearest route with a trail; that trail is removed so routes stay hand-drawn
   */
  async addBurg(burg: {
    point: Point;
    name: string;
    population?: number;
    group?: string;
    buildings?: Partial<Record<"citadel" | "plaza" | "shanty" | "temple" | "walls", boolean>>;
    note?: string;
  }) {
    const page = await this.open();
    return page.evaluate(burg => {
      const { pack } = FMG;
      const routesBefore = new Set(pack.routes.map((r: any) => r.i));
      const id = FMG.Burgs.add(burg.point[0], burg.point[1]);
      for (const route of pack.routes.filter((r: any) => !routesBefore.has(r.i))) FMG.Routes.remove(route.i);
      FMG.Burgs.rename(id, burg.name);
      if (burg.population !== undefined) FMG.Burgs.setPopulation(id, burg.population);
      if (burg.group) FMG.Burgs.setGroup(id, burg.group);
      for (const [building, present] of Object.entries(burg.buildings ?? {})) FMG.Burgs.setBuilding(id, building, Boolean(present));
      FMG.Burgs.setLocked(id, true);
      if (burg.note) FMG.Notes.write(`burg:${id}`, burg.note);
      FMG.Layers.draw("burgIcons", "labels", "routes");
      const b = pack.burgs[id];
      const { scale, urbanization } = FMG.options.map.units.population;
      return {
        i: id,
        name: b.name,
        cell: b.cell,
        group: b.group,
        people: Math.round(b.population * scale * urbanization.rate),
        buildings: Object.fromEntries(["citadel", "plaza", "shanty", "temple", "walls"].map(k => [k, Boolean(b[k])]))
      };
    }, burg);
  }

  /** Places a locked marker at a map point: a configured type (volcanoes, ruins…) or a custom one with a note */
  async addMarker(marker: { point: Point; type: string; name?: string; note?: string; icon?: string }) {
    const page = await this.open();
    return page.evaluate(({ point, type, name, note, icon }) => {
      const details: Record<string, string> = {};
      if (name !== undefined) details.name = name;
      if (note !== undefined) details.note = note;
      if (icon !== undefined) details.icon = icon;
      const id = FMG.Markers.place(point[0], point[1], type, details);
      FMG.Markers.setLocked(id, true);
      FMG.Layers.draw("markers");
      const m = FMG.pack.markers.find((m: any) => m.i === id);
      return { i: id, type: m.type, name: m.name, icon: m.icon, cell: m.cell, note: FMG.Notes.get({ type: "marker", id }) };
    }, marker);
  }

  /**
   * Paints the land cells inside `polygon` (map pixels) with a biome, creating it by name if it is new and
   * updating its colour and habitability otherwise. `heights` limits painting to cells within [min, max]
   */
  async paintBiome(biome: { name: string; color?: string; habitability?: number }, polygon: Point[], heights?: [number, number]) {
    const page = await this.open();
    return page.evaluate(
      ({ biome, polygon, heights }) => {
        const { pack } = FMG;
        const inside = (x: number, y: number) => {
          let hit = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
          }
          return hit;
        };
        let id = pack.biomes.findIndex((b: any) => b && !b.removed && b.name === biome.name);
        const created = id < 0;
        if (created) {
          if (!biome.color) throw new Error(`Biome "${biome.name}" is new; give it a color`);
          id = FMG.Biomes.add(biome.name, biome.color, biome.habitability ?? 0);
        } else {
          if (biome.color) FMG.Biomes.recolor(id, biome.color);
          if (biome.habitability !== undefined) FMG.Biomes.setHabitability(id, biome.habitability);
        }
        const [min, max] = heights ?? [20, 100];
        const cells: number[] = [];
        pack.cells.i.forEach((i: number) => {
          const h = pack.cells.h[i];
          if (h >= 20 && h >= min && h <= max && inside(pack.cells.p[i][0], pack.cells.p[i][1])) cells.push(i);
        });
        if (!cells.length) throw new Error(`No land cell inside the polygon${heights ? ` within heights ${min}-${max}` : ""}`);
        FMG.Biomes.setCells(id, cells);
        FMG.Layers.draw("biomes");
        return { i: id, name: biome.name, created, color: pack.biomes[id].color, cells: cells.length };
      },
      { biome, polygon, heights }
    );
  }

  /** Sets subtype, style group and name on every lake with a cell centre inside `polygon` (map pixels) */
  async setLakes(polygon: Point[], change: { subtype?: string; group?: string; name?: string }) {
    const page = await this.open();
    return page.evaluate(
      ({ polygon, change }) => {
        const { pack } = FMG;
        const inside = (x: number, y: number) => {
          let hit = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
          }
          return hit;
        };
        const ids = new Set<number>();
        pack.cells.i.forEach((i: number) => {
          const feature = pack.features[pack.cells.f[i]];
          if (feature?.type === "lake" && inside(pack.cells.p[i][0], pack.cells.p[i][1])) ids.add(feature.i);
        });
        if (!ids.size) throw new Error("No lake has a cell inside the polygon. Sculpt the basin below 20 and finalize_terrain first.");
        for (const id of ids) {
          if (change.subtype) FMG.Features.setSubtype(id, change.subtype);
          if (change.group) FMG.Features.setGroup(id, change.group);
          if (change.name) FMG.Features.rename(id, change.name);
        }
        FMG.Layers.draw("lakes");
        return [...ids].map(id => {
          const f = pack.features[id];
          return { i: id, name: f.name, subtype: f.subtype, group: f.group, cells: f.cells };
        });
      },
      { polygon, change }
    );
  }

  /** Removes unlocked rivers whose mouth lies inside `polygon`: the generated rivers draining into that region */
  async removeRivers(polygon: Point[]) {
    const page = await this.open();
    return page.evaluate(polygon => {
      const { pack } = FMG;
      const inside = (x: number, y: number) => {
        let hit = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const [xi, yi] = polygon[i];
          const [xj, yj] = polygon[j];
          if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
        }
        return hit;
      };
      const draining = pack.rivers.filter((r: any) => {
        if (r.lock) return false; // hand-placed rivers stay
        const mouth = r.cells?.findLast((c: number) => c >= 0 && c < pack.cells.i.length);
        return mouth !== undefined && inside(pack.cells.p[mouth][0], pack.cells.p[mouth][1]);
      });
      const removed: number[] = [];
      for (const river of draining) {
        if (!pack.rivers.some((r: any) => r.i === river.i)) continue; // already gone with its basin
        FMG.Rivers.remove(river.i);
        removed.push(river.i);
      }
      FMG.Layers.draw("rivers");
      return { removed: removed.length, remaining: pack.rivers.length };
    }, polygon);
  }

  /** Draws a locked river along a polyline (map pixels, source first) through the cells it crosses */
  async addRiver(points: Point[], options: { name?: string; type?: string; sourceWidth?: number; widthFactor?: number } = {}) {
    const page = await this.open();
    return page.evaluate(
      ({ points, options }) => {
        const { pack } = FMG;
        const neighbors = (cell: number): number[] => pack.cells.c[cell];
        // cells under the line, sampled every half pixel, each a neighbour of the one before
        const cells: number[] = [];
        const push = (cell: number) => {
          const last = cells.at(-1);
          if (last === cell) return;
          if (last !== undefined && !neighbors(last).includes(cell)) {
            const bridge = neighbors(last).find(n => neighbors(n).includes(cell) && !cells.includes(n));
            if (bridge === undefined) throw new Error(`No path between cells ${last} and ${cell}; add more points`);
            cells.push(bridge);
          }
          const loop = cells.indexOf(cell);
          if (loop >= 0) cells.length = loop; // the line doubled back: cut the loop
          cells.push(cell);
        };
        for (let s = 0; s < points.length - 1; s++) {
          const [x1, y1] = points[s];
          const [x2, y2] = points[s + 1];
          const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2));
          for (let k = 0; k <= steps; k++) push(FMG.Pack.requireCell(x1 + ((x2 - x1) * k) / steps, y1 + ((y2 - y1) * k) / steps));
        }
        const id = FMG.Rivers.create(cells);
        FMG.Rivers.setLocked(id, true);
        if (options.name) FMG.Rivers.rename(id, options.name);
        if (options.type) FMG.Rivers.setType(id, options.type);
        if (options.sourceWidth !== undefined || options.widthFactor !== undefined) {
          const river = pack.rivers.find((r: any) => r.i === id);
          FMG.Rivers.setWidth(id, options.sourceWidth ?? river.sourceWidth, options.widthFactor ?? river.widthFactor);
        }
        FMG.Layers.draw("rivers");
        const river = pack.rivers.find((r: any) => r.i === id);
        return { i: id, name: river.name, type: river.type, cells: cells.length, width: river.width };
      },
      { points, options }
    );
  }

  /** Draws a route (any line group, e.g. a dashed seasonal wash) along a polyline in map pixels */
  async addRoute(points: Point[], group: string, name?: string) {
    const page = await this.open();
    return page.evaluate(
      ({ points, group, name }) => {
        const id = FMG.Routes.create(points, group);
        if (name) FMG.Routes.rename(id, name);
        FMG.Routes.setLocked(id, true);
        FMG.Layers.draw("routes");
        return { i: id, points: points.length, group };
      },
      { points, group, name }
    );
  }

  async info() {
    const page = await this.open();
    return page.evaluate(() => {
      const { pack, grid, options } = FMG;
      const live = (list: any[]) => list.filter(e => e && typeof e === "object" && !e.removed);
      const featureTypes: Record<string, number> = {};
      for (const f of live(pack.features)) {
        const key = `${f.type}:${f.subtype ?? f.group}`;
        featureTypes[key] = (featureTypes[key] ?? 0) + 1;
      }
      let land = 0;
      const biomeCells: Record<string, number> = {};
      pack.cells.h.forEach((h: number, i: number) => {
        if (h < 20) return;
        land++;
        const name = pack.biomes?.[pack.cells.biome[i]]?.name ?? String(pack.cells.biome[i]);
        biomeCells[name] = (biomeCells[name] ?? 0) + 1;
      });
      const landBiomes = Object.fromEntries(
        Object.entries(biomeCells)
          .sort((a, b) => b[1] - a[1])
          .map(([name, cells]) => [name, `${Math.round((cells / land) * 1000) / 10}%`])
      );
      return {
        azgaarVersion: FMG.VERSION,
        seed: options.map.seed,
        name: options.map.lore.name,
        climate: {
          winds: options.map.climate.winds,
          temperature: options.map.climate.temperature,
          precipitation: options.map.climate.precipitation
        },
        landBiomes,
        latitudeRange: [options.map.geography.coordinates.latS, options.map.geography.coordinates.latN],
        canvas: { width: options.map.graph.width, height: options.map.graph.height },
        points: options.map.graph.points,
        units: options.map.units.distance,
        geography: { mapSize: options.map.geography.mapSize, latitude: options.map.geography.latitude, longitude: options.map.geography.longitude },
        cells: { grid: grid.cells.i.length, pack: pack.cells.i.length, packLand: land },
        features: featureTypes,
        counts: {
          burgs: live(pack.burgs).length,
          states: live(pack.states).length,
          cultures: live(pack.cultures).length,
          religions: live(pack.religions).length,
          rivers: live(pack.rivers).length,
          routes: live(pack.routes).length,
          markers: live(pack.markers).length,
          biomes: live(pack.biomes).length
        },
        editMode: options.app.mode,
        terrainPending: Boolean((window as any).__mcpTerrainPending)
      };
    });
  }

  /** Summarises the pack cells whose centres fall inside `polygon` (map pixels) */
  async queryCells(polygon: Point[], includeCells: number) {
    const page = await this.open();
    return page.evaluate(
      ({ polygon, includeCells }) => {
        const { pack } = FMG;
        const inside = (x: number, y: number) => {
          let hit = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
          }
          return hit;
        };
        const biomeName = (id: number) => pack.biomes?.[id]?.name ?? String(id);
        const biomes: Record<string, number> = {};
        const features: Record<string, { type: string; subtype: string; name: string; cells: number }> = {};
        const burgs = new Set<number>();
        const cells: object[] = [];
        let count = 0, land = 0, sum = 0, min = 100, max = 0;
        for (const i of pack.cells.i) {
          const [x, y] = pack.cells.p[i];
          if (!inside(x, y)) continue;
          const h = pack.cells.h[i];
          count++;
          sum += h;
          min = Math.min(min, h);
          max = Math.max(max, h);
          if (h >= 20) land++;
          const biome = biomeName(pack.cells.biome[i]);
          biomes[biome] = (biomes[biome] ?? 0) + 1;
          const f = pack.features[pack.cells.f[i]];
          if (f) {
            const key = String(f.i);
            features[key] ??= { type: f.type, subtype: f.subtype, name: f.name, cells: 0 };
            features[key].cells++;
          }
          if (pack.cells.burg[i]) burgs.add(pack.cells.burg[i]);
          if (cells.length < includeCells) cells.push({ i, x, y, h, biome, feature: pack.cells.f[i] });
        }
        return {
          cells: count,
          landCells: land,
          height: count ? { min, max, mean: Math.round((sum / count) * 10) / 10 } : null,
          biomes,
          features,
          burgs: [...burgs].map(b => ({ i: b, name: pack.burgs[b]?.name })),
          sample: cells
        };
      },
      { polygon, includeCells }
    );
  }

  async list(kind: ListKind, within: FrameBox | undefined, limit: number) {
    const page = await this.open();
    return page.evaluate(
      ({ kind, within, limit }) => {
        const { pack } = FMG;
        const live = (list: any[]) => list.filter(e => e && typeof e === "object" && !e.removed);
        const inFrame = (x: number, y: number) =>
          !within || (x >= within.x && x <= within.x + within.width && y >= within.y && y <= within.y + within.height);
        let rows: object[];
        if (kind === "features") {
          rows = live(pack.features)
            .filter(f => !within || inFrame(...(pack.cells.p[f.firstCell] as [number, number])))
            .map(f => ({ i: f.i, type: f.type, subtype: f.subtype, group: f.group, name: f.name, land: f.land, cells: f.cells, border: f.border }));
        } else if (kind === "burgs") {
          rows = live(pack.burgs)
            .filter(b => b.i && inFrame(b.x, b.y))
            .map(b => ({ i: b.i, name: b.name, x: b.x, y: b.y, population: b.population, state: b.state, capital: Boolean(b.capital), group: b.group, type: b.type }));
        } else if (kind === "markers") {
          rows = live(pack.markers)
            .filter(m => inFrame(m.x, m.y))
            .map(m => ({ i: m.i, name: m.name, type: m.type, icon: m.icon, x: m.x, y: m.y, cell: m.cell, hasNote: Boolean(m.note) }));
        } else {
          rows = live(pack.routes)
            .filter(r => !within || r.points.some((p: number[]) => inFrame(p[0], p[1])))
            .map(r => ({ i: r.i, name: r.name, group: r.group, length: r.length, points: r.points.length, feature: r.feature }));
        }
        return { total: rows.length, items: rows.slice(0, limit) };
      },
      { kind, within, limit }
    );
  }

  /** PNG of the whole map, or of one frame zoomed to fill the viewport, with the UI chrome hidden */
  async screenshot(frame: FrameBox | undefined, layers: string[] | undefined): Promise<Buffer> {
    const page = await this.open();
    const previousLayers = layers
      ? await page.evaluate(ids => {
          const all: string[] = (FMG.Layers as any).layers?.map((l: any) => l.params?.id).filter(Boolean) ?? [];
          const active = all.filter(id => FMG.Layers.isOn(id));
          FMG.Layers.set(ids);
          return active;
        }, layers)
      : undefined;
    try {
      await page.evaluate(box => {
        document.body.classList.add("mcp-capture");
        if (box) {
          const k = Math.min(innerWidth / box.width, innerHeight / box.height);
          FMG.zoomTo(box.x + box.width / 2, box.y + box.height / 2, k, 0);
        } else FMG.resetZoom(0);
      }, frame ?? null);
      // the viewport redraw settles a moment after the zoom
      await page.waitForTimeout(900);
      if (!frame) return await page.screenshot({ type: "png" });
      const clip = await page.evaluate(box => {
        const ctm = (document.querySelector("#viewbox") as SVGGraphicsElement).getScreenCTM()!;
        const x = ctm.a * box.x + ctm.e;
        const y = ctm.d * box.y + ctm.f;
        return { x, y, width: ctm.a * box.width, height: ctm.d * box.height };
      }, frame);
      const viewport = page.viewportSize()!;
      const x = Math.max(0, clip.x);
      const y = Math.max(0, clip.y);
      return await page.screenshot({
        type: "png",
        clip: { x, y, width: Math.min(clip.width, viewport.width - x), height: Math.min(clip.height, viewport.height - y) }
      });
    } finally {
      await page.evaluate(() => document.body.classList.remove("mcp-capture"));
      // an empty list means the active layers could not be read; leaving the capture's layers beats hiding all
      if (previousLayers?.length) await page.evaluate(ids => FMG.Layers.set(ids), previousLayers);
    }
  }

  /** Evaluates `code` as the body of an async function with `FMG` in scope */
  async runJs(code: string): Promise<unknown> {
    const page = await this.open();
    return page.evaluate(async source => {
      const fn = new Function("FMG", `return (async () => {\n${source}\n})();`);
      const result = await fn(FMG);
      return result === undefined ? null : JSON.parse(JSON.stringify(result));
    }, code);
  }

  private recordError(message: string): void {
    this.errors.push(message);
    if (this.errors.length > 50) this.errors.shift();
  }

  private async assertNotEditing(page: Page): Promise<void> {
    const mode = await page.evaluate(() => FMG.options.app.mode as string | null);
    if (mode) throw new Error(`Azgaar is in "${mode}" edit mode; finish or cancel that edit first.`);
  }
}

export const screenshotPath = (name: string) => join("world", "build", "screenshots", `${name}.png`);
