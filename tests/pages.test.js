import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderPage, templateKeys } from "../tools/render-page.js";

const locales = ["uk", "en", "es"];
const template = await readFile(new URL("../src/html/page.html", import.meta.url), "utf8");
const catalogs = Object.fromEntries(
  await Promise.all(
    locales.map(async (locale) => [
      locale,
      JSON.parse(await readFile(new URL(`../src/content/${locale}.json`, import.meta.url), "utf8")),
    ])
  )
);

test("every locale defines exactly the keys used by the page template", () => {
  const used = [...new Set(templateKeys(template))].sort();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(catalogs[locale]).sort(), used, `content keys for ${locale}`);
  }
});

test("pages render without leftover placeholders", () => {
  for (const locale of locales) {
    const html = renderPage(template, catalogs[locale], locale);
    assert.doesNotMatch(html, /\{\{[\w.-]+\}\}/, `placeholders left in ${locale}`);
    assert.match(html, new RegExp(`<html lang="${locale}"`));
  }
});

test("rendering fails loudly when a key is missing", () => {
  assert.throws(() => renderPage("{{missing.key}}", {}, "uk"), /Missing content key/);
});
