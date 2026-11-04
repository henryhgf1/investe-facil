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
  for (const route of ["/trilha/", "/glossario/"]) {
    await page.goto(route);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow, `overflow horizontal em ${route}`).toBeLessThanOrEqual(1);
  }
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

  await expect(async () => {
    await aporte.evaluate((element) => {
      const input = element as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "1000");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await expect(simulator.locator("output").first()).toContainText("1.000");
  }).toPass({ timeout: 10_000 });

  await expect(aporte).toHaveValue("1000");
});

const lessonPaths = [
  "/trilha/fundamentos/por-que-investir/",
  "/trilha/fundamentos/juros-compostos/",
  "/trilha/fundamentos/inflacao/",
  "/trilha/fundamentos/risco-e-retorno/",
  "/trilha/renda-fixa/cdi-selic-tesouro/",
  "/trilha/renda-fixa/cdb-lci-lca/",
  "/trilha/renda-fixa/ir-iof-liquidez/",
  "/trilha/renda-variavel/o-que-e-uma-acao/",
  "/trilha/renda-variavel/dividendos-fiis-etfs/",
  "/trilha/renda-variavel/diversificacao/",
];

test("todas as 10 lições publicadas abrem sem erro", async ({ page }) => {
  for (const path of lessonPaths) {
    const response = await page.goto(path);

    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), path).toBeVisible();
    await expect(page.getByText("Página não encontrada"), path).toHaveCount(0);
  }
});

test("o glossário busca sem acento e filtra por categoria", async ({ page }) => {
  await page.goto("/glossario/");

  const search = page.getByLabel(/buscar termo no glossário/i);

  await search.fill("inflacao");
  await expect(
    page.getByRole("heading", { level: 3, name: "Inflação", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/\d+ termos? para/)).toBeVisible();

  await search.fill("");
  await page.getByRole("button", { name: /^Renda fixa/ }).click();
  await expect(page.getByRole("heading", { level: 3, name: "CDB", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Ação", exact: true })).toHaveCount(0);

  await search.fill("xyzabc");
  await expect(page.getByText("Ainda não temos esse termo")).toBeVisible();

  await page.getByRole("button", { name: /limpar filtros/i }).click();
  await expect(page.getByRole("heading", { level: 3, name: "Ação", exact: true })).toBeVisible();
});

test("a calculadora de IR e IOF reage ao prazo", async ({ page }) => {
  await page.goto("/trilha/renda-fixa/ir-iof-liquidez/");

  const simulator = page.locator('section[aria-labelledby="simulador-impostos"]');
  const prazo = simulator.getByLabel(/prazo até o resgate/i);

  await expect(async () => {
    await prazo.evaluate((element) => {
      const input = element as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "1");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await expect(simulator.getByText(/IOF consome 96%/)).toBeVisible();
  }).toPass({ timeout: 10_000 });

  await expect(prazo).toHaveValue("1");
});

test("o simulador de diversificação reage ao número de ativos", async ({ page }) => {
  await page.goto("/trilha/renda-variavel/diversificacao/");

  const simulator = page.locator('section[aria-labelledby="simulador-diversificacao"]');
  const ativos = simulator.getByLabel(/ativos na carteira/i);

  await expect(async () => {
    await ativos.evaluate((element) => {
      const input = element as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "20");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await expect(simulator.getByText(/Risco com 20/)).toBeVisible();
  }).toPass({ timeout: 10_000 });

  await expect(ativos).toHaveValue("20");
});
