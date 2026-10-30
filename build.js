// ============================================================
// Build script — picnuc.ua.es
//
// Usage:
//   node build.js          — one-time build
//   node build.js --watch  — watch mode
//
// Strategy:
//   - Shared JS (same on all pages)  → js/shared.js
//   - Shared page JS                 → js/app.js
//   - CSS stays as two separate files (index.min.css + readability.min.css)
//
// Shared JS is concatenated; the application bundle resolves ES module imports.
// ============================================================

import * as esbuild from "esbuild";
import { readFile, writeFile, watch } from "node:fs/promises";

const isWatch = process.argv.includes("--watch");

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
      "src/js/image-variants.js", // responsive image srcset switching
      "src/js/responsive-images.js", // lazy / eager loading logic
      "src/js/seo-locales.js", // injects hreflang <link> tags into <head>
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

const localeBundles = ["uk", "en", "es"].map((locale) => ({
  locale,
  src: `src/locales/${locale}.json`,
  out: `js/locale-${locale}.js`,
}));

// ── CSS bundles definition ─────────────────────────────────────────────────

const cssBundles = [
  { out: "css/index.min.css", src: ["src/css/style.css"] },
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

async function buildAll() {
  console.log("\n🔨  Building...\n");
  await Promise.all([
    ...jsBundles.map((b) => buildBundle(b)),
    ...localeBundles.map((bundle) => buildLocaleBundle(bundle)),
    ...cssBundles.map((b) => buildBundle({ ...b, loader: "css" })),
  ]);
  console.log("\n✅  Done.");
}

// ── Watch mode ─────────────────────────────────────────────────────────────

async function watchMode() {
  console.log("👀  Watch mode — watching src/ for changes...\n");
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
