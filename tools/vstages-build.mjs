// Builds vstages/*.html from vstages/src/*.html + pages.json. No dependencies.
//   node tools/vstages-build.mjs
// Source fragments mark endnotes inline as <fn n="7">note text</fn>; each becomes a
// popover button at the marker plus a plain footnote list for print / no-popover browsers.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'vstages');
const cfg = JSON.parse(readFileSync(join(root, 'src', 'pages.json'), 'utf8'));
const href = (slug) => (slug === 'front' ? './' : `${slug}.html`);
const file = (slug) => (slug === 'front' ? 'index.html' : `${slug}.html`);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function menuList(items, current) {
  const li = items.map((it) => {
    if (it.page) {
      const here = it.page === current;
      return `<li><a href="${href(it.page)}"${here ? ' aria-current="page"' : ''}>${esc(cfg.pages[it.page].menu)}</a></li>`;
    }
    const sub = it.sub ? ` <span class="sub">${esc(it.sub)}</span>` : '';
    return `<li class="group"><span class="group-label">${esc(it.group)}${sub}</span>${menuList(it.items, current)}</li>`;
  });
  return `<ul>${li.join('')}</ul>`;
}

function build(slug, i) {
  const meta = cfg.pages[slug];
  let body = readFileSync(join(root, 'src', `${slug}.html`), 'utf8');

  const notes = [];
  body = body.replace(/<fn n="(\d+)">([\s\S]*?)<\/fn>/g, (_, n, text) => {
    notes.push({ n, text });
    return `<button class="fn" type="button" popovertarget="n${n}" interestfor="n${n}" aria-label="Note ${n}"><sup>${n}</sup></button>` +
      `<span class="note" popover id="n${n}" role="note"><b class="note-n">${n}</b> ${text}</span>`;
  });

  const prev = cfg.order[i - 1], next = cfg.order[i + 1];
  const pager = `<nav class="pager" aria-label="Pages">` +
    (prev ? `<a rel="prev" href="${href(prev)}"><span>Previous</span> ${esc(cfg.pages[prev].title)}</a>` : '<span></span>') +
    (next ? `<a rel="next" href="${href(next)}"><span>Next</span> ${esc(cfg.pages[next].title)}</a>` : '<span></span>') +
    `</nav>`;
  const footnotes = notes.length
    ? `\n<aside class="notes" aria-label="Notes"><h2>Notes</h2><ol>${notes
        .map(({ n, text }) => `<li value="${n}" id="note-${n}">${text}</li>`).join('')}</ol></aside>`
    : '';

  const title = slug === 'front' ? cfg.site : `${meta.title} – ${cfg.site}`;
  const speculation = JSON.stringify({ prefetch: [{ where: { selector_matches: '.pager a, #menu a' }, eagerness: 'moderate' }] });

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(cfg.site)}: a 1995 MA dissertation by ${esc(cfg.author)}, rebuilt for the web.">
<link rel="stylesheet" href="vstages.css">
<script type="speculationrules">${speculation}</script>
</head>
<body class="page-${slug}">
<button class="menu-toggle" type="button" popovertarget="menu">Contents</button>
<nav id="menu" popover aria-label="Contents">
<p class="menu-title"><a href="./">${esc(cfg.site)}</a></p>
${menuList(cfg.menu, slug)}
</nav>
<main id="content">
<article>
${body.trim()}
</article>${footnotes}
${pager}
</main>
</body>
</html>
`;
}

cfg.order.forEach((slug, i) => writeFileSync(join(root, file(slug)), build(slug, i)));

// Old frameset URLs still resolve
const stub = `<!doctype html>\n<meta charset="utf-8">\n<meta http-equiv="refresh" content="0; url=./">\n<link rel="canonical" href="./">\n<title>Virtual Stages</title>\n<a href="./">Virtual Stages</a>\n`;
writeFileSync(join(root, 'vstages.htm'), stub);
writeFileSync(join(root, 'index.htm'), stub);
console.log(`built ${cfg.order.length} pages`);
