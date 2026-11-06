// ============================================================
// Build script — picnuc.ua.es
//
// Usage:
//   node build.js          — one-time build
//   node build.js --watch  — watch mode
//
// Strategy:
//   - HTML pages: src/html/page.html + src/content/<lang>.json → one page per language
//     (the language list lives in src/languages.json; sitemap.xml is generated too)
//   - Shared JS (same on all pages)  → js/shared.js
//   - Shared page JS                 → js/app.js
//   - CSS stays as two separate files (index.min.css + readability.min.css)
//
// Shared JS is concatenated; the application bundle resolves ES module imports.
// ============================================================

import * as esbuild from "esbuild";
import { mkdir, readFile, writeFile, watch } from "node:fs/promises";
import { dirname } from "node:path";
import { readdirSync } from "node:fs";
import { languageVariables, renderPage, renderSitemap } from "./tools/render-page.js";

const isWatch = process.argv.includes("--watch");

// ── Budget ─────────────────────────────────────────────────────────────────

const MAX_BUNDLE_KB = 200;

function checkBundleSize(out, code) {
  const kb = Buffer.byteLength(code, "utf8") / 1024;
  if (kb > MAX_BUNDLE_KB) {
    console.warn(
      `  WARNING: ${out} exceeds budget: ${kb.toFixed(1)} KB (limit ${MAX_BUNDLE_KB} KB)`
    );
  }
}

// ── JS bundles definition ──────────────────────────────────────────────────

const jsBundles = [
  // Shared: loaded on all three language pages, cached across language switches
  {
    out: "js/shared.js",
    src: [
      "src/js/i18n.js", // localized message lookup
      "src/js/image-health.js", // shared image error handling
      "src/js/site-controls.js", // shared theme, navigation and dialog controls
      "src/js/photo-gallery.js", // photo lightbox and gallery navigation
      "src/js/language-switch.js", // language switcher UI
      "src/js/details-refinement.js", // collapsible sections polish
      "src/js/venue-gallery.js", // venue photo gallery / lightbox
      "src/js/app-helpers.js", // app logic shared across locales
    ],
  },
  // Shared application logic for all locales
  {
    out: "js/app.js",
    src: ["src/js/app.js"],
    bundle: true,
  },
];

const languageSettings = JSON.parse(await readFile("src/languages.json", "utf8"));

const localeBundles = languageSettings.languages.map(({ code: locale }) => ({
  locale,
  src: `src/locales/${locale}.json`,
  out: `js/locale-${locale}.js`,
}));

// ── HTML pages definition ──────────────────────────────────────────────────

const pages = languageSettings.languages.map(({ code, path }) => ({
  locale: code,
  out: `${path}index.html`,
}));

// ── CSS bundles definition ─────────────────────────────────────────────────

// Style parts are concatenated in numeric order; the order defines the cascade.
const styleParts = readdirSync("src/css/style")
  .filter((name) => name.endsWith(".css"))
  .sort()
  .map((name) => `src/css/style/${name}`);

const cssBundles = [
  { out: "css/index.min.css", src: styleParts },
  { out: "css/readability.min.css", src: ["src/css/readability.css"] },
];

// ── Helpers ────────────────────────────────────────────────────────────────

async function readAll(files) {
  const parts = await Promise.all(files.map((f) => readFile(f, "utf8")));
  return parts.join("\n");
}

async function buildBundle({ src, out, loader = "js", bundle = false }) {
  if (bundle) {
    const result = await esbuild.build({
      entryPoints: src,
      outfile: out,
      bundle: true,
      minify: true,
      charset: "utf8",
      format: "iife",
      platform: "browser",
      write: false,
    });
    const code = result.outputFiles[0].text;
    checkBundleSize(out, code);
    await writeFile(out, code, "utf8");
    const kb = (code.length / 1024).toFixed(1);
    console.log(`  ✓ ${out.padEnd(28)} ${kb} KB`);
    return;
  }

  const code = await readAll(src);
  const result = await esbuild.transform(code, {
    minify: true,
    charset: "utf8",
    loader,
  });
  checkBundleSize(out, result.code);
  await writeFile(out, result.code, "utf8");
  const kb = (result.code.length / 1024).toFixed(1);
  console.log(`  ✓ ${out.padEnd(28)} ${kb} KB`);
}

async function buildLocaleBundle({ src, out }) {
  const messages = JSON.parse(await readFile(src, "utf8"));
  const result = await esbuild.transform(`window.localeMessages = ${JSON.stringify(messages)};`, {
    minify: true,
    charset: "utf8",
    loader: "js",
  });
  await writeFile(out, result.code, "utf8");
  const kb = (result.code.length / 1024).toFixed(1);
  console.log(`  ✓ ${out.padEnd(28)} ${kb} KB`);
}

async function buildPage({ locale, out }, template) {
  const content = JSON.parse(await readFile(`src/content/${locale}.json`, "utf8"));
  const computed = languageVariables(languageSettings, locale);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, renderPage(template, content, locale, computed), "utf8");
  console.log(`  ✓ ${out.padEnd(28)} (${locale})`);
}

async function buildAll() {
  console.log("\nBuilding...\n");
  const template = await readFile("src/html/page.html", "utf8");
  await Promise.all([
    ...pages.map((page) => buildPage(page, template)),
    writeFile("sitemap.xml", renderSitemap(languageSettings), "utf8"),
    ...jsBundles.map((b) => buildBundle(b)),
    ...localeBundles.map((bundle) => buildLocaleBundle(bundle)),
    ...cssBundles.map((b) => buildBundle({ ...b, loader: "css" })),
  ]);
  console.log("\nDone.");
}

// ── Watch mode ─────────────────────────────────────────────────────────────

async function watchMode() {
  console.log("Watch mode — watching src/ for changes...\n");
  await buildAll();

  const watcher = watch("./src", { recursive: true });
  let debounce = null;

  for await (const event of watcher) {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      console.log(`\n  changed: ${event.filename}`);
      await buildAll();
    }, 150);
  }
}

// ── Entry point ────────────────────────────────────────────────────────────

if (isWatch) {
  watchMode();
} else {
  buildAll();
}
