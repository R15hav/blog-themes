# blog-themes

Open-source CSS theme collection for the [blog platform](https://github.com/R15hav/blog). Themes are pure CSS — no JavaScript, no build-time dependencies on the frontend. A theme is activated in the blog admin and delivered over jsDelivr CDN, so switching themes or shipping a new one never requires a frontend redeploy.

---

## How it works

```
themes/<name>/scss/   ← edit SCSS partials here
        ↓  npm run release:<name>
themes/<name>/<name>.<version>.css   ← compiled, versioned output
        ↓  git push
GitHub (this repo)
        ↓  jsDelivr CDN
https://cdn.jsdelivr.net/gh/R15hav/blog-themes@main/themes/<name>/<name>.<version>.css
        ↓  Admin → Theme Management (paste URL)
<link rel="stylesheet" href="…">   injected after globals.css on every page
```

The theme stylesheet loads **after** the platform's `globals.css`, so any rule in a theme overrides the defaults automatically. No `!important`, no hacks.

---

## Available themes

| Theme | Surface | Accent | Character |
|---|---|---|---|
| `forest` | deep forest green | warm amber | dark editorial |
| `white-paper` | crisp white | editorial blue | clean typographic |
| `papyrus` | sandy gold | terracotta | pith-strip texture, sharp corners |
| `washi` | organic white + green tint | mossy green | handmade, rounded |
| `cotton` | soft off-white | archival steel blue | neutral archival |
| `laid` | traditional cream | printing-press red | horizontal chain-line texture |
| `wove` | near-white, faint warm | sky blue | smooth, uniform |
| `cold-press` | warm natural white | cerulean blue | toothy watercolour surface |
| `hot-press` | near-pure white | vivid indigo | razor-sharp, high-contrast |
| `gloss` | brilliant cool white | vivid magenta | reflective nav, mineral |
| `matte` | warm near-white | deep rich blue | flat, no-sheen |
| `stone` | light cool grey | teal | mineral grain, very rounded |

---

## Quick start

```bash
git clone https://github.com/R15hav/blog-themes.git
cd blog-themes
npm install          # installs the sass compiler (one-time)
```

Compile and version a theme:

```bash
npm run release:white-paper   # → themes/white-paper/white-paper.1.0.0.css
npm run release:forest
npm run release:papyrus
# … one script per theme, all listed in package.json
```

The release script:
1. Reads the version from `package.json`
2. Compiles `themes/<name>/<name>.scss` → `themes/<name>/<name>.<version>.css`
3. Copies to `themes/<name>/<name>.css` (a latest alias for development)
4. Removes any stale versioned files for that theme
5. Prints the jsDelivr CDN URL to paste into the admin

---

## Repository layout

```
blog-themes/
├── package.json            ← release scripts + sass devDep
├── .gitignore
├── README.md
├── CLAUDE.md               ← AI-assistant context
├── scripts/
│   └── release.js          ← versioned build script
└── themes/
    └── <theme-name>/
        ├── <name>.scss             ← entry file (only @use imports)
        ├── <name>.<version>.css    ← compiled + versioned output (committed)
        ├── <name>.css              ← latest alias (committed)
        └── scss/
            ├── _variables.scss     ← THE ONLY file with hardcoded values
            ├── _layout.scss        ← page shell, header, footer
            ├── _nav-blog.scss      ← top navigation, progress bar
            ├── _nav-admin.scss     ← admin sidebar
            ├── _buttons.scss       ← .btn-primary, .btn-ghost, icon buttons
            ├── _forms.scss         ← inputs, textareas, focus glows
            ├── _tables.scss        ← data tables, dashboard table
            ├── _alerts.scss        ← banners, badges, end-of-feed
            ├── _feed.scss          ← home feed cards, hero, search page
            ├── _article.scss       ← article reading page, comments, reactions
            ├── _formatting.scss    ← all EditorJS block output classes
            ├── _editor.scss        ← create / update article editor shell
            ├── _admin.scss         ← admin pages: KPI cards, modals, tabs
            ├── _auth.scss          ← login, register, forgot-password pages
            ├── _profile.scss       ← profile page, modals, experience cards
            └── _responsive.scss    ← @media 768px and 480px breakpoints
```

The rule is simple: **`_variables.scss` is the only place with hardcoded color, spacing, or radius values.** Every other partial reads those values through `var(--token)`. This means you can build a complete new theme by writing just one file.

---

## Design token system

The blog frontend uses a **Paper design system** with a fixed set of CSS custom properties. Your `_variables.scss` overrides these at `:root`. Every component in every partial — across the blog feed, admin dashboard, auth pages, article editor — reads these same names.

### Color tokens

| Token | Role |
|---|---|
| `--paper` | Primary page background |
| `--paper-2` | Cards, sidebar, secondary surfaces |
| `--paper-3` | Hover tints, muted fills |
| `--rule` | Default border / divider color |
| `--rule-soft` | Subtle secondary divider |
| `--ink` | Primary text |
| `--ink-2` | Secondary text |
| `--ink-3` | Tertiary / muted text |
| `--ink-4` | Ultra-muted labels, timestamps |
| `--accent` | Brand color — buttons, links, highlights |
| `--accent-soft` | Tinted accent background (use for chips, tags) |
| `--accent-ink` | Darker accent — readable on `--paper` |
| `--ok` | Success states |
| `--warn` | Warning states |

### Radius tokens

| Token | Default | Use |
|---|---|---|
| `--r-sm` | `4px` | Small elements — chips, badges |
| `--r` | `6px` | Default — inputs, cards, buttons |
| `--r-lg` | `10px` | Large surfaces — modals, panels |

### Color format

All values in this repo use **oklch**, the perceptually uniform color space:

```scss
oklch(<lightness 0–1>  <chroma 0–0.4>  <hue 0–360>)
```

Examples:
```scss
oklch(0.50 0.145 255)      // deep blue (chroma 0.145, hue 255°)
oklch(0.88 0.060 82)       // sandy gold (chroma 0.060, hue 82°)
oklch(0.12 0.020 150)      // forest near-black (chroma 0.020, hue 150°)
oklch(0.58 0.220 330)      // vivid magenta (chroma 0.220, hue 330°)
```

Use `color-mix(in oklch, var(--token) 20%, transparent)` for token-relative transparency rather than hardcoding `oklch(... / 0.2)`. This keeps `--accent-soft` correct even if `--accent` is changed.

---

## Building your own theme

### Step 1 — Scaffold the folder

Copy an existing theme as your starting point. `white-paper` is the best base for light themes; `forest` for dark ones.

```bash
cp -r themes/white-paper themes/my-theme
cd themes/my-theme

# Rename the entry file
mv white-paper.scss my-theme.scss
mv white-paper.1.0.0.css my-theme.1.0.0.css
mv white-paper.css my-theme.css
```

Update the `@use` imports inside `my-theme.scss` — they point to `scss/` partials with no names to change, so the file is already correct. Just update the top comment:

```scss
// ── My Theme — entry point ────────────────────────────────────────────────
@use 'scss/variables';
@use 'scss/layout';
// … rest unchanged
```

### Step 2 — Design your palette in `_variables.scss`

This is the only file you **must** edit. Everything else is optional.

```scss
// themes/my-theme/scss/_variables.scss

:root {
  // ── Backgrounds ───────────────────────────────────────────────────────
  --paper:       oklch(0.960 0.018 86);   // your page surface
  --paper-2:     oklch(0.940 0.016 84);   // cards, sidebar
  --paper-3:     oklch(0.916 0.014 82);   // hover tints

  // ── Borders ───────────────────────────────────────────────────────────
  --rule:        oklch(0.840 0.016 80);
  --rule-soft:   oklch(0.888 0.013 82);

  // ── Ink ───────────────────────────────────────────────────────────────
  --ink:         oklch(0.185 0.018 74);   // primary text
  --ink-2:       oklch(0.305 0.016 72);
  --ink-3:       oklch(0.465 0.013 70);
  --ink-4:       oklch(0.610 0.010 68);   // timestamps, labels

  // ── Accent ────────────────────────────────────────────────────────────
  --accent:      oklch(0.500 0.145 255);
  --accent-soft: oklch(0.500 0.145 255 / 0.11);  // or color-mix()
  --accent-ink:  oklch(0.360 0.150 258);

  // ── Semantic ──────────────────────────────────────────────────────────
  --ok:          oklch(0.490 0.115 142);
  --warn:        oklch(0.580 0.132 70);

  // ── Radii ─────────────────────────────────────────────────────────────
  --r-sm: 4px;
  --r:    6px;
  --r-lg: 10px;
}
```

**Tips for choosing values:**
- Keep `--paper` → `--paper-3` moving in the same lightness direction (all getting darker for light themes, lighter for dark themes)
- `--ink` should contrast against `--paper` by at least `0.65` in lightness for WCAG AA
- `--accent-soft` should be `--accent` at 10–15% opacity — use `color-mix(in oklch, var(--accent) 12%, transparent)` to keep it relative
- `--accent-ink` should be 0.10–0.15 lightness units darker than `--accent` so links are readable on `--paper`

### Step 3 — Layer 2 overrides (optional)

Token overrides cover roughly 90% of the visual difference between themes. For effects that tokens can't express — background textures, box shadows, gradients, backdrop-filter — edit the relevant partial directly.

**Common Layer 2 targets:**

`_layout.scss` — page background texture or gradient:
```scss
body {
  background-image: repeating-linear-gradient(
    to bottom,
    color-mix(in oklch, var(--rule) 20%, transparent) 0px,
    transparent 1px,
    transparent 24px
  );
}
```

`_nav-blog.scss` — glossy or frosted nav:
```scss
.nav {
  background: color-mix(in oklch, var(--paper) 85%, transparent);
  backdrop-filter: blur(12px) saturate(1.2);
  box-shadow: 0 1px 0 var(--rule-soft), 0 2px 12px color-mix(in oklch, var(--rule) 15%, transparent);
}
```

`_buttons.scss` — custom primary button treatment:
```scss
.btn-primary {
  background: var(--accent);
  color: var(--paper);
  border-color: transparent;

  &:hover {
    background: var(--accent-ink);
  }
}
```

`_forms.scss` — focus glow color:
```scss
.field input:focus,
.search-page input:focus {
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 22%, transparent);
}
```

**Rule:** Layer 2 overrides must still reference `var(--token)` wherever possible. Hardcode a value only when there is genuinely no token that expresses the intent.

### Step 4 — Adding surface textures (advanced)

Textures are built from CSS background layers — no image assets, no external files. Three techniques used in this repo:

#### Repeating gradients (for structured patterns)

```scss
// Horizontal fiber lines — good for paper textures
body {
  background-image: repeating-linear-gradient(
    to bottom,
    color-mix(in oklch, var(--rule) 20%, transparent) 0px,
    transparent 1px,
    transparent 11px
  );
}
```

Use a slight angle (`89.5deg`) instead of `to bottom` to make lines look hand-cut rather than mechanical.

#### SVG `feTurbulence` noise (for organic grain)

Embed an SVG filter as a data URI in `background-image`. No external file needed:

```scss
body {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.35 0 0 0 0 0.10 0 0 0 0.055 0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  background-attachment: fixed;  // stays still as you scroll — feels physical
}
```

The `feColorMatrix` controls the grain color. The 20-value matrix format:
```
values='0 0 0 0 <R>  0 0 0 0 <G>  0 0 0 0 <B>  0 0 0 <opacity> 0'
```
Where `R`, `G`, `B` are 0–1 decimal values for the grain color, and `opacity` is the maximum grain opacity (the noise A channel modulates it).

**`type='fractalNoise'` vs `type='turbulence'`:**

| Type | Pattern | Use for |
|---|---|---|
| `fractalNoise` | Smooth, cloud-like | Grain, mineral patches, organic surfaces |
| `turbulence` | Sharp, discontinuous | Bumps, tooth, rough surfaces (cold-press paper) |

#### Layering multiple backgrounds

```scss
body {
  background-color: var(--paper);       // always set a solid fallback
  background-image:
    url("data:image/svg+xml,…"),        // ① grain (top)
    repeating-linear-gradient(…),       // ② fiber lines
    repeating-linear-gradient(…);       // ③ cross-weave (bottom)
  background-size: 256px 256px, auto, auto;
  background-attachment: fixed, scroll, scroll;
}
```

CSS paints background layers top to bottom (first in the list = topmost). Keep the grain layer at the top so it softens the hard gradient edges beneath it.

Make content containers semi-transparent so the texture bleeds through:

```scss
main,
.feed,
.article-shell,
.auth-shell,
.admin-shell {
  background: color-mix(in oklch, var(--paper) 88%, transparent);
}
```

### Step 5 — Add the release script

In `package.json`, add an entry for your theme:

```json
"scripts": {
  "release:my-theme": "node scripts/release.js my-theme"
}
```

### Step 6 — Compile and verify

```bash
npm run release:my-theme
```

This outputs `themes/my-theme/my-theme.1.0.0.css`. Open it in a browser to verify (or load it via the blog admin).

**Checklist before committing:**
- [ ] All pages look correct: feed, article, auth, admin, profile, editor
- [ ] Text passes contrast at normal reading size (WCAG AA = 4.5:1)
- [ ] Mobile at 480px and 768px — run through `_responsive.scss` breakpoints
- [ ] Dark/light system preference — does the theme still look intentional?
- [ ] No hardcoded values outside `_variables.scss` (except Layer 2 intentional overrides)

### Step 7 — Commit

```bash
git add themes/my-theme/
git commit -m "theme(my-theme): initial release v1.0.0"
git push
```

The CDN URL to register in the blog admin:
```
https://cdn.jsdelivr.net/gh/R15hav/blog-themes@main/themes/my-theme/my-theme.1.0.0.css
```

---

## Versioning and CDN cache busting

jsDelivr caches by URL path. To force a fresh CDN fetch, change the filename — which means bumping the version in `package.json` before running `npm run release:<name>`.

```bash
# 1. Bump version in package.json  (e.g. 1.0.0 → 1.1.0)
# 2. Recompile
npm run release:my-theme

# 3. Commit both the new versioned file and the updated package.json
git add themes/my-theme/ package.json
git commit -m "theme(my-theme): v1.1.0"
git push

# 4. Update the CDN URL in Admin → Theme Management
#    from:  …my-theme.1.0.0.css
#    to:    …my-theme.1.1.0.css
```

The `<name>.css` file (no version) is always a copy of the latest versioned file. It is **not** cache-bust-safe for production use — its URL is stable so jsDelivr may serve a stale copy. Always use the versioned URL in the admin.

---

## Contributing

Contributions are welcome — new themes, texture improvements, bug fixes, and documentation.

### What makes a good theme contribution

- **A clear identity.** The theme should have a distinct visual concept — a real paper type, a material, an era, a light condition. "slightly different blue" is not a theme.
- **Uses only the token system.** `_variables.scss` is the only file with hardcoded values. Layer 2 component overrides are acceptable when tokens genuinely cannot express the effect.
- **Readable at normal size.** Text must meet WCAG AA contrast (4.5:1 for body text). Use the oklch lightness gap between `--paper` and `--ink` as a guide — it should be at least 0.65.
- **Works across all pages.** The blog has four distinct surfaces: feed, article reading, auth forms, and admin dashboard. A theme must look intentional on all of them.
- **No hardcoded pixel sizes or font stacks** in component partials unless targeting a specific override that `globals.css` cannot handle.

### Contribution workflow

1. **Fork** this repo and create a branch: `theme/<your-theme-name>`

2. **Scaffold** from the closest existing theme:
   ```bash
   cp -r themes/white-paper themes/<your-theme>
   ```

3. **Build and test** (see [Step 6](#step-6--compile-and-verify) above)

4. **Add the release script** to `package.json`

5. **Open a pull request** against `master`. Include in the PR description:
   - The visual concept / inspiration
   - A screenshot or description of the surface + accent combination
   - Which Layer 2 overrides you added and why tokens weren't sufficient

### Naming conventions

- Folder and script names: `kebab-case` (`cold-press`, `hot-press`, `white-paper`)
- SCSS partial comments: `// ── <Theme Name> — <partial name> ─────`
- Commit messages: `theme(<name>): <description>` (e.g. `theme(papyrus): add pith-strip texture`)
- Version bump commits: `theme(<name>): v<version>` (e.g. `theme(stone): v1.1.0`)

### Code style

- **oklch for all color values.** No hex, no `rgb()`, no `hsl()`.
- **`color-mix(in oklch, …)` for opacity variants** — never hardcode `oklch(L C H / 0.1)` when `color-mix(in oklch, var(--accent) 10%, transparent)` keeps the value token-relative.
- **No SCSS variables** — all tokens are CSS custom properties in `:root`. No `$sass-variable` anywhere.
- **No mixins or functions** — plain, readable SCSS only.
- **One partial per concern** — do not add unrelated rules to an existing partial.
- **Texture layers must have comments** explaining what each background-image layer does. SVG data URIs are opaque; a one-line comment above each is required.

### Reporting issues

Open a GitHub issue with:
- The theme name
- Which page / component looks wrong
- A screenshot if possible
- Your browser and OS

---

## Partial reference

| Partial | Controls |
|---|---|
| `_variables.scss` | All design tokens. **The only file with hardcoded values.** |
| `_layout.scss` | Page shell: `body`, `main`, `header`, `footer`, `.wordmark`, `.avatar`, `.tag`, `.meta` |
| `_nav-blog.scss` | Blog top nav: `.nav`, `.nav-link`, `.nav-search`, `.progress-rail`, `.progress-fill` |
| `_nav-admin.scss` | Admin sidebar: `.admin-shell`, `.admin-side`, `.admin-nav`, `.admin-nav-link` |
| `_buttons.scss` | `.btn`, `.btn-primary`, `.btn-ghost`, `.icon-btn`, `.rail-btn` |
| `_forms.scss` | `input`, `textarea`, `select`, `.field`, `.comment-form`, `.profile-field` |
| `_tables.scss` | `table.dataset`, `.dashboard-table` |
| `_alerts.scss` | `[role=alert]`, `.msg-success`, `.msg-error`, status badges, `.dash-badge`, `.end-of-feed` |
| `_feed.scss` | `.feed`, `.hero`, `.list-item`, `.section-eyebrow`, `.search-page` |
| `_article.scss` | `.article-shell`, `.toc-*`, `.article-body`, `.byline`, `.reaction-btn`, `.comment` |
| `_formatting.scss` | All `.formatting-*` classes (EditorJS block output) |
| `_editor.scss` | `.editor-shell`, `.editor-title`, `.editor-body`, `#editorjs` |
| `_admin.scss` | KPI cards, tabs, theme page, modal, dashboard, pagination |
| `_auth.scss` | `.auth-shell`, `.auth-form`, `.notice`, `.auth-divider` |
| `_profile.scss` | `.profile-page`, `.profile-modal`, `.exp-card`, `.profile-summary-card` |
| `_responsive.scss` | `@media 768px` and `@media 480px` breakpoints |

---

## EditorJS block classes

All rendered article content goes through `_formatting.scss`. Each EditorJS block type gets a `formatting-*` wrapper class.

| Class | Element | Block |
|---|---|---|
| `.formatting-paragraph` | `<p>` | Paragraph |
| `.formatting-header` | `<h1>`–`<h6>` | Heading |
| `.formatting-list-unordered` | `<ul>` | Bulleted list |
| `.formatting-list-ordered` | `<ol>` | Numbered list |
| `.formatting-checklist` | `<ul>` | Checklist wrapper |
| `.formatting-checklist-item` | `<li>` | Checklist item |
| `.formatting-checklist-item.checked` | `<li>` | Checked state |
| `.formatting-quote` | `<blockquote>` | Pull quote |
| `.formatting-code` | `<pre>` | Code block |
| `.formatting-warning` | `<div>` | Warning callout |
| `.formatting-delimiter` | `<hr>` | Section break (renders `···`) |
| `.formatting-table` | `<table>` | Table |
| `.formatting-raw` | `<div>` | Raw HTML embed |

---

## License

MIT — free to use, modify, and redistribute. If you build a theme and find it useful, a PR back to this repo is always appreciated.
