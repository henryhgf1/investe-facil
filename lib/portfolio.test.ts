import { describe, expect, it } from "vitest";

import { HISTORY_END, HISTORY_START, history } from "@/content/history";

import { simulateHistory } from "./history";
import {
  ASSET_CLASSES,
  DEFAULT_ALLOCATION,
  PORTFOLIO_PRESETS,
  allocationPercentages,
  allocationTotal,
  annualizedReturn,
  maxDrawdown,
  normalizeAllocation,
  simulatePortfolio,
  type Allocation,
} from "./portfolio";

const cdiOnly: Allocation = {
  caixa: 1,
  rendaFixa: 0,
  fiis: 0,
  acoesBr: 0,
  internacional: 0,
};

const ibovOnly: Allocation = {
  caixa: 0,
  rendaFixa: 0,
  fiis: 0,
  acoesBr: 1,
  internacional: 0,
};

describe("asset classes e presets", () => {
  it("tem ids e cores únicos e proxies válidas", () => {
    expect(new Set(ASSET_CLASSES.map((asset) => asset.id)).size).toBe(ASSET_CLASSES.length);
    expect(new Set(ASSET_CLASSES.map((asset) => asset.color)).size).toBe(ASSET_CLASSES.length);

    for (const asset of ASSET_CLASSES) {
      expect(asset.cdiWeight).toBeGreaterThanOrEqual(0);
      expect(asset.cdiWeight).toBeLessThanOrEqual(1);
    }
  });

  it("mantém todos os presets e o padrão somando 100%", () => {
    expect(allocationTotal(DEFAULT_ALLOCATION)).toBeCloseTo(1, 10);

    for (const preset of PORTFOLIO_PRESETS) {
      expect(allocationTotal(preset.allocation)).toBeCloseTo(1, 10);
    }
  });
});

describe("normalizeAllocation", () => {
  it("normaliza pesos arbitrários para 100%", () => {
    const weights = normalizeAllocation({
      caixa: 1,
      rendaFixa: 1,
      fiis: 1,
      acoesBr: 1,
      internacional: 1,
    });

    for (const asset of ASSET_CLASSES) {
      expect(weights[asset.id]).toBeCloseTo(0.2, 10);
    }
  });

  it("zera pesos negativos e ignora valores inválidos", () => {
    const weights = normalizeAllocation({
      caixa: -3,
      rendaFixa: 2,
      fiis: Number.NaN,
      acoesBr: 2,
      internacional: 0,
    });

    expect(weights.caixa).toBe(0);
    expect(weights.fiis).toBe(0);
    expect(weights.rendaFixa).toBeCloseTo(0.5, 10);
    expect(weights.acoesBr).toBeCloseTo(0.5, 10);
  });

  it("cai no fallback quando a carteira está vazia", () => {
    const empty: Allocation = { caixa: 0, rendaFixa: 0, fiis: 0, acoesBr: 0, internacional: 0 };

    const fallback = normalizeAllocation(empty);

    for (const asset of ASSET_CLASSES) {
      expect(fallback[asset.id]).toBeCloseTo(DEFAULT_ALLOCATION[asset.id], 10);
    }

    expect(normalizeAllocation(empty, cdiOnly)).toEqual(cdiOnly);
  });

  it("converte os pesos em pontos percentuais", () => {
    const percentages = allocationPercentages(DEFAULT_ALLOCATION);

    expect(percentages.rendaFixa).toBeCloseTo(40, 10);
    expect(percentages.acoesBr).toBeCloseTo(20, 10);
    expect(Object.values(percentages).reduce((total, value) => total + value, 0)).toBeCloseTo(
      100,
      10,
    );
  });
});

describe("annualizedReturn e maxDrawdown", () => {
  it("calcula a média geométrica dos retornos", () => {
    expect(annualizedReturn([])).toBe(0);
    expect(annualizedReturn([0.1, 0.1])).toBeCloseTo(0.1, 10);
    expect(annualizedReturn([0.2, -0.1])).toBeCloseTo(Math.sqrt(1.2 * 0.9) - 1, 10);
  });

  it("mede a maior queda em relação ao topo", () => {
    expect(maxDrawdown([100, 120, 90])).toBeCloseTo(0.25, 10);
    expect(maxDrawdown([100, 110, 120])).toBe(0);
    expect(maxDrawdown([100, 50, 200, 150])).toBeCloseTo(0.5, 10);
  });
});

