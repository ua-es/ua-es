# Development and deployment

## Quick start

Requirements: Node.js 22 or newer and Python 3. GNU Make is needed only for
`make` commands.

```sh
npm ci
make dev
```

`make dev` builds assets, watches `src/` for changes, and serves the site at
<http://localhost:8000/>. Stop both background processes with `Ctrl-C`. To use
another port, run `make dev PORT=8080`.

To preview the site without running tests or watching for changes, use
`make serve` and open <http://localhost:8000/>. It rebuilds the generated assets
before starting the server.

## Common commands

| Command        | What it does                                                    |
| -------------- | --------------------------------------------------------------- |
| `make install` | Install exact npm dependencies from `package-lock.json`.        |
| `make build`   | Generate production JavaScript and CSS assets.                  |
| `make check`   | Run unit and Chromium end-to-end tests.                         |
| `make format`  | Format JavaScript, CSS, and translation sources.                |
| `make watch`   | Build once, then rebuild when files in `src/` change.           |
| `make serve`   | Build assets and serve the site at `http://localhost:$(PORT)/`. |
| `make dev`     | Watch source files and serve the site for local development.    |
| `make help`    | Show available Make targets.                                    |

Set `PORT` to change the local server port, for example `make serve PORT=8080`.
Make targets install npm dependencies when needed. `make test` is an alias for
`make check`. To run tests, install Playwright's Chromium browser once with
`npx playwright install chromium`, then use `make check` (or `npm test`).
For a focused run, use `npm run test:unit` or `npm run test:e2e`.

## Source files and generated assets

Edit readable files in `src/`. The matching files under `js/` and `css/` are
generated, minified assets referenced by the website. Do not edit generated
files by hand; run `make build` after changing source.

### Styles

- `src/css/style.css` — main site styles; generates `css/index.min.css`.
- `src/css/readability.css` — readability adjustments; generates
  `css/readability.min.css`.

### JavaScript

- `src/js/app.js` — shared page behavior for all locales, including event
  content and interactive UI.
- `src/js/contact-form.js` — contact form behavior, validation, and request
  message generation.
- `src/js/app-helpers.js` — shared DOM, city, and image helpers.
- `src/js/site-controls.js` — theme selector, mobile navigation, and dialogs.
- `src/js/photo-gallery.js` and `src/js/venue-gallery.js` — lightboxes and
  gallery navigation.
- `src/js/countdown.js` — timezone-aware event countdown.
- `src/js/i18n.js` — translation lookup with explicit errors for missing keys.
- Other shared features live in `src/js/`, including image handling,
  responsive images, language switching, SEO metadata, and details refinement.

### Translations

`src/locales/uk.json`, `en.json`, and `es.json` contain the language catalogs.
Keep their nested key paths and interpolation placeholders in sync. Add UI
text to all three catalogs and use `window.i18n.t("feature.message")` in
JavaScript. For interpolated text, pass named values, for example
`window.i18n.t("gallery.counter", { current, total })`.

## Build and tests

`build.js` creates `js/shared.js`, the shared `js/app.js` bundle, and one locale
bundle per language. It also compiles both CSS files. Run `make build` to
regenerate them.

Playwright starts a local server and builds the site before browser tests.
`make check` (or `npm test`) runs unit tests and the complete Chromium
end-to-end suite. The unit tests also check that locale keys, translations, and
interpolation placeholders match across all languages.

## Deployment

There is no automated Pages deployment workflow or `make deploy` target in
this repository. The GitHub Actions quality workflow runs `npm test` on pushes
and pull requests; it verifies changes but does not publish the site. Deploy
using the repository's configured hosting process after the required checks
pass.
