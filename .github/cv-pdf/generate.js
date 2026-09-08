#!/usr/bin/env node
// Renders a CV PDF from a Jekyll page's Markdown source (index.md / ru/index.md).
// Jekyll front matter is handled automatically by md-to-pdf (gray-matter);
// the site-only language-switcher line is stripped here since it has no
// place in a standalone PDF.
const fs = require("fs");
const path = require("path");
const { mdToPdf } = require("md-to-pdf");

const [, , srcPath, destPath] = process.argv;
if (!srcPath || !destPath) {
  console.error("Usage: generate.js <source.md> <dest.pdf>");
  process.exit(1);
}

const switcherLine = /^(\*\*EN\*\*\s*\|\s*\[RU\]\(.*\)|\[EN\]\(.*\)\s*\|\s*\*\*RU\*\*)$/;

const raw = fs.readFileSync(srcPath, "utf8");
const content = raw
  .split("\n")
  .filter((line) => !switcherLine.test(line.trim()))
  .join("\n");

(async () => {
  await mdToPdf(
    { content },
    {
      dest: path.resolve(destPath),
      basedir: path.dirname(path.resolve(srcPath)),
      stylesheet: [path.resolve(__dirname, "style.css")],
      pdf_options: { format: "A4", printBackground: true },
      launch_options: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
    }
  );
  console.log(`Generated ${destPath} from ${srcPath}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
