import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/trilha/fundamentos/risco-e-retorno/");
});

test("a lição apresenta os tipos de risco em cards", async ({ page }) => {
  const list = page.getByRole("list", { name: "Tipos de risco" });

  await expect(list).toBeVisible();
  await expect(list.getByRole("listitem")).toHaveCount(5);

  const cards = [
    ["Mercado", "Ação cai 20% num mês sem a empresa piorar"],
    ["Crédito", "Banco ou empresa entra em dificuldade"],
    ["Liquidez", "Imóvel demora meses para vender"],
    ["Inflação", "R$ 1.000 parados compram menos a cada ano"],
    ["Concentração", "Salário e investimento na mesma empresa"],
  ];

  for (const [name, example] of cards) {
    const card = list.getByRole("listitem").filter({ hasText: name });

    await expect(card.getByRole("heading", { level: 3, name })).toBeVisible();
    await expect(card).toContainText(example);
  }
});

test("os cards de risco não criam rolagem horizontal", async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
});
