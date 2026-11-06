import { describe, expect, it } from "vitest";

import { HISTORY_END, HISTORY_START, history, historyForRange, historySource } from "./history";

describe("dados históricos", () => {
  it("cobre 2000 a 2024 sem lacunas", () => {
    expect(HISTORY_START).toBe(2000);
    expect(HISTORY_END).toBe(2024);
    expect(history).toHaveLength(25);

    history.forEach((item, index) => {
      expect(item.year).toBe(2000 + index);
    });
  });

  it("tem valores plausíveis para CDI, Ibovespa e IPCA", () => {
    for (const item of history) {
      expect(Number.isFinite(item.cdi), `CDI inválido em ${item.year}`).toBe(true);
      expect(Number.isFinite(item.ibov), `Ibovespa inválido em ${item.year}`).toBe(true);
      expect(Number.isFinite(item.ipca), `IPCA inválido em ${item.year}`).toBe(true);
      expect(item.cdi, `CDI negativo em ${item.year}`).toBeGreaterThan(0);
      expect(item.ipca, `IPCA negativo em ${item.year}`).toBeGreaterThan(0);
      expect(item.ibov, `Ibovespa irreal em ${item.year}`).toBeGreaterThan(-100);
    }
  });

  it("filtra intervalos e aceita os anos em qualquer ordem", () => {
    expect(historyForRange(2000, 2000)).toHaveLength(1);
    expect(historyForRange(2024, 2000)).toHaveLength(25);
    expect(historyForRange(2010, 2012).map((item) => item.year)).toEqual([2010, 2011, 2012]);
  });

  it("declara as fontes usadas no simulador", () => {
    expect(historySource.cdi.length).toBeGreaterThan(20);
    expect(historySource.ibov.length).toBeGreaterThan(20);
    expect(historySource.ipca.length).toBeGreaterThan(20);
    expect(historySource.note.length).toBeGreaterThan(20);
  });
});
