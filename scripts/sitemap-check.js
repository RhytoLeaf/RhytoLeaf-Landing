#!/usr/bin/env node
/**
 * CI consistency check for the static site.
 *
 * Verifies that:
 *   1. every <loc> in sitemap.xml resolves to a file in the repository, and
 *   2. every page in apps/ is listed in sitemap.xml (so new app pages are
 *      forced to register themselves in the sitemap).
 *
 * No dependencies. Exits non-zero if any problem is found.
 * Run from anywhere:  node scripts/sitemap-check.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const xml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urls.length) {
  console.error("FAIL: sitemap.xml contains no <loc> entries");
  process.exit(1);
}

let failures = 0;

// 1. Every sitemap URL must resolve to a file (site root → index.html)
for (const url of urls) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  const file = path.join(root, pathname === "/" ? "index.html" : pathname);
  if (!fs.existsSync(file)) {
    console.error(`FAIL: no file for ${url} (expected ${path.relative(root, file)})`);
    failures++;
  }
}

// 2. Every app page must appear in the sitemap
const inSitemap = new Set(urls.map((u) => u.replace(/^https?:\/\/[^/]+/, "")));
const appFiles = fs.readdirSync(path.join(root, "apps")).filter((f) => f.endsWith(".html"));
for (const f of appFiles) {
  if (!inSitemap.has(`/apps/${f}`)) {
    console.error(`FAIL: /apps/${f} exists but is not listed in sitemap.xml`);
    failures++;
  }
}

if (failures) {
  console.error(`\n${failures} problem(s) found`);
  process.exit(1);
}

console.log(
  `OK: ${urls.length} sitemap URLs resolve to files; all ${appFiles.length} app pages are listed`
);
