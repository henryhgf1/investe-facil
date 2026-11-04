import { describe, expect, it } from "vitest";

import { annualToMonthly, projectMonthly, purchasingPowerSeries, realReturn } from "./finance";

describe("projectMonthly", () => {
  it("mantém o saldo igual ao investido quando a taxa é zero", () => {
    const points = projectMonthly({ monthly: 100, monthlyRate: 0, months: 12 });
    const last = points.at(-1);

    expect(last?.balance).toBeCloseTo(1200, 6);
    expect(last?.invested).toBeCloseTo(1200, 6);
  });

  it("calcula juros compostos de um aporte único", () => {
    const points = projectMonthly({ initial: 1000, monthlyRate: 0.01, months: 12 });

    expect(points.at(-1)?.balance).toBeCloseTo(1126.825, 2);
  });

  it("soma os aportes ao valor investido", () => {
    const points = projectMonthly({ initial: 500, monthly: 200, monthlyRate: 0.008, months: 10 });

    expect(points.at(-1)?.invested).toBeCloseTo(2500, 6);
  });

  it("devolve o primeiro ponto no mês zero", () => {
    const points = projectMonthly({ initial: 300, monthly: 50, monthlyRate: 0.005, months: 3 });

    expect(points[0]).toEqual({ month: 0, invested: 300, balance: 300 });
    expect(points).toHaveLength(4);
  });
});

describe("annualToMonthly", () => {
  it("converte 12,68% ao ano em aproximadamente 1% ao mês", () => {
    expect(annualToMonthly(0.1268) * 100).toBeCloseTo(1, 2);
  });
});

describe("realReturn", () => {
  it("desconta a inflação dividindo os fatores", () => {
    expect(realReturn(0.1, 0.05) * 100).toBeCloseTo(4.7619, 3);
  });
});

describe("purchasingPowerSeries", () => {
  it("perde poder de compra com inflação positiva", () => {
    const points = purchasingPowerSeries({ initial: 1000, annualInflation: 0.05, years: 10 });

    expect(points.at(-1)?.nominal).toBe(1000);
    expect(points.at(-1)?.real).toBeCloseTo(613.91, 2);
  });

  it("mantém o valor real quando a inflação é zero", () => {
    const points = purchasingPowerSeries({ initial: 1000, annualInflation: 0, years: 5 });

    expect(points.at(-1)?.real).toBeCloseTo(1000, 6);
  });
});
