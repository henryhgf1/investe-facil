import { beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_STORAGE_KEY, applyTheme, getStoredTheme, resolveTheme, setTheme } from "./theme";

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })),
  );
}

describe("theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "";
    vi.unstubAllGlobals();
  });

  it("usa o sistema quando não há preferência salva", () => {
    mockMatchMedia(false);

    expect(getStoredTheme()).toBe("system");
  });

  it("lê apenas valores válidos do localStorage", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(getStoredTheme()).toBe("dark");

    window.localStorage.setItem(THEME_STORAGE_KEY, "neon");
    expect(getStoredTheme()).toBe("system");
  });

  it("resolve o tema do sistema pela preferência do navegador", () => {
    mockMatchMedia(true);
    expect(resolveTheme("system")).toBe("dark");

    mockMatchMedia(false);
    expect(resolveTheme("system")).toBe("light");
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("aplica a classe dark e o color-scheme no elemento raiz", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("persiste a escolha e aplica o tema imediatamente", () => {
    mockMatchMedia(false);

    setTheme("dark");

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    setTheme("light");

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("respeita a preferência do sistema ao aplicar o tema system", () => {
    mockMatchMedia(true);
    setTheme("system");

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    mockMatchMedia(false);
    applyTheme("system");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
