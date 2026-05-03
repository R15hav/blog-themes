// Compile and version a theme.
//
// Usage:
//   node scripts/release.js <theme-name>
//   npm run release:forest
//   npm run release:white-paper
//
// What it does:
//   1. Reads the version from package.json
//   2. Compiles themes/<name>/<name>.scss → themes/<name>/<name>.<version>.css
//   3. Copies to themes/<name>/<name>.css  (latest alias)
//   4. Removes any previous versioned .css files for that theme
//   5. Prints the jsDelivr CDN URL

"use strict";

const { execSync } = require("child_process");
const { copyFileSync, readdirSync, unlinkSync } = require("fs");
const { resolve, join } = require("path");

const themeName = process.argv[2];
if (!themeName) {
  console.error("Usage: node scripts/release.js <theme-name>");
  process.exit(1);
}

const ROOT     = resolve(__dirname, "..");
const pkg      = require(join(ROOT, "package.json"));
const version  = pkg.version;
const THEME_DIR = join(ROOT, "themes", themeName);

const SRC       = join(THEME_DIR, `${themeName}.scss`);
const VERSIONED = join(THEME_DIR, `${themeName}.${version}.css`);
const LATEST    = join(THEME_DIR, `${themeName}.css`);

// Remove stale versioned files for this theme
const stale = readdirSync(THEME_DIR).filter(
  (f) =>
    new RegExp(`^${themeName}\\.\\d+\\.\\d+\\.\\d+\\.css$`).test(f) &&
    f !== `${themeName}.${version}.css`
);
stale.forEach((f) => {
  unlinkSync(join(THEME_DIR, f));
  console.log(`[${themeName}] removed stale: ${f}`);
});

// Compile
console.log(`[${themeName}] compiling → ${themeName}.${version}.css …`);
execSync(
  `npx sass "${SRC}" "${VERSIONED}" --style=compressed --no-source-map`,
  { cwd: ROOT, stdio: "inherit" }
);

// Sync latest alias
copyFileSync(VERSIONED, LATEST);
console.log(`[${themeName}] synced → ${themeName}.css`);

// Print CDN URL
console.log("");
console.log("──────────────────────────────────────────────────────────────");
console.log(`  Theme          : ${themeName}`);
console.log(`  Versioned file : themes/${themeName}/${themeName}.${version}.css`);
console.log("");
console.log("  jsDelivr CDN URL (paste into Admin → Theme Management):");
console.log(`  https://cdn.jsdelivr.net/gh/<USER>/<REPO>@main/themes/${themeName}/${themeName}.${version}.css`);
console.log("");
console.log("  Next steps:");
console.log(`  1. git add themes/${themeName}/`);
console.log(`  2. git commit -m "theme(${themeName}): v${version}"`);
console.log("  3. git push");
console.log("  4. Update the active theme URL in Admin → Theme Management");
console.log("──────────────────────────────────────────────────────────────");
