# Project development

## Source and generated files

Edit readable files in `src/`. The matching files under `js/` and `css/` are
generated, minified assets referenced by the website. Do not edit generated
files by hand; rebuild them after changing source.

Install development dependencies with `npm ci`, then use:

- `npm run build` — generate all production JavaScript and CSS assets.
- `npm run watch` — rebuild assets when files under `src/` change.
- `npm test` — run unit tests and Chromium end-to-end tests.
- `npm run test:unit` — run unit tests only.
- `npm run test:e2e` — run browser tests only.
- `npm run format` — format JavaScript and CSS sources with Prettier.

The first browser-test run also requires Playwright's Chromium browser. Install
it with `npx playwright install chromium`; CI installs it automatically.
The GitHub Actions quality workflow runs this full test command for pushes and
pull requests. To make it a required pre-deploy gate, mark the `test` job in
`Quality checks` as a required status check in the repository's branch rules.
This repository does not currently have an automated Pages deployment
workflow; the quality job verifies changes but does not publish the site.

The same commands are available through `make`. Run `make help` to see the
targets. `make dev` runs the tests, starts the asset watcher (which builds once
on startup), and serves the site at `http://localhost:8000/`. Stop both
processes with `Ctrl-C`. To use another port, run `make dev PORT=8080`.

## Generating styles

Edit the readable stylesheets in `src/css/`:

- `src/css/style.css` — the main site styles; generates `css/index.min.css`.
- `src/css/readability.css` — readability adjustments; generates
  `css/readability.min.css`.

From the project root, run `npm run build` to generate both stylesheets (and
the JavaScript bundles). The generated CSS files are used by all three pages
and should not be edited directly. While working on styles, run `npm run watch`
to rebuild the generated files whenever a source file changes.

To preview the site locally, build it and start a static server from the project
root with `python3 -m http.server 8000`. Then open `http://localhost:8000/`.

## JavaScript files

- `src/js/app.js` — shared page behavior for all locales: forms, event content
  and interactive UI. Feature handlers have descriptive names such as
  `openContactForm`, `renderCityMap` and `showHeroSlide`; page data is grouped
  in named collections such as `menuItems`, `cityDetails` and `galleryPhotos`.
- `src/js/contact-form.js` — contact form behavior, validation and request
  message generation, initialized by the shared application.
- `src/js/site-controls.js` — shared theme selector, mobile navigation, dialog
  lifecycle and version menu behavior.
- `src/js/photo-gallery.js` — shared photo lightbox, swipe and keyboard controls;
  each language app provides its photo list and translated status messages.
- `src/js/countdown.js` — event countdown, including timezone-aware start time
  and the ended state.
- `src/js/i18n.js` — shared translation lookup with explicit errors for missing
  keys or interpolation values.
- `src/locales/uk.json`, `en.json`, `es.json` — language catalogs. The build
  creates one small `js/locale-<language>.js` file per page; it loads before
  the shared scripts. Group keys in nested objects by feature, while keeping
  their dotted paths and interpolation placeholders identical across catalogs.
- `src/js/image-health.js` — shared image-loading error handling that uses the
  active language catalog.
- `src/js/image-variants.js` — selects responsive image variants.
- `src/js/responsive-images.js` — image loading behavior and responsive image
  setup.
- `src/js/seo-locales.js` — language alternate-link metadata.
- `src/js/language-switch.js` — language switching and the theme toggle.
- `src/js/details-refinement.js` — expandable details and related page polish.
- `src/js/venue-gallery.js` — venue photo gallery and lightbox.

`build.js` combines the shared scripts and bundles the application's ES module
imports into the files in `js/`, generates the locale scripts from
`src/locales/`, and compiles `src/css/style.css` and
`src/css/readability.css` into the minified stylesheets in `css/`. Add JavaScript
UI copy to all three locale catalogs and use
`window.i18n.t("feature.message")` in code. For interpolated text, pass
named values such as `window.i18n.t("gallery.counter", { current, total })`.
The unit tests check catalog keys, interpolation placeholders, and JavaScript
translation references; missing runtime messages or values throw explicit
errors rather than silently falling back.
