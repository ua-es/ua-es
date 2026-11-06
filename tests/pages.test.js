import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  isComputedKey,
  languageVariables,
  renderPage,
  templateKeys,
} from "../tools/render-page.js";

const languageSettings = JSON.parse(
  await readFile(new URL("../src/languages.json", import.meta.url), "utf8")
);
const locales = languageSettings.languages.map((language) => language.code);
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
  const used = [...new Set(templateKeys(template))].filter((key) => !isComputedKey(key)).sort();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(catalogs[locale]).sort(), used, `content keys for ${locale}`);
  }
});

test("pages render without leftover placeholders", () => {
  for (const locale of locales) {
    const computed = languageVariables(languageSettings, locale);
    const html = renderPage(template, catalogs[locale], locale, computed);
    assert.doesNotMatch(html, /\{\{[\w.-]+\}\}/, `placeholders left in ${locale}`);
    assert.match(html, new RegExp(`<html lang="${locale}"`));
  }
});

test("rendering fails loudly when a key is missing", () => {
  assert.throws(() => renderPage("{{missing.key}}", {}, "uk"), /Missing content key/);
});

test("the language list is consistent", () => {
  const codes = locales;
  assert.equal(new Set(codes).size, codes.length, "language codes are unique");
  assert.ok(codes.includes(languageSettings.defaultLanguage), "default language is listed");
  for (const locale of locales) {
    const html = renderPage(
      template,
      catalogs[locale],
      locale,
      languageVariables(languageSettings, locale)
    );
    for (const code of codes) {
      assert.ok(html.includes(`hreflang="${code}"`), `${locale} page links to ${code}`);
      assert.ok(html.includes(`<option value="${code}"`), `${locale} switcher offers ${code}`);
    }
  }
});
