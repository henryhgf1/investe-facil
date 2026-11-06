import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/simulador/");
});

test("a máquina do tempo apresenta o período completo e os três índices", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: /começado em 2000/i })).toBeVisible();

  const simulator = page.locator('section[aria-labelledby="simulador-historico"]');

  await expect(simulator.getByText("2000 a 2024", { exact: true })).toBeVisible();
  await expect(simulator.getByRole("img")).toHaveAttribute("aria-label", /2000 e 2024/);
  await expect(simulator.getByText("CDI acumulado:")).toBeVisible();
  await expect(simulator.getByText("Ibovespa acumulado:")).toBeVisible();
});

test("os períodos predefinidos mudam o intervalo do gráfico", async ({ page }) => {
  const simulator = page.locator('section[aria-labelledby="simulador-historico"]');

  await simulator.getByRole("button", { name: "Últimos 10 anos" }).click();

  await expect(simulator.getByText(/2015 a 2024/)).toBeVisible();
  await expect(simulator.getByRole("img")).toHaveAttribute("aria-label", /2015 e 2024/);
  await expect(simulator.getByRole("button", { name: "Últimos 10 anos" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("o aporte inicial e a correção pela inflação atualizam os totais", async ({ page }) => {
  const simulator = page.locator('section[aria-labelledby="simulador-historico"]');
  const initial = simulator.getByLabel(/quanto você começa/i);

  await expect(async () => {
    await initial.evaluate((element) => {
      const input = element as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "10000");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await expect(simulator.getByText("R$ 70.000")).toBeVisible();
  }).toPass({ timeout: 10_000 });

  await expect(initial).toHaveValue("10000");

  await simulator.getByRole("button", { name: "Corrigidos pela inflação" }).click();

  await expect(simulator.getByText("CDI corrigido")).toBeVisible();
  await expect(simulator.getByText("em poder de compra de hoje")).toBeVisible();
});
