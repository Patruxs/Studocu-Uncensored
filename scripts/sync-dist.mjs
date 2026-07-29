import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDir = path.join(projectRoot, "dist");
const watchMode = process.argv.includes("--watch");
const supportedStudocuHosts = [
  "*://*.studocu.com/*",
  "*://*.studocu.vn/*",
];

let buildRunning = false;
let rebuildRequested = false;
let debounceTimer;
