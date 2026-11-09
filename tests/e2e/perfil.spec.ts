import { expect, test, type Page } from "@playwright/test";

import { seedProfile } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

async function completeFirstMission(page: Page) {
  const mission = page.locator("#mapa-do-dinheiro");
  const checkboxes = mission.getByRole("checkbox");

  await expect(checkboxes.first()).toBeVisible();

  for (let index = 0; index < (await checkboxes.count()); index += 1) {
    await checkboxes.nth(index).check();
  }

  await mission
    .getByText("O que sobra sem comprometer os gastos essenciais e a reserva.", { exact: true })
    .click();
  await mission.getByRole("button", { name: /concluir missão/i }).click();

  await expect(mission.getByText("Missão concluída")).toBeVisible();
}

test("cria o perfil com nome e avatar e persiste após recarregar", async ({ page }) => {
  await page.goto("/perfil/");

  await expect(page.getByRole("heading", { level: 1, name: /seu perfil/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /crie seu perfil/i })).toBeVisible();

  await page.getByLabel("Nome", { exact: true }).fill("Henry");
  await page.getByText("Foguete", { exact: true }).click();
  await page.getByRole("button", { name: /criar perfil/i }).click();

  await expect(page.getByRole("status")).toContainText("Perfil salvo.");
  await expect(page.getByRole("heading", { name: "Henry" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Henry" })).toBeVisible();
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Henry");
  await expect(page.getByRole("radio", { name: "Foguete" })).toBeChecked();
});

test("sem perfil bloqueia lição, quiz e missão com aviso", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  await expect(page.getByRole("button", { name: /concluir lição/i })).toBeDisabled();
  await expect(
    page.getByText(/crie seu perfil para registrar a conclusão das lições/i),
  ).toBeVisible();

  await expect(page.getByRole("button", { name: /ver resultado/i })).toBeDisabled();
  await expect(page.getByText(/crie seu perfil para registrar o resultado do quiz/i)).toBeVisible();

  await page.goto("/missoes/");

  await expect(page.getByRole("button", { name: /concluir missão/i }).first()).toBeDisabled();
  await expect(
    page.getByText(/crie seu perfil para registrar a conclusão das missões/i).first(),
  ).toBeVisible();
});

test("apaga uma missão concluída pelo perfil e ela volta a ficar pendente", async ({ page }) => {
  await page.goto("/missoes/");
  await seedProfile(page);
  await completeFirstMission(page);

  await page.goto("/perfil/");

  const item = page.locator("li", { hasText: "Monte o mapa do seu dinheiro" });
  await item.getByRole("button", { name: "Apagar" }).click();

  const confirmation = page.getByRole("group", {
    name: /confirmar remoção de monte o mapa do seu dinheiro/i,
  });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: /sim, apagar/i }).click();

  await expect(page.getByRole("status")).toContainText("Progresso apagado.");

  await page.goto("/missoes/");

  await expect(page.getByText("0 de 8 concluídas")).toBeVisible();
  await expect(page.locator("#mapa-do-dinheiro").getByText("Missão concluída")).toHaveCount(0);
});

test("apagar uma lição também apaga o resultado do quiz dela", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");
  await seedProfile(page);

  const quiz = page.locator('section[aria-labelledby="quiz-titulo"]');
  await quiz.getByText("Nos compostos, os juros também rendem juros", { exact: true }).click();
  await quiz.getByText("R$ 1.126,83", { exact: true }).click();
  await quiz.getByText("6 anos", { exact: true }).click();
  await quiz.getByText("O tempo investido", { exact: true }).click();
  await quiz.getByRole("button", { name: /ver resultado/i }).click();
  await expect(quiz.getByText("4 de 4 corretas (100%)")).toBeVisible();

  await page.getByRole("button", { name: /concluir lição/i }).click();
  await expect(page.getByText("Lição concluída")).toBeVisible();

  await page.goto("/perfil/");

  const item = page.locator("li", { hasText: "Juros compostos: o motor dos investimentos" });
  await item.getByRole("button", { name: "Apagar" }).click();
  await page
    .getByRole("group", { name: /confirmar remoção de juros compostos/i })
    .getByRole("button", { name: /sim, apagar/i })
    .click();

  await expect(page.getByRole("status")).toContainText("Progresso apagado.");

  await page.goto("/trilha/fundamentos/juros-compostos/");

  await expect(page.getByText("Lição concluída")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /concluir lição/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /ver resultado/i })).toBeEnabled();
});

test("recomeçar as missões exige digitar a palavra de confirmação", async ({ page }) => {
  await page.goto("/missoes/");
  await seedProfile(page);
  await completeFirstMission(page);

  await page.goto("/perfil/");
  await page.getByRole("button", { name: "Recomeçar as missões" }).click();

  const input = page.getByLabel(/digite recomeçar/i);
  const confirmBox = page.locator("#reset-missoes").locator("xpath=..");
  const confirm = confirmBox.getByRole("button", { name: "Apagar" });

  await expect(input).toBeVisible();
  await expect(confirm).toBeDisabled();

  await input.fill("errado");
  await expect(confirm).toBeDisabled();

  await input.fill("RECOMEÇAR");
  await expect(confirm).toBeEnabled();
  await confirm.click();

  await expect(page.getByRole("status")).toContainText("Missões reiniciadas.");
  await expect(page.getByText("Nenhuma missão concluída ainda.")).toBeVisible();
});

test("a navegação e o rodapé levam ao perfil", async ({ page }) => {
  const viewport = page.viewportSize();

  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Perfil" })).toHaveAttribute(
    "href",
    "/perfil/",
  );

  if (viewport && viewport.width >= 768) {
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Perfil" })
      .click();
  } else {
    await page.locator("header summary").click();
    await page.locator("header details a", { hasText: "Perfil" }).click();
  }

  await expect(page).toHaveURL(/\/perfil\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: /seu perfil/i })).toBeVisible();
});
