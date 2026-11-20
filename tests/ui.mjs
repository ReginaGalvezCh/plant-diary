import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 845 }, reducedMotion });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      // The UI check isolates presentation from model availability.
      globalThis.LanguageModel = {
        availability: async () => "available",
        create: async () => ({
          destroy() {},
          prompt: async () => JSON.stringify({
            changes: ["Hay una flor visible."], check: "Revisar el sustrato.", uncertainty: "La luz cambió.",
          }),
        }),
      };
    });
    await page.goto(process.env.DIARY_TEST_URL || "http://127.0.0.1:8765/");
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    const photo = await page.evaluate(() => document.createElement("canvas").toDataURL("image/png").split(",")[1]);
    for (const side of ["before", "after"]) {
      await page.locator(`[data-photo=${side}]`).setInputFiles({
        name: side + ".png", mimeType: "image/png", buffer: Buffer.from(photo, "base64"),
      });
      await page.locator(`[data-zoom=${side}]`).waitFor({ state: "visible" });
    }
    await page.context().setOffline(true);
    await page.reload();
    await page.locator("#compare:not([disabled])").waitFor();
    await page.waitForFunction(async () => Boolean(await caches.match("./motion.js")));
    const zoom = page.locator("[data-zoom=before]");
    const dialog = page.locator("#photo-dialog");
    await zoom.click();
    await dialog.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await page.waitForFunction(() => document.activeElement?.dataset.zoom === "before");
    await page.locator("[data-zoom=after]").click();
    await dialog.locator("button").click();
    await dialog.waitFor({ state: "hidden" });
    await page.locator("#compare").click();
    await page.locator("#result").waitFor({ state: "visible" });
    assert.equal(await page.locator("#uncertainty").innerText(), "La luz cambió.");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.deepEqual(errors, []);
    console.log(`Mobile, offline, photo zoom, focus and result (${reducedMotion}): passed`);
    await page.context().close();
  }
} finally {
  await browser.close();
}
