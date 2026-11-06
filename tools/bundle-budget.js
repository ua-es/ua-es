const BUNDLE_BUDGETS_KB = { js: 128, css: 150, locale: 40 };

export function checkBundleSize(out, code, kind = out.endsWith(".css") ? "css" : "js") {
  const kb = Buffer.byteLength(code, "utf8") / 1024;
  const limit = BUNDLE_BUDGETS_KB[kind];
  if (kb > limit) {
    throw new Error(`${out} exceeds ${kind} budget: ${kb.toFixed(1)} KB (limit ${limit} KB)`);
  }
}
