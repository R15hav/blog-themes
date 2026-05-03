// Compile and version the Forest theme.
//
// Usage:
//   npm run release:forest
//
// What it does:
//   1. Reads the version from package.json (e.g. "1.0.0")
//   2. Compiles themes/forest.scss → themes/forest.1.0.0.css  (versioned — committed)
//   3. Also writes themes/forest.css                           (latest alias — committed)
//   4. Prints the jsDelivr CDN URL to paste into the admin
//
// To ship a new version:
//   1. Bump "version" in package.json
//   2. npm run release:forest
//   3. git add themes/forest.*.css && git commit -m "theme(forest): v<new>"
//   4. git push
//   5. Update the active theme URL in Admin → Theme Management

"use strict";

const { execSync } = require("child_process");
const { copyFileSync, readdirSync, unlinkSync } = require("fs");
const { resolve, join } = require("path");

const ROOT = resolve(__dirname, "..");
const pkg = require(join(ROOT, "package.json"));
const version = pkg.version;

if (!version) {
  console.error('No "version" field found in package.json');
  process.exit(1);
}

const THEMES_DIR = join(ROOT, "themes");
const SRC = join(THEMES_DIR, "forest.scss");
const VERSIONED = join(THEMES_DIR, `forest.${version}.css`);
const LATEST = join(THEMES_DIR, "forest.css");

// Remove any older versioned forest files so the directory stays clean
const stale = readdirSync(THEMES_DIR).filter(
  (f) => /^forest\.\d+\.\d+\.\d+\.css$/.test(f) && f !== `forest.${version}.css`
);
stale.forEach((f) => {
  unlinkSync(join(THEMES_DIR, f));
  console.log(`[forest] removed stale file: ${f}`);
});

// Compile to the versioned filename
console.log(`[forest] compiling → forest.${version}.css …`);
execSync(
  `npx sass "${SRC}" "${VERSIONED}" --style=compressed --no-source-map`,
  { cwd: ROOT, stdio: "inherit" }
);

// Keep forest.css in sync (latest alias — useful for local dev)
copyFileSync(VERSIONED, LATEST);
console.log(`[forest] synced → forest.css`);

// Print the CDN URL for easy copy-paste
console.log("");
console.log("──────────────────────────────────────────────────────────────");
console.log(`  Versioned file : themes/forest.${version}.css`);
console.log("");
console.log("  jsDelivr CDN URL (paste into Admin → Theme Management):");
console.log(`  https://cdn.jsdelivr.net/gh/<USER>/<REPO>@main/themes/forest.${version}.css`);
console.log("");
console.log("  Next steps:");
console.log("  1. git add themes/forest.css themes/forest.*.css");
console.log(`  2. git commit -m "theme(forest): v${version}"`);
console.log("  3. git push");
console.log("  4. Update the active theme URL in Admin → Theme Management");
console.log("──────────────────────────────────────────────────────────────");
