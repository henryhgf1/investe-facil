import { expect, test, type Page } from "@playwright/test";

import { seedProfile, seedProfiles } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

function profileList(page: Page) {
  return page.locator('section[aria-labelledby="lista-perfis"]');
}

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
  await expect(page.getByRole("heading", { level: 2, name: "Henry", exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { level: 2, name: "Henry", exact: true })).toBeVisible();
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Henry");
  await expect(page.getByRole("radio", { name: "Foguete" })).toBeChecked();
});

test("permite até três perfis e bloqueia o quarto", async ({ page }) => {
  await seedProfile(page, "Ana");

  for (const name of ["Bruno", "Carla"]) {
    await page.goto("/perfil/");
    await page.getByRole("button", { name: /adicionar perfil/i }).click();
    await page.getByLabel("Nome", { exact: true }).fill(name);
    await page.getByRole("button", { name: /criar perfil/i }).click();
    await expect(page.getByRole("status")).toContainText("Perfil salvo.");
  }

  await expect(profileList(page)).toContainText("3 de 3");
  await expect(page.getByRole("button", { name: /adicionar perfil/i })).toHaveCount(0);
});

test("troca de perfil pelo cabeçalho e isola o progresso", async ({ page }) => {
  await seedProfiles(page, [{ name: "Ana", xp: 20, lessons: ["inflacao"] }, { name: "Bruno" }], 0);
  await page.goto("/trilha/");

  const resumo = page.getByRole("region", { name: "Resumo do seu progresso" });
  await expect(resumo).toContainText("20 XP");

  await page.getByRole("button", { name: /trocar de perfil/i }).click();
  await page.getByRole("menuitemradio", { name: /Bruno/ }).click();

  await expect(resumo).toContainText("0 XP");
  await expect(page.getByRole("button", { name: /trocar de perfil/i })).toHaveAccessibleName(
    /Bruno/,
  );

  await page.goto("/perfil/");
  await expect(page.getByRole("heading", { level: 2, name: "Bruno", exact: true })).toBeVisible();
});

test("troca de perfil pela página de perfis", async ({ page }) => {
  await seedProfiles(
    page,
    [
      { name: "Ana", xp: 20, lessons: ["inflacao"] },
      { name: "Bruno", xp: 15, missions: ["mapa-do-dinheiro"] },
    ],
    0,
  );
  await page.goto("/perfil/");

  const bruno = profileList(page).locator("li", { hasText: "Bruno" });
  await bruno.getByRole("button", { name: "Usar este perfil" }).click();

  await expect(page.getByRole("status")).toContainText("Agora você está usando o perfil Bruno.");
  await expect(page.getByRole("heading", { level: 2, name: "Bruno", exact: true })).toBeVisible();
  await expect(bruno.getByText("Ativo")).toBeVisible();
});

test("apaga um perfil com confirmação digitada", async ({ page }) => {
  await seedProfiles(page, [{ name: "Ana" }, { name: "Bruno" }], 0);
  await page.goto("/perfil/");

  const bruno = profileList(page).locator("li", { hasText: "Bruno" });
  await bruno.getByRole("button", { name: "Apagar perfil" }).click();

  const confirmation = page.getByRole("group", {
    name: /confirmar exclusão do perfil Bruno/i,
  });
  const confirm = confirmation.getByRole("button", { name: "Apagar perfil" });

  await expect(confirm).toBeDisabled();
  await confirmation.getByLabel(/digite APAGAR/i).fill("errado");
  await expect(confirm).toBeDisabled();
  await confirmation.getByLabel(/digite APAGAR/i).fill("APAGAR");
  await expect(confirm).toBeEnabled();
  await confirm.click();

  await expect(page.getByRole("status")).toContainText("Perfil Bruno apagado.");
  await expect(profileList(page).locator("li", { hasText: "Bruno" })).toHaveCount(0);
});

test("apagar o perfil ativo ativa o próximo da lista", async ({ page }) => {
  await seedProfiles(page, [{ name: "Ana" }, { name: "Bruno" }, { name: "Carla" }], 1);
  await page.goto("/perfil/");

  const bruno = profileList(page).locator("li", { hasText: "Bruno" });
  await bruno.getByRole("button", { name: "Apagar perfil" }).click();
  const confirmation = page.getByRole("group", {
    name: /confirmar exclusão do perfil Bruno/i,
  });
  await confirmation.getByLabel(/digite APAGAR/i).fill("APAGAR");
  await confirmation.getByRole("button", { name: "Apagar perfil" }).click();

  await expect(page.getByRole("status")).toContainText("Agora o perfil Carla está ativo.");
  await expect(page.getByRole("heading", { level: 2, name: "Carla", exact: true })).toBeVisible();
});

