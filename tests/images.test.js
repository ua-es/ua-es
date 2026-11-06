import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

test("WebP files have complete RIFF containers", () => {
  const invalid = filesIn("images")
    .filter((path) => path.endsWith(".webp"))
    .filter((path) => {
      const bytes = readFileSync(path);
      return (
        bytes.length < 12 ||
        bytes.toString("ascii", 0, 4) !== "RIFF" ||
        bytes.toString("ascii", 8, 12) !== "WEBP" ||
        bytes.readUInt32LE(4) + 8 !== bytes.length
      );
    });
  assert.deepEqual(invalid, []);
});

test("static image references in source files point to existing resources", () => {
  const missing = [];
  const sources = filesIn("src").filter((path) => /\.(?:html|css|js|json)$/.test(path));
  for (const source of sources) {
    const text = readFileSync(source, "utf8");
    const references = text.matchAll(
      /(?:images|assets)\/[\w./-]+\.(?:webp|svg|png|jpe?g|avif|gif)\b/g
    );
    for (const [reference] of references) {
      if (!existsSync(reference)) missing.push(`${source}: ${reference}`);
    }
  }
  assert.deepEqual([...new Set(missing)], []);
});
