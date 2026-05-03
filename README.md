# Blog Themes

CSS theme files for the blog platform. The active theme is loaded dynamically via a `<link>` tag — no frontend redeploy needed when you push a new CSS file to the CDN.

---

## Quick start

```bash
npm install       # install the sass compiler (one-time)
npm run build     # compile SCSS → default.css
npm run watch     # compile on every file save (dev mode)
```

> **Never edit `default.css` directly.** It is generated output. Edit the SCSS partials and rebuild.

---

## How the theme reaches the browser

```
scss/ partials
      ↓  npm run build
themes/default.scss  →  themes/default.css
                                ↓  git push
                        GitHub repo (this repo)
                                ↓  jsDelivr CDN
            https://cdn.jsdelivr.net/gh/USER/REPO@BRANCH/themes/default.css
                                ↓  Admin → Theme Management
                        <link rel="stylesheet" href="…cdn url…">  injected into every page
```

After pushing a commit, jsDelivr caches the file. To bust the cache either:
- Reference a specific git tag in the CDN URL (recommended for production)
- Append `?v=<hash>` to force a fresh pull

---

## Repository layout

```
blog-themes/
├── package.json           ← build scripts + sass devDep
├── .gitignore
├── README.md              ← you are here
├── CLAUDE.md              ← context for Claude Code
└── themes/
    ├── default.scss       ← ENTRY FILE — imports all partials in order
    ├── default.css        ← compiled output, committed to git
    └── scss/              ← edit these files
        ├── _variables.scss
        ├── _base.scss
        ├── _layout.scss
        ├── _nav-blog.scss
        ├── _nav-admin.scss
        ├── _buttons.scss
        ├── _forms.scss
        ├── _tables.scss
        ├── _alerts.scss
        ├── _feed.scss
        ├── _article.scss
        ├── _formatting.scss
        ├── _editor.scss
        └── _responsive.scss
```

---

## Partial reference

Each partial is self-contained. Open the one that owns the UI area you want to change.

| Partial | Controls |
|---|---|
| [`_variables.scss`](themes/scss/_variables.scss) | All design tokens (`--bg`, `--text`, `--accent`, fonts, widths). **Start here for global colour/font changes.** |
| [`_base.scss`](themes/scss/_base.scss) | Bare HTML elements: `html`, `body`, `h1`–`h3`, `p`, `a`, `hr` |
| [`_layout.scss`](themes/scss/_layout.scss) | Page shell: sticky `header`, `main` centering, `footer`, `.divider` |
| [`_nav-blog.scss`](themes/scss/_nav-blog.scss) | Blog + auth top navigation — logo circle, nav links, login pill button, logout button |
| [`_nav-admin.scss`](themes/scss/_nav-admin.scss) | Admin dark top bar (`body > nav`) with section links |
| [`_buttons.scss`](themes/scss/_buttons.scss) | `button` and `input[type=submit]` — base dark pill + green primary variant |
| [`_forms.scss`](themes/scss/_forms.scss) | Generic `form` layout, `label`, text/email/password/url `input`s, search bar pill |
| [`_tables.scss`](themes/scss/_tables.scss) | Base `table` / `th` / `td` used on admin pages (users, articles, theme list) |
| [`_alerts.scss`](themes/scss/_alerts.scss) | `[role=alert]` error banners, `.loading-indicator`, `.end-of-feed` |
| [`_feed.scss`](themes/scss/_feed.scss) | Article feed cards on the home page and search results |
| [`_article.scss`](themes/scss/_article.scss) | Article reading page: big title, date line, back button, `.article-body` container |
| [`_formatting.scss`](themes/scss/_formatting.scss) | **All EditorJS block styles.** One section per block type. |
| [`_editor.scss`](themes/scss/_editor.scss) | `#editorjs` holder used on the create / update article pages |
| [`_responsive.scss`](themes/scss/_responsive.scss) | All `@media` breakpoints in one place (≤ 768 px and ≤ 480 px) |

---

## Design tokens

All tokens are CSS custom properties defined in `_variables.scss`. They cascade into every partial automatically — change a value once and it applies everywhere.

| Token | Default | Purpose |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--surface` | `#ffffff` | Card / input backgrounds |
| `--border` | `rgba(0,0,0,0.15)` | Strong borders |
| `--border-light` | `#e6e6e6` | Subtle dividers |
| `--text` | `#242424` | Primary text + dark buttons |
| `--muted` | `#6b6b6b` | Secondary labels, icons |
| `--subtle` | `#9b9b9b` | Timestamps, placeholders |
| `--accent` | `#1a8917` | Primary action (green) |
| `--accent-hover` | `#156812` | Hover state for `--accent` |
| `--danger` | `#c05e5e` | Destructive action colour |
| `--radius` | `4px` | Default border radius |
| `--font-serif` | charter / Georgia | Article body text |
| `--font-sans` | sohne / Helvetica | UI, headings, labels |
| `--font-mono` | Courier Prime | Code blocks |
| `--max-w` | `1192px` | Full-page max width |
| `--content-w` | `680px` | Reading column width |

### Example: change the accent colour

Open `_variables.scss` and edit:
```scss
--accent:       #0066cc;   // was #1a8917
--accent-hover: #0052a3;   // was #156812
```
Then `npm run build`.

---

## EditorJS block classes (`_formatting.scss`)

Every block type in a rendered article gets a `formatting-*` class. They are all isolated in `_formatting.scss`, so you can restyle article content without touching any other part of the theme.

| Class | Element | Block type |
|---|---|---|
| `.formatting-paragraph` | `<p>` | Paragraph |
| `.formatting-header` | `<h1>`–`<h6>` | Header |
| `.formatting-list-unordered` | `<ul>` | Unordered list |
| `.formatting-list-ordered` | `<ol>` | Ordered list |
| `.formatting-checklist` | `<ul>` | Checklist (wrapper) |
| `.formatting-checklist-item` | `<li>` | Checklist item |
| `.formatting-checklist-item.checked` | `<li>` | Checked item |
| `.formatting-warning` | `<div>` | Warning block |
| `.formatting-quote` | `<blockquote>` | Quote |
| `.formatting-code` | `<pre>` | Code block |
| `.formatting-delimiter` | `<hr>` | Delimiter (renders as `···`) |
| `.formatting-raw` | `<div>` | Raw HTML |
| `.formatting-table` | `<table>` | Table |

---

## Responsive breakpoints

Both breakpoints live in [`_responsive.scss`](themes/scss/_responsive.scss):

| Breakpoint | Targets |
|---|---|
| `≤ 768px` | Tablets + large phones — nav wraps, forms go full-width, tables scroll horizontally |
| `≤ 480px` | Phones — tighter headings, slightly smaller body text, compact footer |

---

## Adding a new theme

1. Create a new SCSS entry file, e.g. `themes/dark.scss`
2. Copy the `@use` list from `default.scss`
3. Override tokens in a new `scss/_variables-dark.scss` and add it first in the import list
4. Run `sass themes/dark.scss themes/dark.css --style=expanded --no-source-map`
5. Commit `dark.css` and register the CDN URL in the admin Theme Management page

---

## Deployment checklist

- [ ] Edit partials in `scss/`
- [ ] `npm run build` — confirm no errors
- [ ] Review `default.css` diff to check nothing unexpected changed
- [ ] `git add themes/default.css && git commit -m "theme: <description>"`
- [ ] `git push`
- [ ] If using a pinned CDN URL (tag/SHA), update the URL in the admin Theme Management page
