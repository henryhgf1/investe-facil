import { describe, expect, it } from "vitest";

import { simulateHistory } from "./history";

describe("simulateHistory", () => {
  it("aplica a taxa anual do CDI em um único ano", () => {
    const result = simulateHistory({ initial: 1000, monthly: 0, startYear: 2000, endYear: 2000 });

    expect(result.finalCdi).toBeCloseTo(1173, 0);
    expect(result.cdiAccumulated).toBeCloseTo(0.173, 3);
    expect(result.points).toHaveLength(1);
  });

  it("soma os aportes ao total investido", () => {
    const result = simulateHistory({ initial: 1000, monthly: 100, startYear: 2000, endYear: 2000 });

    expect(result.invested).toBe(2200);
    expect(result.finalCdi).toBeGreaterThan(result.invested);
    expect(result.finalIbov).toBeLessThan(result.invested);
  });

  it("corrige os valores pela inflação acumulada", () => {
    const result = simulateHistory({ initial: 1000, monthly: 0, startYear: 2000, endYear: 2024 });
    const last = result.points[result.points.length - 1];

    expect(result.inflationAccumulated).toBeGreaterThan(0);
    expect(result.realCdi).toBeLessThan(result.finalCdi);
    expect(result.realIbov).toBeLessThan(result.finalIbov);
    expect(last.investedReal).toBeCloseTo(result.invested / (1 + result.inflationAccumulated), 5);
  });

  it("inverte o intervalo quando os anos vêm ao contrário", () => {
    const normal = simulateHistory({ initial: 1000, monthly: 100, startYear: 2010, endYear: 2020 });
    const reversed = simulateHistory({
      initial: 1000,
      monthly: 100,
      startYear: 2020,
      endYear: 2010,
    });

    expect(reversed.finalCdi).toBeCloseTo(normal.finalCdi, 5);
    expect(reversed.years.map((item) => item.year)).toEqual(normal.years.map((item) => item.year));
  });

  it("limita anos fora da série histórica", () => {
    const result = simulateHistory({ initial: 1000, monthly: 0, startYear: 1990, endYear: 2030 });

    expect(result.years[0].year).toBe(2000);
    expect(result.years[result.years.length - 1].year).toBe(2024);
  });

  it("identifica o melhor e o pior ano do Ibovespa", () => {
    const result = simulateHistory();

    expect(result.bestIbovYear.year).toBe(2009);
    expect(result.worstIbovYear.year).toBe(2008);
  });

  it("nunca devolve saldo negativo com aportes zerados", () => {
    const result = simulateHistory({ initial: 0, monthly: 0, startYear: 2000, endYear: 2024 });

    expect(result.finalCdi).toBe(0);
    expect(result.finalIbov).toBe(0);
    expect(result.invested).toBe(0);
  });
});
