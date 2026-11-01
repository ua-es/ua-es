import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const spritePath = new URL("../assets/brand-logo.svg", import.meta.url);

test("brand logo sprite exists and contains the brand-logo symbol", async () => {
  const sprite = await readFile(spritePath, "utf8");
  assert.ok(sprite.includes('<symbol id="brand-logo"'), "sprite must define brand-logo symbol");
  assert.ok(sprite.includes("viewBox=\"-30 -784 4360 1280\""), "symbol must keep original viewBox");
  assert.ok(sprite.includes("transform=\"scale(1 -1)\""), "symbol must keep original flip transform");
  const pathCount = (sprite.match(/<path /g) || []).length;
  assert.ok(pathCount > 0, "symbol must contain path data");
});
