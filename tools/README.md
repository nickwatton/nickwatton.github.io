# Virtual Stages – editing guide

The pages in `vstages/` (`index.html`, `cage.html`, etc.) are **generated** by `tools/vstages-build.mjs`. Don't edit them directly: the next build overwrites your changes.

## Where to edit

Paths are relative to the repository root.

| To change… | Edit this file |
|---|---|
| Text of a page, or an endnote | `vstages/src/<page>.html` |
| Page order, titles, menu labels or menu structure | `vstages/src/pages.json` |
| Appearance, layout or animation | `vstages/vstages.css` (hand-written, not generated) |
| Page template, menu markup, popover markup | `tools/vstages-build.mjs` |

`vstages/legacy/` holds the original 1990s frameset files for reference. Nothing uses them.

## Editing workflow

1. Edit the source file in `vstages/src/` (or `vstages/src/pages.json`).
2. From the **repository root** (`nickwatton.github.io/`), run:

   ```
   node tools/vstages-build.mjs
   ```

   It should print `built 16 pages`. It needs Node.js only; there is nothing to install.
3. Preview by serving the repository root with any static web server and opening `/vstages/`.
4. Commit both the `vstages/src/` change **and** the regenerated `vstages/*.html` pages, because the site is served from the built files.

The script locates its files relative to itself, so it works from any directory, but running it from the repository root matches the path above.

## Writing source pages

Each `vstages/src/<page>.html` is just the content of the page: no `<html>`, `<head>` or menu. Use plain semantic HTML (`<h1>`, `<h2>`, `<p>`, `<blockquote>`, `<em>`, `<cite>`). Classes used by the stylesheet are `kicker` and `lede` (the "Stage One" label and its strapline) and `centre`.

### Endnotes

Write each note inline, exactly where its marker belongs:

```html
...the act of observation.<fn n="28">ZOHAR, <cite>The Quantum Self</cite>. London: Flamingo, 1991, p.26.</fn> Next sentence...
```

- `n` is the note number shown to the reader.
- The build turns each `<fn>` into a popover button at that spot and adds a plain "Notes" list at the foot of the page (shown in print and in browsers without popover support).
- Write notes as full citations so each popover stands alone (avoid "Ibid").
- If you insert or remove a note, renumber the `n` values yourself; they are not renumbered automatically.

## Adding a page

1. Create `vstages/src/<slug>.html` with the content.
2. Add the slug to `order` and `pages` (title and menu label) in `vstages/src/pages.json`, and to `menu` where it should appear.
3. Run the build command above.

`front` is the cover and becomes `index.html`; every other slug becomes `<slug>.html`.
