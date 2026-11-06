import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const cities = await readJson("../src/data/cities.json");
const { languages } = await readJson("../src/languages.json");

test("city records have a unique id, a known region and valid coordinates", () => {
  const ids = new Set();
  for (const city of cities) {
    assert.match(city.id, /^[a-z-]+$/, `city id ${city.id}`);
    assert.ok(!ids.has(city.id), `duplicate city ${city.id}`);
    ids.add(city.id);
    assert.ok(["spain", "andalucia", "portugal"].includes(city.region), `${city.id} region`);
    assert.equal(typeof city.past, "boolean", `${city.id} past flag`);
    assert.ok(city.lon >= -10 && city.lon <= 5, `${city.id} longitude`);
    assert.ok(city.lat >= 35 && city.lat <= 44.5, `${city.id} latitude`);
  }
});

test("every city has a name in every language", async () => {
  for (const { code } of languages) {
    const { city } = await readJson(`../src/locales/${code}.json`);
    for (const { id } of cities) {
      assert.ok(city.name[id], `${code}: missing city.name.${id}`);
    }
  }
});

test("the built map data matches the source", async () => {
  assert.deepEqual(await readJson("../assets/maps/cities.json"), cities);
});
