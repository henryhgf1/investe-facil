import { expect, test, type Page } from "@playwright/test";

const THEME_KEY = "investe-facil:theme";

async function openThemeMenu(page: Page) {
  await page.getByRole("button", { name: /trocar tema/i }).click();
  await expect(page.getByRole("menu", { name: /escolher tema/i })).toBeVisible();
}

async function isDark(page: Page) {
  return page.evaluate(() => document.documentElement.classList.contains("dark"));
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => window.localStorage.removeItem(key), THEME_KEY);
  await page.reload();
});

test("o tema inicial acompanha a preferência do sistema", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();

  expect(await isDark(page)).toBe(true);

  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();

  expect(await isDark(page)).toBe(false);
});

test("o menu de tema oferece claro, escuro e sistema", async ({ page }) => {
  await openThemeMenu(page);

  const options = page.getByRole("menuitemradio");

  await expect(options).toHaveCount(3);
  await expect(page.getByRole("menuitemradio", { name: "Claro" })).toBeVisible();
  await expect(page.getByRole("menuitemradio", { name: "Escuro" })).toBeVisible();
  await expect(page.getByRole("menuitemradio", { name: "Sistema" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

test("alternar para escuro persiste após recarregar", async ({ page }) => {
  await openThemeMenu(page);
  await page.getByRole("menuitemradio", { name: "Escuro" }).click();

  expect(await isDark(page)).toBe(true);
  expect(await page.evaluate((key) => window.localStorage.getItem(key), THEME_KEY)).toBe("dark");

  await page.reload();

  expect(await isDark(page)).toBe(true);
});

test("alternar para claro persiste após recarregar", async ({ page }) => {
  await openThemeMenu(page);
  await page.getByRole("menuitemradio", { name: "Claro" }).click();

  expect(await isDark(page)).toBe(false);
  expect(await page.evaluate((key) => window.localStorage.getItem(key), THEME_KEY)).toBe("light");

  await page.reload();

  expect(await isDark(page)).toBe(false);
});

test("o modo sistema volta a seguir o navegador", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await openThemeMenu(page);
  await page.getByRole("menuitemradio", { name: "Claro" }).click();

  expect(await isDark(page)).toBe(false);

  await openThemeMenu(page);
  await page.getByRole("menuitemradio", { name: "Sistema" }).click();

  expect(await isDark(page)).toBe(true);
  expect(await page.evaluate((key) => window.localStorage.getItem(key), THEME_KEY)).toBe("system");
});

test("o menu de tema fecha com Escape e devolve o foco", async ({ page }) => {
  const trigger = page.getByRole("button", { name: /trocar tema/i });

  await trigger.click();
  await expect(page.getByRole("menu", { name: /escolher tema/i })).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("menu", { name: /escolher tema/i })).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
