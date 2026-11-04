import fs from "node:fs";

import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = "screenshots";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const errors = [];

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "pt-BR",
});
const page = await desktop.newPage();
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});

async function shot(path, name, fullPage = true) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage });
  console.log(`ok ${name}`);
}

await shot("/", "home");
await shot("/trilha/", "trilha");
await shot("/trilha/fundamentos/juros-compostos/", "licao-juros-compostos");
await shot("/design-system/", "design-system");

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: "pt-BR",
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(`${base}/`, { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(400);
await mobilePage.screenshot({ path: `${outDir}/home-mobile.png`, fullPage: true });
console.log("ok home-mobile");

await browser.close();

if (errors.length > 0) {
  console.error("Erros no navegador:");
  for (const error of errors) console.error(` - ${error}`);
  process.exitCode = 1;
} else {
  console.log("Nenhum erro de console.");
}
