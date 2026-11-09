import { readFile } from "node:fs/promises";

import { expect, test, type Locator } from "@playwright/test";

async function setRange(locator: Locator, value: string) {
  await locator.evaluate((element, next) => {
    const input = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, next);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/carteira/");
});

test("a carteira apresenta o simulador e o relatório de evolução", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: /monte uma carteira/i })).toBeVisible();

  const simulator = page.locator('section[aria-labelledby="simulador-carteira"]');

  await expect(simulator.getByText("2015 a 2024", { exact: true })).toBeVisible();
  await expect(simulator.getByRole("img")).toHaveAttribute("aria-label", /carteira equilibrada/i);
  await expect(simulator.getByText("CDI", { exact: true }).first()).toBeVisible();
  await expect(simulator.getByText("Ibovespa", { exact: true }).first()).toBeVisible();

  const report = page.locator('section[aria-labelledby="relatorio-evolucao"]');

  await expect(report.getByText(/terminaria em/)).toBeVisible();
  await expect(report.getByText("Melhor ano")).toBeVisible();
  await expect(report.getByText("Pior ano")).toBeVisible();
  await expect(report.getByRole("button", { name: /baixar csv/i })).toBeVisible();
});

test("os perfis mudam a distribuição da carteira", async ({ page }) => {
  const simulator = page.locator('section[aria-labelledby="simulador-carteira"]');

  await simulator.getByRole("button", { name: "Arrojada" }).click();

  await expect(simulator.getByRole("button", { name: "Arrojada" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(simulator.getByLabel("Ações brasileiras")).toHaveValue("40");

  await simulator.getByRole("button", { name: "Conservadora" }).click();

  await expect(simulator.getByRole("button", { name: "Conservadora" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(simulator.getByLabel("Renda fixa")).toHaveValue("60");
  await expect(simulator.getByLabel("Ações brasileiras")).toHaveValue("5");
});

test("os aportes atualizam o total investido e o relatório", async ({ page }) => {
  const simulator = page.locator('section[aria-labelledby="simulador-carteira"]');
  const report = page.locator('section[aria-labelledby="relatorio-evolucao"]');

  await setRange(simulator.getByLabel("Quanto você começa"), "10000");
  await setRange(simulator.getByLabel("Aporte por mês"), "0");

  await expect(simulator.getByLabel("Quanto você começa")).toHaveValue("10000");
  await expect(simulator.getByLabel("Aporte por mês")).toHaveValue("0");
  await expect(simulator.locator("dl").getByText("R$ 10.000", { exact: true })).toBeVisible();
  await expect(report).toContainText("R$ 10.000 iniciais e R$ 0 por mês");
});

test("a carteira salva no navegador volta ao recarregar", async ({ page }) => {
  const simulator = page.locator('section[aria-labelledby="simulador-carteira"]');

  await simulator.getByRole("button", { name: "Conservadora" }).click();
  await expect(simulator.getByLabel("Renda fixa")).toHaveValue("60");

  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("investe-facil:carteira")))
    .toContain("conservadora");

  await page.reload();

  const reloaded = page.locator('section[aria-labelledby="simulador-carteira"]');

  await expect(reloaded.getByRole("button", { name: "Conservadora" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(reloaded.getByLabel("Renda fixa")).toHaveValue("60");
});

test("o relatório pode ser baixado em CSV", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: /baixar csv/i }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("carteira-2015-2024.csv");

  const filePath = await download.path();
  const content = await readFile(filePath!, "utf8");

  expect(content).toContain("Ano;Aportado;Carteira;CDI;Ibovespa");
  expect(content).toContain("2024");
});

test("a navegação principal leva à carteira", async ({ page }) => {
  await page.goto("/");

  const viewport = page.viewportSize();

  if (viewport && viewport.width >= 768) {
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Carteira" })
      .click();
  } else {
    await page.locator("header summary").click();
    await page.locator("header details a", { hasText: "Carteira" }).click();
  }

  await expect(page).toHaveURL(/\/carteira\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: /monte uma carteira/i })).toBeVisible();
});
