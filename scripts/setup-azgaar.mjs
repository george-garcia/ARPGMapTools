// Fetches the Azgaar release pinned in tools/azgaar/azgaar.lock.json, builds it, and makes sure
// Playwright has a Chromium to drive it with. Safe to re-run: it skips work that is already done.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const azgaarDir = join(root, "tools", "azgaar");
const sourceDir = join(azgaarDir, "source");
const distDir = join(azgaarDir, "dist");
const stampFile = join(distDir, ".azgaar-version");
const lock = JSON.parse(readFileSync(join(azgaarDir, "azgaar.lock.json"), "utf8"));
const stamp = `${lock.tag} ${lock.commit}`;
const force = process.argv.includes("--force");

// Windows needs a shell to find npm/npx, and a shell splits unquoted paths at spaces
const isWindows = process.platform === "win32";
const quote = arg => (isWindows && /\s/.test(arg) ? `"${arg}"` : arg);

function run(command, args, cwd, env = {}) {
  console.log(`> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args.map(quote), {
    cwd,
    stdio: "inherit",
    shell: isWindows,
    env: { ...process.env, ...env }
  });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed with code ${result.status}`);
}

function capture(command, args, cwd) {
  const result = spawnSync(command, args.map(quote), { cwd, encoding: "utf8", shell: isWindows });
  return result.status === 0 ? result.stdout.trim() : null;
}

function fetchSource() {
  if (existsSync(sourceDir) && capture("git", ["rev-parse", "HEAD"], sourceDir) === lock.commit) {
    console.log(`Azgaar ${lock.tag} source already present.`);
    return;
  }
  rmSync(sourceDir, { recursive: true, force: true });
  run("git", ["-c", "advice.detachedHead=false", "clone", "--depth", "1", "--branch", lock.tag, lock.repo, sourceDir], root, {
    GIT_LFS_SKIP_SMUDGE: "1"
  });
  const head = capture("git", ["rev-parse", "HEAD"], sourceDir);
  if (head !== lock.commit) {
    throw new Error(`Tag ${lock.tag} resolved to ${head}, expected ${lock.commit}. Refusing to build an unpinned version.`);
  }
}

function buildAzgaar() {
  // install scripts would fetch Electron and git hooks, neither of which a browser build needs
  run("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], sourceDir, {
    ELECTRON_SKIP_BINARY_DOWNLOAD: "1",
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1"
  });
  // the desktop app's renderer build: relative asset paths, no analytics, no PWA service worker
  run("npx", ["vite", "build", "--mode", "electron"], sourceDir);
  rmSync(distDir, { recursive: true, force: true });
  cpSync(join(sourceDir, "dist-electron", "renderer"), distDir, { recursive: true });
  writeFileSync(stampFile, stamp);
}

async function ensureChromium() {
  const { chromium } = await import("playwright");
  if (existsSync(chromium.executablePath())) {
    console.log("Playwright Chromium already installed.");
    return;
  }
  run("npx", ["playwright", "install", "chromium"], root);
}

if (!force && existsSync(stampFile) && readFileSync(stampFile, "utf8").trim() === stamp) {
  console.log(`Azgaar ${lock.tag} is already built in tools/azgaar/dist.`);
} else {
  fetchSource();
  buildAzgaar();
  console.log(`Built Azgaar ${lock.tag} into tools/azgaar/dist.`);
}
await ensureChromium();