describe("simulatePortfolio", () => {
  it("percorre todo o histórico e projeta a carteira acima dos aportes", () => {
    const simulation = simulatePortfolio({
      allocation: DEFAULT_ALLOCATION,
      initial: 1000,
      monthly: 300,
    });

    expect(simulation.points).toHaveLength(history.length);
    expect(simulation.points[0].year).toBe(HISTORY_START);
    expect(simulation.points.at(-1)?.year).toBe(HISTORY_END);
    expect(simulation.invested).toBe(1000 + 300 * 12 * history.length);
    expect(simulation.finalPortfolio).toBeGreaterThan(simulation.invested);
    expect(simulation.gain).toBeGreaterThan(0);
    expect(simulation.realPortfolio).toBeLessThan(simulation.finalPortfolio);
    expect(simulation.inflationAccumulated).toBeGreaterThan(0);
    expect(simulation.bestYear.portfolioReturn).toBeGreaterThanOrEqual(
      simulation.worstYear.portfolioReturn,
    );
    expect(simulation.annualizedPortfolio).toBeGreaterThan(-1);
  });

  it("reproduz o CDI quando a carteira é 100% CDI", () => {
    const portfolio = simulatePortfolio({
      allocation: cdiOnly,
      initial: 1000,
      monthly: 200,
      startYear: 2005,
      endYear: 2024,
    });
    const benchmark = simulateHistory({
      initial: 1000,
      monthly: 200,
      startYear: 2005,
      endYear: 2024,
    });

    expect(portfolio.finalPortfolio).toBeCloseTo(benchmark.finalCdi, 6);
    expect(portfolio.invested).toBeCloseTo(benchmark.invested, 6);
    expect(portfolio.annualizedPortfolio).toBeCloseTo(portfolio.annualizedCdi, 10);
    expect(portfolio.maxDrawdown).toBeCloseTo(portfolio.cdiDrawdown, 10);
  });

  it("reproduz o Ibovespa quando a carteira é 100% ações", () => {
    const portfolio = simulatePortfolio({
      allocation: ibovOnly,
      initial: 1000,
      monthly: 200,
      startYear: 2005,
      endYear: 2024,
    });
    const benchmark = simulateHistory({
      initial: 1000,
      monthly: 200,
      startYear: 2005,
      endYear: 2024,
    });

    expect(portfolio.finalPortfolio).toBeCloseTo(benchmark.finalIbov, 6);
    expect(portfolio.annualizedPortfolio).toBeCloseTo(portfolio.annualizedIbov, 10);
    expect(portfolio.maxDrawdown).toBeCloseTo(portfolio.ibovDrawdown, 10);
  });

  it("reduz a queda máxima ao trocar risco por renda fixa", () => {
    const conservative = simulatePortfolio({
      allocation: PORTFOLIO_PRESETS[0].allocation,
      startYear: 2000,
      endYear: 2024,
    });
    const aggressive = simulatePortfolio({
      allocation: PORTFOLIO_PRESETS[2].allocation,
      startYear: 2000,
      endYear: 2024,
    });

    expect(conservative.maxDrawdown).toBeLessThan(aggressive.maxDrawdown);
  });

  it("respeita o intervalo e normaliza anos invertidos ou fora da série", () => {
    const short = simulatePortfolio({
      allocation: DEFAULT_ALLOCATION,
      startYear: 2024,
      endYear: 2020,
    });

    expect(short.points).toHaveLength(5);
    expect(short.points[0].year).toBe(2020);
    expect(short.points.at(-1)?.year).toBe(2024);

    const clamped = simulatePortfolio({
      allocation: DEFAULT_ALLOCATION,
      startYear: 1990,
      endYear: 2050,
    });

    expect(clamped.points[0].year).toBe(HISTORY_START);
    expect(clamped.points.at(-1)?.year).toBe(HISTORY_END);
  });

  it("é determinístico para a mesma entrada", () => {
    const first = simulatePortfolio({
      allocation: DEFAULT_ALLOCATION,
      startYear: 2010,
      endYear: 2024,
    });
    const second = simulatePortfolio({
      allocation: DEFAULT_ALLOCATION,
      startYear: 2010,
      endYear: 2024,
    });

    expect(second.finalPortfolio).toBe(first.finalPortfolio);
    expect(second.maxDrawdown).toBe(first.maxDrawdown);
  });

  it("devolve a carteira normalizada, mesmo com pesos soltos", () => {
    const simulation = simulatePortfolio({
      allocation: { caixa: 2, rendaFixa: 2, fiis: 0, acoesBr: 0, internacional: 0 },
    });

    expect(simulation.allocation.caixa).toBeCloseTo(0.5, 10);
    expect(simulation.allocation.rendaFixa).toBeCloseTo(0.5, 10);
  });
});
