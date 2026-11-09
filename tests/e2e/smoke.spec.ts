import { expect, test, type Page } from "@playwright/test";

async function answerJurosCompostosQuiz(page: Page) {
  const quiz = page.locator('section[aria-labelledby="quiz-titulo"]');

  await quiz.getByText("Nos compostos, os juros também rendem juros", { exact: true }).click();
  await quiz.getByText("R$ 1.126,83", { exact: true }).click();
  await quiz.getByText("6 anos", { exact: true }).click();
  await quiz.getByText("O tempo investido", { exact: true }).click();

  await quiz.getByRole("button", { name: /ver resultado/i }).click();

  await expect(quiz.getByText("4 de 4 corretas (100%)")).toBeVisible();
}

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

test("a página sobre explica como o produto funciona", async ({ page }) => {
  await page.goto("/sobre/");

  await expect(
    page.getByRole("heading", { level: 1, name: /como o investe fácil funciona/i }),
  ).toBeVisible();

  for (const heading of [
    "Para quem é",
    "A trilha em 3 módulos",
    "O material",
    "Os exercícios",
    "Quiz e progresso",
    "Glossário",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
  }
});

test("a página não tem rolagem horizontal", async ({ page }) => {
  for (const route of [
    "/trilha/",
    "/trilha/fundamentos/juros-compostos/",
    "/trilha/renda-fixa/ir-iof-liquidez/",
    "/glossario/",
    "/sobre/",
    "/simulador/",
    "/missoes/",
  ]) {
    await page.goto(route);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow, `overflow horizontal em ${route}`).toBeLessThanOrEqual(1);
  }
});

test("concluir uma lição exige o quiz e persiste após recarregar", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  const complete = page.getByRole("button", { name: /concluir lição/i });

  await expect(complete).toBeDisabled();
  await expect(page.getByText("Responda ao quiz acima para liberar a conclusão.")).toBeVisible();

  await answerJurosCompostosQuiz(page);
  await expect(complete).toBeEnabled();

  await complete.click();
  await expect(page.getByText("Lição concluída")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Lição concluída")).toBeVisible();

  await page.goto("/trilha/");
  await expect(
    page
      .getByRole("region", { name: "Resumo do seu progresso" })
      .getByText("40 XP", { exact: true }),
  ).toBeVisible();
});

test("o quiz corrige as respostas e registra o resultado", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  await answerJurosCompostosQuiz(page);
});

test("o simulador de juros compostos reage aos controles", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  const simulator = page.locator('section[aria-labelledby="simulador-juros-compostos"]');

  const aporte = simulator.getByLabel(/aporte por mês/i);

  const caixa = await aporte.boundingBox();
  expect(caixa?.height ?? 0, "área de toque do slider").toBeGreaterThanOrEqual(24);

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

test("o comparativo de tempo mostra os valores corretos", async ({ page }) => {
  await page.goto("/trilha/fundamentos/por-que-investir/");

  const comparison = page.locator('section[aria-labelledby="comparativo-tempo"]');

  await expect(comparison.getByText("R$ 60.065", { exact: true })).toBeVisible();
  await expect(comparison.getByText("R$ 216.339", { exact: true })).toBeVisible();
  await expect(comparison.getByText("3,6x", { exact: true })).toBeVisible();
  await expect(comparison.getByText("6x", { exact: true })).toBeVisible();
  await expect(comparison.getByText("R$ 36.000", { exact: true }).first()).toBeVisible();
  await expect(comparison.getByText("Aportado", { exact: true })).toHaveCount(2);
  await expect(comparison.getByText("Juros", { exact: true })).toHaveCount(2);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  expect(overflow, "overflow horizontal na lição").toBeLessThanOrEqual(1);
});

test("o comparativo de juros simples e compostos usa os valores calculados", async ({ page }) => {
  await page.goto("/trilha/fundamentos/juros-compostos/");

  const comparison = page.locator('section[aria-labelledby="comparativo-juros"]');

  await expect(comparison.getByText("R$ 2.200,00", { exact: true })).toBeVisible();
  await expect(comparison.getByText("R$ 3.300,39", { exact: true })).toBeVisible();
  await expect(comparison.getByText("R$ 1.061,52", { exact: true })).toBeVisible();
  await expect(comparison.getByText("R$ 1.126,83", { exact: true })).toBeVisible();
  await expect(comparison.getByText("R$ 1.100,39", { exact: true })).toBeVisible();
  await expect(comparison.getByText("3,3x", { exact: true })).toBeVisible();
});

test("as tabelas de IR e IOF refletem as regras oficiais", async ({ page }) => {
  await page.goto("/trilha/renda-fixa/ir-iof-liquidez/");

  const brackets = page.locator('section[aria-labelledby="faixas-ir"]');

  await expect(brackets.getByText("22,5%", { exact: true })).toBeVisible();
  await expect(brackets.getByText("20%", { exact: true })).toBeVisible();
  await expect(brackets.getByText("17,5%", { exact: true })).toBeVisible();
  await expect(brackets.getByText("15%", { exact: true })).toBeVisible();

  const iof = page.locator('section[aria-labelledby="tabela-iof"]');

  await expect(iof.getByText("96%", { exact: true })).toBeVisible();
  await expect(iof.getByText("66%", { exact: true })).toBeVisible();
  await expect(iof.getByText("33%", { exact: true })).toBeVisible();
  await expect(iof.getByText("3%", { exact: true })).toBeVisible();
  await expect(iof.getByText("0%", { exact: true })).toBeVisible();
  await expect(iof.getByText("A partir do 30º dia", { exact: true })).toBeVisible();
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

test("o menu mobile abre, navega e fecha", async ({ page }) => {
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width >= 640, "menu suspenso só aparece em telas estreitas");

  const menu = page.locator("header details");
  const summary = page.locator("header summary");

  await summary.click();
  await expect(menu).toHaveAttribute("open", "");

  await page.locator("header details a", { hasText: "Glossário" }).click();
  await expect(page).toHaveURL(/\/glossario\/?$/);
  await expect(menu).not.toHaveAttribute("open", "");

  await summary.click();
  await expect(menu).toHaveAttribute("open", "");

  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
});

test("a navegação horizontal mantém alvos de toque de 44px", async ({ page }) => {
  const viewport = page.viewportSize();
  test.skip(!viewport || viewport.width < 640, "navegação horizontal só aparece a partir de 640px");

  const links = page.locator("header nav a");
  const total = await links.count();

  expect(total).toBeGreaterThan(0);

  for (let index = 0; index < total; index += 1) {
    const caixa = await links.nth(index).boundingBox();
    expect(caixa?.height ?? 0, `link ${index} da navegação`).toBeGreaterThanOrEqual(44);
  }
});
