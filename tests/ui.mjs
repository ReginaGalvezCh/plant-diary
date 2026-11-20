import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 845 }, reducedMotion, locale: "en-US" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      // The UI check isolates presentation from model availability.
      globalThis.LanguageModel = {
        availability: async () => "available",
        create: async ({ expectedOutputs }) => ({
          destroy() {},
          prompt: async () => JSON.stringify(expectedOutputs[0].languages[0] === "es"
            ? { changes: ["Hay una flor visible."], check: "Revisar el sustrato.", uncertainty: "La luz cambió." }
            : { changes: ["One flower is visible."], check: "Check the potting mix.", uncertainty: "The lighting changed." }),
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
    await page.locator('[data-field="after.note"]').fill("Orchid trial");
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
    assert.equal(await page.locator("#uncertainty").innerText(), "The lighting changed.");
    await page.getByLabel("Language").selectOption("es");
    assert.equal(await page.locator("#title").innerText(), "Mis plantas de casa");
    assert.equal(await page.locator("#uncertainty").getAttribute("lang"), "en");
    assert.equal(await page.locator('[data-field="after.note"]').inputValue(), "Orchid trial");
    await page.reload();
    await page.locator("#compare:not([disabled])").waitFor();
    assert.equal(await page.locator("#language").inputValue(), "es");
    await page.locator("#compare").click();
    await page.waitForFunction(() => document.querySelector("#uncertainty").textContent === "La luz cambió.");
    assert.equal(await page.locator("#uncertainty").getAttribute("lang"), "es");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    assert.deepEqual(errors, []);
    console.log(`Mobile, offline, photo zoom, focus, result and language switching (${reducedMotion}): passed`);
    await page.context().close();
  }
} finally {
  await browser.close();
}
