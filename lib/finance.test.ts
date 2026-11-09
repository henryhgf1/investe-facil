import { describe, expect, it } from "vitest";

import {
  annualToMonthly,
  dividendYield,
  incomeTaxRate,
  IOF_TABLE,
  IR_BRACKETS,
  iofRate,
  netFixedIncome,
  portfolioRisk,
  poupancaAnnualRate,
  projectMonthly,
  purchasingPowerSeries,
  realReturn,
  simpleInterestBalance,
} from "./finance";

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

  it("sustenta os números do comparativo entre Ana e Bruno", () => {
    const ana = projectMonthly({ monthly: 300, monthlyRate: 0.008, months: 120 }).at(-1);
    const bruno = projectMonthly({ monthly: 300, monthlyRate: 0.008, months: 240 }).at(-1);

    expect(ana?.balance).toBeCloseTo(60065.24, 2);
    expect(bruno?.balance).toBeCloseTo(216339.37, 2);

    const anaInterest = (ana?.balance ?? 0) - (ana?.invested ?? 0);
    const brunoInterest = (bruno?.balance ?? 0) - (bruno?.invested ?? 0);

    expect((bruno?.balance ?? 0) / (ana?.balance ?? 0)).toBeCloseTo(3.6, 1);
    expect(brunoInterest / anaInterest).toBeCloseTo(6, 1);
  });
});

describe("annualToMonthly", () => {
  it("converte 12,68% ao ano em aproximadamente 1% ao mês", () => {
    expect(annualToMonthly(0.1268) * 100).toBeCloseTo(1, 2);
  });
});

