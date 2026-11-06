import assert from "node:assert/strict";
import test from "node:test";
import { checkBundleSize } from "../tools/bundle-budget.js";

test("bundle budgets reject oversized JS, CSS, and locale output", () => {
  assert.doesNotThrow(() => checkBundleSize("app.js", "a".repeat(128 * 1024)));
  assert.throws(() => checkBundleSize("app.js", "a".repeat(128 * 1024 + 1)), /exceeds js budget/);
  assert.throws(
    () => checkBundleSize("style.css", "a".repeat(150 * 1024 + 1)),
    /exceeds css budget/
  );
  assert.throws(
    () => checkBundleSize("locale.js", "я".repeat(21 * 1024), "locale"),
    /exceeds locale budget/
  );
});
