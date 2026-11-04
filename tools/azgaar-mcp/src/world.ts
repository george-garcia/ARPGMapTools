import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Repository root: this file runs from tools/azgaar-mcp/dist */
export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const azgaarDist = join(repoRoot, "tools", "azgaar", "dist");
export const buildDir = join(repoRoot, "world", "build");

export interface WorldConfig {
  seed: string;
  canvas: { width: number; height: number };
  points: number;
  units: { distance: { unit: string; scale: number } };
}

/** A named region of the map. `center` is a fraction of the canvas, `sizeKm` its width and height */
interface FrameSpec {
  description?: string;
  center: [number, number];
  sizeKm: [number, number];
}

/** A frame resolved to map pixels */
export interface FrameBox {
  name: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Point = [number, number];

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), "utf8")) as T;
}

export function loadConfig(): WorldConfig {
  return readJson<WorldConfig>("world/config.json");
}

export function loadFrames(config = loadConfig()): FrameBox[] {
  const specs = readJson<Record<string, FrameSpec>>("world/frames.json");
  const { width, height } = config.canvas;
  const kmPerPixel = config.units.distance.scale;
  return Object.entries(specs).map(([name, spec]) => {
    const w = spec.sizeKm[0] / kmPerPixel;
    const h = spec.sizeKm[1] / kmPerPixel;
    return {
      name,
      description: spec.description,
      x: round(spec.center[0] * width - w / 2),
      y: round(spec.center[1] * height - h / 2),
      width: round(w),
      height: round(h)
    };
  });
}

export function getFrame(name: string): FrameBox {
  const frame = loadFrames().find(f => f.name === name);
  if (!frame) throw new Error(`Unknown frame "${name}". Frames are defined in world/frames.json.`);
  return frame;
}

/** Frame-local 0-1 coordinates to map pixels */
export function toMap(frame: FrameBox, [u, v]: Point): Point {
  return [round(frame.x + u * frame.width), round(frame.y + v * frame.height)];
}

/** A path from the tool caller: absolute, or relative to the repository root */
export function resolvePath(path: string, createParent = false): string {
  const full = isAbsolute(path) ? path : join(repoRoot, path);
  if (createParent) mkdirSync(dirname(full), { recursive: true });
  return full;
}

export function assertAzgaarBuilt(): void {
  if (!existsSync(join(azgaarDist, "index.html"))) {
    throw new Error("Azgaar is not built yet. Run `npm run setup` in the ARPGMapTools repository.");
  }
}

const round = (n: number): number => Math.round(n * 100) / 100;
