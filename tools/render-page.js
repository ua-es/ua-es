// Renders the HTML page template for one language.
//
// The template (src/html/page.html) contains {{key}} placeholders.
// Each language catalog (src/content/<lang>.json) maps keys to HTML-ready text.

const PLACEHOLDER = /\{\{([\w.-]+)\}\}/g;

/** Returns the placeholder keys used by a template, in document order. */
export function templateKeys(template) {
  return [...template.matchAll(PLACEHOLDER)].map((match) => match[1]);
}

/** Fills the template. Throws on a missing key so mistakes never reach the site. */
export function renderPage(template, content, locale) {
  return template.replace(PLACEHOLDER, (_, key) => {
    if (!Object.hasOwn(content, key)) {
      throw new Error(`Missing content key "${key}" for locale "${locale}"`);
    }
    return content[key];
  });
}
