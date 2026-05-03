// Local dev: runs sass --watch and copies default.css to the Next.js
// public folder after every successful rebuild.
// Usage: npm run dev  (from blog-themes/)

const { spawn } = require("child_process");
const { copyFileSync, watch } = require("fs");
const { resolve } = require("path");

const SRC = resolve(__dirname, "../themes/default.css");
const DEST = resolve(__dirname, "../../blog/frontend/public/themes/default.css");

function copy() {
  try {
    copyFileSync(SRC, DEST);
    console.log(`[theme] copied → frontend/public/themes/default.css`);
  } catch (err) {
    console.error(`[theme] copy failed: ${err.message}`);
  }
}

// Initial copy
copy();

// Start sass --watch in the background
const sass = spawn(
  "npx",
  [
    "sass",
    "themes/default.scss",
    "themes/default.css",
    "--style=expanded",
    "--no-source-map",
    "--watch",
  ],
  { cwd: resolve(__dirname, ".."), stdio: "inherit", shell: true }
);

sass.on("error", (err) => console.error("[sass]", err.message));
sass.on("close", (code) => process.exit(code));

// Watch the compiled output and copy to Next.js public/ on every change
let debounce = null;
watch(SRC, () => {
  clearTimeout(debounce);
  debounce = setTimeout(copy, 50);
});

process.on("SIGINT", () => {
  sass.kill();
  process.exit(0);
});
