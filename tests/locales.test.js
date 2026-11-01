import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const localeCodes = ["uk", "en", "es"];
const archivePhotoIds = [
  "archive-forest",
  "archive-beach",
  "img-8336",
  "archive-big",
  "archive-tents",
  "img-4325",
  "archive-family",
  "archive-autumn",
];
const meetingScenes = ["sea", "park", "table", "waterfront"];
const cityNameIds = [
  "sevilla",
  "malaga",
  "torremolinos",
  "benalmadena",
  "marbella",
  "jerez",
  "valencia",
  "granada",
  "cordoba",
  "madrid",
  "alicante",
  "asturias",
  "fuengirola",
  "san-pedro",
  "cadiz",
  "huelva",
  "barcelona",
  "portugal",
  "chiclana",
  "lisbon",
  "porto",
  "faro",
  "coimbra",
  "bilbao",
  "santander",
  "santiago",
  "coruna",
  "vigo",
  "leon",
  "zaragoza",
  "pamplona",
  "jaen",
  "almeria",
  "ronda",
  "dos-hermanas",
  "rinconada",
  "nerja",
  "estepona",
  "tarifa",
];
const rawCatalogs = Object.fromEntries(
  await Promise.all(
    localeCodes.map(async (locale) => [
      locale,
      JSON.parse(await readFile(new URL(`../src/locales/${locale}.json`, import.meta.url))),
    ])
  )
);
function flattenCatalog(catalog, prefix = "", flattened = {}) {
  for (const [key, value] of Object.entries(catalog)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenCatalog(value, path, flattened);
    } else {
      flattened[path] = value;
    }
  }
  return flattened;
}
const catalogs = Object.fromEntries(
  localeCodes.map((locale) => [locale, flattenCatalog(rawCatalogs[locale])])
);
const i18nSource = await readFile(new URL("../src/js/i18n.js", import.meta.url), "utf8");
const translationSources = (await readdir(new URL("../src/js/", import.meta.url)))
  .filter((file) => file.endsWith(".js"))
  .map((file) => new URL(`../src/js/${file}`, import.meta.url));

test("locale catalogs contain the same non-empty keys and interpolation values", () => {
  const [referenceLocale, ...otherLocales] = localeCodes;
  const referenceCatalog = catalogs[referenceLocale];
  const referenceKeys = Object.keys(referenceCatalog).sort();
  const contactPurposes = [
    "join",
    "menu",
    "help",
    "support",
    "media",
    "talent",
    "feedback",
    "privacy",
    "question",
  ];
  const requestMessages = [
    "greeting",
    "name",
    "city",
    "contact",
    "email",
    "context",
    "participants",
    "availability",
    "transport",
    "diet",
    "contribution",
    "details",
    "reviewPermission",
    "replyConsent",
    "futureUpdates",
    "yes",
    "no",
    "telegram.opening",
    "telegram.sendHint",
    "telegram.openAgain",
    "copy.button",
    "copy.success",
    "copy.failure",
    "copy.manualLabel",
  ];
  const informationDialogIds = ["first", "drinks", "help", "support"];
  const menuDishIds = [
    "chicken",
    "pork",
    "borscht",
    "okroshka",
    "salad",
    "olives",
    "varenyky",
    "canapes",
    "potatoes",
    "pelmeni",
    "sweet-crepes",
    "savory-crepes",
  ];
  const cityDescriptionIds = [
    "sevilla",
    "malaga",
    "torremolinos",
    "marbella",
    "jerez",
    "cordoba",
    "granada",
    "huelva",
    "valencia",
    "benalmadena",
    "madrid",
    "alicante",
    "asturias",
    "portugal",
  ];
  const requiredKeys = [
    "vote.initialStatus",
    "vote.requestContext",
    ...contactPurposes.flatMap((purpose) => [
      `contact.title.${purpose}`,
      `contact.purpose.${purpose}`,
    ]),
    ...["telegram", "email", "phone"].map((method) => `contact.method.${method}`),
    ...requestMessages.map((message) => `request.${message}`),
    ...meetingScenes.map((scene) => `gallery.scene.${scene}`),
    ...archivePhotoIds.flatMap((photoId) =>
      ["alt", "caption"].map((field) => `gallery.photo.${photoId}.${field}`)
    ),
    ...menuDishIds.flatMap((dishId) =>
      ["name", "description", "preparation", "wishes"].map(
        (field) => `dish.menu.${dishId}.${field}`
      )
    ),
    ...cityDescriptionIds.map((cityId) => `city.dialog.description.${cityId}`),
    ...cityNameIds.map((cityId) => `city.name.${cityId}`),
    ...informationDialogIds.flatMap((dialogId) => [
      ...["title", "text", "cta"].map((field) => `information.${dialogId}.${field}`),
      ...[1, 2, 3, 4].map((item) => `information.${dialogId}.item.${item}`),
    ]),
  ];

  for (const locale of localeCodes) {
    for (const [key, message] of Object.entries(catalogs[locale])) {
      assert.equal(typeof message, "string", `${locale}.${key} must be a string`);
      assert.ok(message.trim(), `${locale}.${key} must not be empty`);
    }
    for (const key of requiredKeys) {
      assert.ok(Object.hasOwn(catalogs[locale], key), `${locale} is missing ${key}`);
    }
  }

  const placeholders = (message) =>
    [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  for (const locale of otherLocales) {
    assert.deepEqual(Object.keys(catalogs[locale]).sort(), referenceKeys, `${locale} keys`);
    for (const key of referenceKeys) {
      assert.deepEqual(
        placeholders(catalogs[locale][key]),
        placeholders(referenceCatalog[key]),
        `${locale}.${key} placeholders`
      );
    }
  }
});

test("JavaScript translation references exist in every locale catalog", async () => {
  for (const sourceUrl of translationSources) {
    const source = await readFile(sourceUrl, "utf8");
    const references = [...source.matchAll(/window\.i18n\.t\("([a-zA-Z0-9._-]+)"/g)].map(
      (match) => match[1]
    );

    for (const locale of localeCodes) {
      for (const key of references) {
        assert.ok(Object.hasOwn(catalogs[locale], key), `${locale} is missing ${key}`);
      }
    }
  }
});

test("translation lookup interpolates values and reports missing keys or values", () => {
  const window = { localeMessages: rawCatalogs.en };
  vm.runInNewContext(i18nSource, {
    window,
    document: { documentElement: { lang: "en" } },
  });

  assert.equal(window.i18n.t("gallery.counter", { current: 2, total: 5 }), "Photo 2 of 5");
  assert.throws(
    () => window.i18n.t("missing.message"),
    /Missing translation "missing\.message" for locale "en"\./
  );
  assert.throws(
    () => window.i18n.t("gallery.counter", { current: 2 }),
    /Missing value "total" for translation "gallery\.counter"\./
  );
});

test("translation lookup rejects a missing locale catalog", () => {
  assert.throws(
    () =>
      vm.runInNewContext(i18nSource, {
        window: {},
        document: { documentElement: { lang: "es" } },
      }),
    /Translation catalog is missing for locale "es"\./
  );
});
