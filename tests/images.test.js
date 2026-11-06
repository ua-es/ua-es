import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function webpFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return webpFiles(path);
    return entry.name.endsWith(".webp") ? [path] : [];
  });
}

test("images are not empty files", () => {
  const empty = webpFiles("images").filter((file) => statSync(file).size < 1024);
  assert.deepEqual(empty, []);
});
