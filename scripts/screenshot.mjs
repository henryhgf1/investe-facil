import fs from "node:fs";

import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = "screenshots";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const errors = [];

const desktopPages = [
  ["/", "home"],
  ["/trilha/", "trilha"],
  ["/trilha/fundamentos/juros-compostos/", "licao-juros-compostos"],
  ["/trilha/renda-variavel/o-que-e-uma-acao/", "licao-o-que-e-uma-acao"],
  ["/glossario/", "glossario"],
  ["/simulador/", "simulador"],
  ["/missoes/", "missoes"],
];

const mobilePages = [
  ["/", "home-mobile"],
  ["/glossario/", "glossario-mobile"],
  ["/missoes/", "missoes-mobile"],
];

function watch(page) {
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      errors.push(`console: ${message.text()}`);
    }
  });
}

async function capture({ theme, viewport, pages }) {
  const context = await browser.newContext({
    viewport,
    locale: "pt-BR",
    colorScheme: theme === "dark" ? "dark" : "light",
    isMobile: viewport.width < 640,
    hasTouch: viewport.width < 640,
  });

  await context.addInitScript((value) => {
    window.localStorage.setItem("investe-facil:theme", value);
  }, theme);

  const page = await context.newPage();
  watch(page);

  const themeSuffix = theme === "dark" ? "-dark" : "";

  for (const [path, label] of pages) {
    const fileName = `${label}${themeSuffix}.png`;

    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${outDir}/${fileName}`, fullPage: true });
    console.log(`ok ${fileName}`);
  }

  await context.close();
}

await capture({ theme: "light", viewport: { width: 1440, height: 1000 }, pages: desktopPages });
await capture({ theme: "dark", viewport: { width: 1440, height: 1000 }, pages: desktopPages });
await capture({ theme: "light", viewport: { width: 390, height: 844 }, pages: mobilePages });
await capture({ theme: "dark", viewport: { width: 390, height: 844 }, pages: mobilePages });

await browser.close();

if (errors.length > 0) {
  console.error("Erros no navegador:");
  for (const error of errors) console.error(` - ${error}`);
  process.exitCode = 1;
} else {
  console.log("Nenhum erro de console.");
}
