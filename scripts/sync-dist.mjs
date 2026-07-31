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

function assertSupportedHosts(actual, manifestKey) {
  if (JSON.stringify(actual) !== JSON.stringify(supportedStudocuHosts)) {
    throw new Error(
      `${manifestKey} must contain explicit Chrome-compatible patterns for studocu.com and studocu.vn`
    );
  }
}

async function validateManifest() {
  const manifestPath = path.join(projectRoot, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assertSupportedHosts(manifest.host_permissions, "host_permissions");

  manifest.content_scripts.forEach((contentScript, index) => {
    assertSupportedHosts(contentScript.matches, `content_scripts[${index}].matches`);
  });

  manifest.web_accessible_resources.forEach((resourceGroup, index) => {
    assertSupportedHosts(
      resourceGroup.matches,
      `web_accessible_resources[${index}].matches`
    );
  });
}