describe("simpleInterestBalance", () => {
  it("rende sempre sobre o capital inicial", () => {
    const base = { principal: 1000, monthlyRate: 0.01 };

    expect(simpleInterestBalance({ ...base, months: 1 })).toBeCloseTo(1010, 2);
    expect(simpleInterestBalance({ ...base, months: 6 })).toBeCloseTo(1060, 2);
    expect(simpleInterestBalance({ ...base, months: 12 })).toBeCloseTo(1120, 2);
    expect(simpleInterestBalance({ ...base, months: 120 })).toBeCloseTo(2200, 2);
  });

  it("não rende com taxa ou prazo zero", () => {
    expect(simpleInterestBalance({ principal: 1000, monthlyRate: 0, months: 12 })).toBe(1000);
    expect(simpleInterestBalance({ principal: 1000, monthlyRate: 0.01, months: 0 })).toBe(1000);
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

describe("incomeTaxRate", () => {
  it("respeita as fronteiras da tabela regressiva", () => {
    expect(incomeTaxRate(180)).toBe(0.225);
    expect(incomeTaxRate(181)).toBe(0.2);
    expect(incomeTaxRate(360)).toBe(0.2);
    expect(incomeTaxRate(361)).toBe(0.175);
    expect(incomeTaxRate(720)).toBe(0.175);
    expect(incomeTaxRate(721)).toBe(0.15);
  });

  it("mantém IR_BRACKETS alinhado ao cálculo", () => {
    expect(IR_BRACKETS.map((bracket) => bracket.rate)).toEqual([0.225, 0.2, 0.175, 0.15]);

    for (const bracket of IR_BRACKETS) {
      if (bracket.maxDays === null) continue;

      expect(incomeTaxRate(bracket.maxDays)).toBe(bracket.rate);
      expect(incomeTaxRate(bracket.maxDays + 1)).not.toBe(bracket.rate);
    }
  });
});

describe("iofRate", () => {
  it("segue a tabela oficial dos primeiros 30 dias", () => {
    expect(iofRate(1)).toBeCloseTo(0.96, 6);
    expect(iofRate(15)).toBeCloseTo(0.5, 6);
    expect(iofRate(29)).toBeCloseTo(0.03, 6);
    expect(iofRate(30)).toBe(0);
    expect(iofRate(90)).toBe(0);
  });

  it("tem 30 posições, da maior alíquota até zero", () => {
    expect(IOF_TABLE).toHaveLength(30);
    expect(IOF_TABLE[0]).toBe(0.96);
    expect(IOF_TABLE[IOF_TABLE.length - 1]).toBe(0);
  });
});

describe("netFixedIncome", () => {
  it("cobra 17,5% de IR em um CDB de um ano", () => {
    const result = netFixedIncome({ principal: 1000, annualRate: 0.1, days: 365 });

    expect(result.gross).toBeCloseTo(100, 6);
    expect(result.iof).toBe(0);
    expect(result.ir).toBeCloseTo(17.5, 6);
    expect(result.netAmount).toBeCloseTo(1082.5, 6);
    expect(result.effectiveAnnualRate * 100).toBeCloseTo(8.25, 6);
  });

  it("cai para 15% de IR depois de 720 dias", () => {
    const result = netFixedIncome({ principal: 1000, annualRate: 0.1, days: 730 });

    expect(result.gross).toBeCloseTo(210, 6);
    expect(result.ir).toBeCloseTo(31.5, 6);
    expect(result.netAmount).toBeCloseTo(1178.5, 6);
  });

  it("não cobra IOF no 30º dia", () => {
    const result = netFixedIncome({ principal: 1000, annualRate: 0.12, days: 30 });

    expect(result.iof).toBe(0);
    expect(result.ir).toBeGreaterThan(0);
  });

  it("quase zera o rendimento no primeiro dia por causa do IOF", () => {
    const result = netFixedIncome({ principal: 1000, annualRate: 0.12, days: 1 });

    expect(result.iof / result.gross).toBeCloseTo(0.96, 6);
    expect(result.netGain).toBeLessThan(result.gross * 0.05);
  });

  it("isenta LCI de IR e IOF", () => {
    const result = netFixedIncome({
      principal: 1000,
      annualRate: 0.1,
      days: 365,
      product: "lci",
    });

    expect(result.iof).toBe(0);
    expect(result.ir).toBe(0);
    expect(result.netAmount).toBeCloseTo(1100, 6);
  });
});

describe("poupancaAnnualRate", () => {
  it("rende 0,5% ao mês quando a Selic está acima de 8,5%", () => {
    expect(poupancaAnnualRate(0.1) * 100).toBeCloseTo(6.1678, 3);
  });

  it("rende 70% da Selic quando ela está abaixo de 8,5%", () => {
    expect(poupancaAnnualRate(0.05) * 100).toBeCloseTo(3.5, 6);
    expect(poupancaAnnualRate(0.085) * 100).toBeCloseTo(5.95, 6);
  });
});

describe("dividendYield", () => {
  it("calcula o provento sobre o preço", () => {
    expect(dividendYield({ dividendPerShare: 0.6, price: 12 }) * 100).toBeCloseTo(5, 6);
  });

  it("devolve zero para preço inválido", () => {
    expect(dividendYield({ dividendPerShare: 1, price: 0 })).toBe(0);
  });
});

describe("portfolioRisk", () => {
  it("mantém o risco do ativo quando há só um ativo", () => {
    expect(portfolioRisk({ assetRisk: 0.2, assetCount: 1, correlation: 0.4 })).toBeCloseTo(0.2, 6);
  });

  it("reduz o risco com ativos descorrelacionados", () => {
    expect(portfolioRisk({ assetRisk: 0.2, assetCount: 4, correlation: 0 })).toBeCloseTo(0.1, 6);
  });

  it("não reduz risco quando a correlação é perfeita", () => {
    expect(portfolioRisk({ assetRisk: 0.2, assetCount: 10, correlation: 1 })).toBeCloseTo(0.2, 6);
  });

  it("converge para o piso da correlação com muitos ativos", () => {
    const risk = portfolioRisk({ assetRisk: 0.2, assetCount: 100, correlation: 0.5 });

    expect(risk).toBeCloseTo(0.2 * Math.sqrt(0.505), 6);
  });
});
