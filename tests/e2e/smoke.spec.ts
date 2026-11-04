import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("a landing apresenta a proposta e leva à trilha", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: /aprenda a investir/i })).toBeVisible();

  await page.getByRole("link", { name: /começar pela trilha/i }).click();
  await expect(page).toHaveURL(/\/trilha\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: /um caminho/i })).toBeVisible();
});

test("a página não tem rolagem horizontal", async ({ page }) => {
  await page.goto("/trilha/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
});

test("concluir uma lição soma XP e persiste após recarregar", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  await page.getByRole("button", { name: /concluir lição/i }).click();
  await expect(page.getByText("Lição concluída")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Lição concluída")).toBeVisible();

  await page.goto("/trilha/");
  await expect(
    page
      .getByRole("region", { name: "Resumo do seu progresso" })
      .getByText("20 XP", { exact: true }),
  ).toBeVisible();
});

test("o quiz corrige as respostas e registra o resultado", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  const quiz = page.locator('section[aria-labelledby="quiz-titulo"]');

  await quiz.getByText("Nos compostos, os juros também rendem juros", { exact: true }).click();
  await quiz.getByText("R$ 1.126,83", { exact: true }).click();
  await quiz.getByText("6 anos", { exact: true }).click();
  await quiz.getByText("O tempo investido", { exact: true }).click();

  await quiz.getByRole("button", { name: /ver resultado/i }).click();

  await expect(quiz.getByText("4 de 4 corretas (100%)")).toBeVisible();
});

test("o simulador de juros compostos reage aos controles", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  const simulator = page.locator('section[aria-labelledby="simulador-juros-compostos"]');

  const aporte = simulator.getByLabel(/aporte por mês/i);

  await aporte.evaluate((element) => {
    const input = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, "1000");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await expect(aporte).toHaveValue("1000");
  await expect(simulator.locator("output").first()).toContainText("1.000");
});
