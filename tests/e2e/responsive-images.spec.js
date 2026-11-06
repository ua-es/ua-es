import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

test("mobile venue photos use a smaller resource and retain the full lightbox image", async ({
  page,
}) => {
  await page.goto("/#event");
  const image = page.locator(".venue-photo img").first();
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() => image.evaluate((image) => image.complete && image.naturalWidth > 0))
    .toBe(true);
  expect(await image.evaluate((image) => image.currentSrc)).toMatch(
    /park-picnic-canopies-480\.webp$/
  );
  await page.locator(".venue-photo").first().click();
  await expect(page.locator(".venue-lightbox-image")).toHaveAttribute(
    "src",
    /\/park-picnic-canopies\.webp$/
  );
});
