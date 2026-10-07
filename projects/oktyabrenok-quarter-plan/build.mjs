// Сборка PLAN.md -> plan.pdf через headless Chrome.
// Использование: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { marked } from "marked";

const md = readFileSync("PLAN.md", "utf8");

// --- оглавление из h2 ---
const headings = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
const toc = headings
  .map((h) => `<li>${h.replace(/`/g, "")}</li>`)
  .join("");

// --- разметка печатных классов: не разрывать таблицы и списки с чек-листами ---
let html = marked.parse(md, { gfm: true, breaks: false });

// календарные таблицы (7 колонок = дни недели) печатаем мельче
html = html
  .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="break-before">$1</h2>')
  .replace(/<table>/g, (m, off, s) =>
    (s.slice(off, off + 400).match(/<th/g) || []).length >= 6
      ? '<table class="keep compact">'
      : '<table class="keep">');

const CSS = `
@page { size: A4; margin: 18mm 16mm 16mm 16mm; }
@page :first { margin-top: 14mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 10.6pt;
  line-height: 1.5;
  color: #1c1a18;
  margin: 0;
  hyphens: auto;
}

/* ---------- обложка ---------- */
.cover {
  height: 247mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  page-break-after: always;
  border-top: 8px solid #b0341a;
  padding-top: 10mm;
}
.cover .kicker {
  font-family: "Trebuchet MS", "Helvetica Neue", sans-serif;
  font-size: 9pt; letter-spacing: .28em; text-transform: uppercase;
  color: #b0341a; margin-bottom: 14mm;
}
.cover h1 {
  font-family: "Trebuchet MS", "Helvetica Neue", sans-serif;
  font-size: 34pt; line-height: 1.08; margin: 0 0 6mm;
  color: #1c1a18; letter-spacing: -.01em;
}
.cover .sub {
  font-size: 13pt; color: #4a4540; margin-bottom: 12mm; max-width: 130mm;
}
.cover .meta {
  font-family: "Trebuchet MS", sans-serif;
  font-size: 9.6pt; color: #3d3833;
  border-top: 1px solid #d8d2c9; padding-top: 5mm;
}
.cover .meta b { color: #1c1a18; }
.cover .flame { font-size: 30pt; color: #d4601f; line-height: 1; margin-bottom: 6mm; }

/* ---------- оглавление ---------- */
.toc { page-break-after: always; }
.toc h2 { border: none; padding: 0; margin: 0 0 6mm; font-size: 17pt; }
.toc ol { counter-reset: t; list-style: none; padding: 0; margin: 0;
  font-family: "Trebuchet MS", sans-serif; font-size: 10.4pt; }
.toc li { counter-increment: t; padding: 2.6mm 0; border-bottom: 1px dotted #d8d2c9; }
.toc li::before { content: counter(t) ". "; color: #b0341a; font-weight: 700; }

/* ---------- заголовки ---------- */
h1 {
  font-family: "Trebuchet MS", sans-serif; font-size: 20pt;
  margin: 0 0 6mm; padding-bottom: 3mm;
  border-bottom: 3px solid #b0341a;
}
h2 {
  font-family: "Trebuchet MS", sans-serif; font-size: 15pt;
  margin: 0 0 4mm; padding-bottom: 2mm;
  border-bottom: 1px solid #cfc8bd;
  color: #8f2a14;
}
.break-before { break-before: page; }
h3 {
  font-family: "Trebuchet MS", sans-serif; font-size: 11.6pt;
  margin: 7mm 0 2.5mm; color: #1c1a18;
}
h4 { font-family: "Trebuchet MS", sans-serif; font-size: 10.4pt;
  margin: 5mm 0 2mm; color: #6a635b; text-transform: uppercase; letter-spacing: .06em; }
p { margin: 0 0 3mm; }
ul, ol { margin: 0 0 3.5mm; padding-left: 6.5mm; }
li { margin-bottom: 1.4mm; }
li > ul, li > ol { margin-top: 1.4mm; }
strong { font-weight: 700; }
hr { border: none; border-top: 1px solid #e2ddd4; margin: 6mm 0; }

/* ---------- таблицы ---------- */
table {
  width: 100%; border-collapse: collapse; margin: 3mm 0 6mm;
  font-family: "Trebuchet MS", "Helvetica Neue", sans-serif;
  font-size: 8.9pt; line-height: 1.35;
}
.keep { break-inside: avoid; }
thead { display: table-header-group; }
th {
  background: #2f2a25; color: #fff; text-align: left;
  padding: 2.2mm 2.6mm; font-weight: 700; letter-spacing: .02em;
  border: 1px solid #2f2a25;
}
td { padding: 2.2mm 2.6mm; border: 1px solid #d8d2c9; vertical-align: top; }
table.compact { font-size: 7.4pt; line-height: 1.28; }
table.compact th, table.compact td { padding: 1.6mm 1.8mm; }
table.compact th { font-size: 7.4pt; }
tbody tr:nth-child(even) td { background: #faf7f2; }

/* ---------- цитаты и код ---------- */
blockquote {
  margin: 4mm 0; padding: 3mm 4mm;
  background: #fbf3ec; border-left: 4px solid #d4601f;
  font-size: 10.4pt; font-style: italic; break-inside: avoid;
}
blockquote p:last-child { margin-bottom: 0; }
code {
  font-family: "Courier New", monospace; font-size: 9pt;
  background: #f1ede6; padding: .6mm 1.4mm; border-radius: 2px;
}

/* ---------- чек-листы ---------- */
ul li input, li:has(> input) { list-style: none; }
ul li::marker { color: #b0341a; }
input[type=checkbox] { margin-right: 2mm; }

/* ---------- печать ---------- */
@media print {
  a { color: inherit; text-decoration: none; }
  h2, h3 { break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
}
`;

const page = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<title>Кто такой Октябренок? — план на четверть</title>
<style>${CSS}</style></head>
<body>
<section class="cover">
  <div class="flame">&#128293;</div>
  <div class="kicker">Система шефского наставничества &laquo;4 + 1&raquo;</div>
  <h1>Кто такой Октябренок?</h1>
  <div class="sub">План работы на четверть: тематические дни недели Пн&ndash;Сб,
  ежедневная модель &laquo;Невидимая поддержка&raquo;, еженедельный Час Огонька,
  ежемесячный пионерский сбор.</div>
  <div class="meta">
    <b>Подшефные:</b> 1-й класс, 24&ndash;28 человек, 4 группы<br>
    <b>Шефы:</b> 4-й класс, 5 человек + запасной<br>
    <b>Срок:</b> 10 учебных недель, 3 пионерских сбора<br>
    <b>Куратор:</b> учитель 1-го класса
  </div>
</section>
<section class="toc"><h2>Содержание</h2><ol>${toc}</ol></section>
${html}
</body></html>`;

writeFileSync("plan.html", page);

const chrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-pdf-header-footer",
  "--print-to-pdf=" + process.cwd() + "/plan.pdf",
  "file://" + process.cwd() + "/plan.html",
], { stdio: "inherit" });

console.log("ok: plan.pdf");