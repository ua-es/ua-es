import { expect, test } from "@playwright/test";

test("section navigation follows scrolling in both directions", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('#navigation a[href^="#"]');
  const destinations = await links.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href"))
  );
  for (const destination of [...destinations, ...destinations.toReversed()]) {
    await page.evaluate((selector) => {
      const top = document.querySelector(selector).getBoundingClientRect().top + scrollY;
      const headerHeight = document.querySelector("header").offsetHeight;
      window.scrollTo({ top: top - headerHeight - 30, behavior: "instant" });
    }, destination);
    await expect(page.locator(`#navigation a[href="${destination}"]`)).toHaveAttribute(
      "aria-current",
      "location"
    );
    await expect(page.locator('#navigation [aria-current="location"]')).toHaveCount(1);
  }
});
