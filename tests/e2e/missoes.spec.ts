import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/missoes/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("a página de missões lista as oito práticas e as conquistas", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: /aprender fazendo/i })).toBeVisible();

  await expect(page.getByText("0 de 8 concluídas")).toBeVisible();
  await expect(page.getByRole("button", { name: /concluir missão/i })).toHaveCount(8);
  await expect(page.getByRole("heading", { name: "Conquistas" })).toBeVisible();
  await expect(page.getByText("0 de 12 conquistadas")).toBeVisible();
});

test("concluir uma missão soma XP, desbloqueia badge e persiste", async ({ page }) => {
  await page
    .getByRole("button", { name: /concluir missão/i })
    .first()
    .click();

  await expect(page.getByText("Missão concluída")).toBeVisible();
  await expect(page.getByText("1 de 8 concluídas")).toBeVisible();
  await expect(page.getByText("1 de 12 conquistadas")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hora extra" })).toBeVisible();

  await page.reload();
  await expect(page.getByText("1 de 8 concluídas")).toBeVisible();

  await page.goto("/trilha/");
  await expect(page.getByText("1 de 8 missões")).toBeVisible();
});

test("a lição mostra a missão recomendada e permite concluí-la", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  const section = page.locator('section[aria-labelledby="missao-pratica"]');

  await expect(section.getByText("Teste o poder do tempo")).toBeVisible();
  await section.getByRole("button", { name: /concluir missão/i }).click();
  await expect(section.getByText("Missão concluída")).toBeVisible();

  await section.getByRole("link", { name: /ver todas as missões/i }).click();
  await expect(page).toHaveURL(/\/missoes\/?(#.*)?$/);
});

test("a navegação principal leva às missões", async ({ page }) => {
  const viewport = page.viewportSize();

  if (viewport && viewport.width >= 640) {
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Missões" })
      .click();
  } else {
    await page.locator("header summary").click();
    await page.locator("header details a", { hasText: "Missões" }).click();
  }

  await expect(page).toHaveURL(/\/missoes\/?(#.*)?$/);
  await expect(page.getByRole("heading", { level: 1, name: /aprender fazendo/i })).toBeVisible();
});
