import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function rasterImages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return rasterImages(path);
    return /\.(?:webp|png|jpe?g|avif|gif)$/.test(path) ? [path] : [];
  });
}

const files = [...rasterImages("images"), ...rasterImages("assets")];
const template = readFileSync("src/html/page.html", "utf8");
const expectedWidths = Object.fromEntries(
  [...template.matchAll(/((?:images|assets)\/[\w./-]+\.(?:webp|png|jpe?g)) (\d+)w/g)].map(
    (match) => [match[1], Number(match[2])]
  )
);

test("every raster image decodes and responsive width descriptors match the files", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/");
  expect(files.length).toBeGreaterThan(0);
  const failures = await page.evaluate(
    async ({ files, expectedWidths }) => {
      const failures = [];
      for (let index = 0; index < files.length; index += 8) {
        await Promise.all(
          files.slice(index, index + 8).map(async (path) => {
            const image = new Image();
            image.src = new URL(path, document.baseURI).href;
            try {
              await image.decode();
              if (!image.naturalWidth || !image.naturalHeight)
                failures.push(`${path}: empty dimensions`);
              if (expectedWidths[path] && expectedWidths[path] !== image.naturalWidth) {
                failures.push(
                  `${path}: declared ${expectedWidths[path]}w, actual ${image.naturalWidth}px`
                );
              }
            } catch {
              failures.push(`${path}: cannot load or decode`);
            }
          })
        );
      }
      return failures;
    },
    { files, expectedWidths }
  );
  expect(failures).toEqual([]);
});
