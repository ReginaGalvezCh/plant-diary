import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";

const origin = "http://127.0.0.1:8765";
const flags = ["--enable-features=OptimizationGuideOnDeviceModel,PromptAPIForGeminiNano,PromptAPIForGeminiNanoMultimodalInput"];
const context = await chromium.launchPersistentContext(process.env.DIARY_CHROME_PROFILE || "", {
  channel: "chrome",
  headless: false,
  args: flags,
  ignoreDefaultArgs: ["--disable-component-update", "--disable-background-networking", "--no-sandbox"],
});
try {
  const page = context.pages()[0];
  await page.goto(origin);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  const illustrations = await page.evaluate(() => [1, 2].map(count => {
    const canvas = document.createElement("canvas");
    canvas.width = 450;
    canvas.height = 390;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#faf1e4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#477443";
    ctx.fillRect(220, 125, 12, 170);
    for (const [x, y, angle] of [[160, 255, .32], [285, 238, -.4]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, 80, 25, angle, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.fillStyle = "#ae623b";
    ctx.fillRect(156, 285, 140, 85);
    for (const [x, y] of [[225, 135], [315, 90]].slice(0, count)) {
      ctx.fillStyle = "#a03794";
      for (let index = 0; index < 5; index++) {
        const angle = index * (2 * Math.PI / 5);
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * 24, y + Math.sin(angle) * 24, 25, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.fillStyle = "#fed13f";
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, 2 * Math.PI);
      ctx.fill();
    }
    return canvas.toDataURL("image/png").split(",")[1];
  }));

  for (const [index, side] of ["before", "after"].entries()) {
    const name = side + ".png";
    const buffer = Buffer.from(illustrations[index], "base64");
    if (process.env.DIARY_FIXTURES) writeFileSync(join(process.env.DIARY_FIXTURES, name), buffer);
    await page.locator(`[data-photo=${side}]`).setInputFiles({ name, mimeType: "image/png", buffer });
    await page.locator(`[data-preview=${side}]`).waitFor({ state: "visible" });
  }
  await page.locator('[data-field="after.note"]').fill("Observación de prueba.");
  await page.reload();
  assert.equal(await page.locator('[data-field="after.note"]').inputValue(), "Observación de prueba.");
  assert.equal(await page.locator("[data-preview]:visible").count(), 2);

  console.log("Preparación de Chrome", await page.evaluate(async () => {
    const model = globalThis.LanguageModel;
    if (!model) return { api: false };
    const image = { type: "image" };
    return {
      api: true,
      esImages: await model.availability({ expectedInputs: [{ type: "text", languages: ["es"] }, image], expectedOutputs: [{ type: "text", languages: ["es"] }] }),
      enImages: await model.availability({ expectedInputs: [{ type: "text", languages: ["en"] }, image] }),
      text: await model.availability(),
    };
  }));

  if (process.env.DIARY_PREPARE === "1") {
    await page.locator("#compare").click();
    await page.waitForFunction(() => !document.querySelector("#compare").disabled, { timeout: 185000 });
    console.log("Preparación en línea", await page.locator("#status").innerText());
    await page.locator('[data-field="after.note"]').fill("Prueba sin conexión.");
  }

  await context.setOffline(true);
  await page.reload();
  await page.waitForFunction(() => !navigator.onLine && document.querySelector("#connection").textContent === "Sin conexión");
  assert.equal(await page.locator("[data-preview]:visible").count(), 2);
  if (process.env.DIARY_SCREENSHOT) await page.screenshot({ path: process.env.DIARY_SCREENSHOT, fullPage: true });
  const network = [];
  page.on("request", request => network.push(request.url()));
  await page.locator("#compare").click();
  await page.waitForFunction(() => !document.querySelector("#compare").disabled, { timeout: 185000 });
  const outcome = await page.locator("#status").innerText();
  const visible = await page.locator("#result").isVisible();
  console.log(JSON.stringify({
    offline: true,
    status: outcome,
    source: visible ? await page.locator("#source").innerText() : null,
    changes: visible ? await page.locator("#changes").innerText() : null,
    requests: network,
  }, null, 2));
  assert.ok(visible, outcome);
  assert.match(await page.locator("#source").innerText(), /En este equipo/);
  assert.match(await page.locator("#changes").innerText(), /flor|capullo/i);
  assert.ok(network.every(url => url.startsWith(origin) || url.startsWith("data:")));
} finally {
  await context.close();
}