test("apagar o último perfil volta ao estado sem perfil", async ({ page }) => {
  await seedProfile(page, "Ana");
  await page.goto("/perfil/");

  const ana = profileList(page).locator("li", { hasText: "Ana" });
  await ana.getByRole("button", { name: "Apagar perfil" }).click();
  const confirmation = page.getByRole("group", {
    name: /confirmar exclusão do perfil Ana/i,
  });
  await confirmation.getByLabel(/digite APAGAR/i).fill("APAGAR");
  await confirmation.getByRole("button", { name: "Apagar perfil" }).click();

  await expect(page.getByRole("status")).toContainText("Crie um novo perfil");
  await expect(page.getByRole("heading", { name: /crie seu perfil/i })).toBeVisible();

  await page.goto("/trilha/fundamentos/juros-compostos/");
  await expect(page.getByRole("button", { name: /concluir lição/i })).toBeDisabled();
  await expect(
    page.getByText(/crie seu perfil para registrar a conclusão das lições/i),
  ).toBeVisible();
});

test("edita um perfil sem afetar os demais", async ({ page }) => {
  await seedProfiles(
    page,
    [
      { name: "Ana", xp: 20, lessons: ["inflacao"] },
      { name: "Bruno", xp: 15, missions: ["mapa-do-dinheiro"] },
    ],
    0,
  );
  await page.goto("/perfil/");

  await page.getByLabel("Nome", { exact: true }).fill("Ana Silva");
  await page.getByText("Bússola", { exact: true }).click();
  await page.getByRole("button", { name: /salvar perfil/i }).click();
  await expect(page.getByRole("status")).toContainText("Perfil salvo.");

  const bruno = profileList(page).locator("li", { hasText: "Bruno" });
  await bruno.getByRole("button", { name: "Usar este perfil" }).click();

  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Bruno");
  await expect(page.getByRole("radio", { name: "Folha" })).toBeChecked();
  await expect(page.getByText("Progresso de Bruno")).toBeVisible();
  await expect(profileList(page)).toContainText("Ana Silva");
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

test("exporta e importa um backup com todos os perfis", async ({ page }) => {
  await seedProfiles(
    page,
    [
      { name: "Ana", xp: 20, lessons: ["inflacao"] },
      { name: "Bruno", xp: 15 },
    ],
    0,
  );
  await page.goto("/perfil/");

  await page.locator("summary", { hasText: "Gerenciar progresso" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar" }).click();
  const download = await downloadPromise;
  const filePath = await download.path();
  if (!filePath) throw new Error("download do backup não gerou arquivo");

  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: /crie seu perfil/i })).toBeVisible();

  await page.locator("summary", { hasText: "Gerenciar progresso" }).click();
  await page.getByLabel("Arquivo de backup do progresso").setInputFiles(filePath);

  const confirmation = page.getByRole("group", {
    name: /confirmar importação de backup/i,
  });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "Substituir tudo" }).click();

  await expect(page.getByRole("status")).toContainText("Backup importado com sucesso.");
  await expect(profileList(page).locator("li", { hasText: "Ana" })).toBeVisible();
  await expect(profileList(page).locator("li", { hasText: "Bruno" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Ana", exact: true })).toBeVisible();
});

test("a navegação e o rodapé levam ao perfil", async ({ page }) => {
  const viewport = page.viewportSize();
  await seedProfile(page);

  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Perfil" })).toHaveAttribute(
    "href",
    "/perfil/",
  );

  if (viewport && viewport.width >= 768) {
    await page.getByRole("button", { name: /trocar de perfil/i }).click();
    await page.getByRole("link", { name: "Gerenciar perfis" }).click();
  } else {
    await page.locator("header summary").click();
    await page.locator("header details a", { hasText: "Perfil" }).click();
  }

  await expect(page).toHaveURL(/\/perfil\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: /seu perfil/i })).toBeVisible();
});
