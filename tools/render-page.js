// Renders the HTML page template for one language.
//
// The template (src/html/page.html) contains {{key}} placeholders.
// Page copy comes from src/content/<lang>.json. Values that follow from the
// language list (src/languages.json) are computed here and use the reserved
// "language." and "site." key prefixes, so they never appear in the catalogs.

const PLACEHOLDER = /\{\{([\w.-]+)\}\}/g;

/** Keys that are computed from src/languages.json instead of read from a catalog. */
export const COMPUTED_PREFIXES = ["language.", "site.", "meeting."];

export function isComputedKey(key) {
  return COMPUTED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

/** Returns the placeholder keys used by a template, in document order. */
export function templateKeys(template) {
  return [...template.matchAll(PLACEHOLDER)].map((match) => match[1]);
}

/** Builds the computed values for one language. */
export function languageVariables({ siteUrl, defaultLanguage, languages }, code) {
  const current = languages.find((language) => language.code === code);
  if (!current) throw new Error(`Unknown language "${code}" in src/languages.json`);
  const defaultPage = languages.find((language) => language.code === defaultLanguage);
  if (!defaultPage) throw new Error(`Default language "${defaultLanguage}" is not in the list`);

  const depth = current.path.split("/").filter(Boolean).length;
  const pagePath = (language) => `${language.path}index.html`;
  return {
    "site.url": siteUrl,
    "language.code": current.code,
    "language.url": siteUrl + current.path,
    "language.base": depth ? `\n    <base href="${"../".repeat(depth)}">` : "",
    "language.codes-json": JSON.stringify(languages.map((language) => language.code)),
    "language.options": languages
      .map((language) => {
        const selected = language.code === current.code ? ' selected="selected"' : "";
        return `<option value="${language.code}" data-href="${pagePath(language)}"${selected}>${language.label}</option>`;
      })
      .join("\n          "),
    "language.alternates": [
      ...languages.map(
        (language) =>
          `<link rel="alternate" hreflang="${language.code}" href="${siteUrl + language.path}">`
      ),
      `<link rel="alternate" hreflang="x-default" href="${siteUrl + defaultPage.path}">`,
    ].join("\n    "),
  };
}

/** Builds sitemap.xml for all languages. */
export function renderSitemap({ siteUrl, languages }) {
  const urls = languages.map((language) => `<url><loc>${siteUrl + language.path}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
}

/** Fills the template. Throws on a missing key so mistakes never reach the site. */
export function renderPage(template, content, locale, computed = {}) {
  const values = { ...content, ...computed };
  return template.replace(PLACEHOLDER, (_, key) => {
    if (!Object.hasOwn(values, key)) {
      throw new Error(`Missing content key "${key}" for locale "${locale}"`);
    }
    return values[key];
  });
}
