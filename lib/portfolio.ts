import { HISTORY_END, HISTORY_START, historyForRange, type HistoryYear } from "@/content/history";

import { annualToMonthly } from "./finance";

export type AssetClassId = "caixa" | "rendaFixa" | "fiis" | "acoesBr" | "internacional";

export type AssetClass = {
  id: AssetClassId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  /**
   * Fração do retorno da classe que vem do CDI. O restante vem do Ibovespa.
   * Serve como proxy didática para classes sem série histórica própria.
   */
  cdiWeight: number;
  risk: "baixo" | "medio" | "alto";
};

export const ASSET_CLASSES: readonly AssetClass[] = [
  {
    id: "caixa",
    label: "Caixa e reserva",
    shortLabel: "Caixa",
    description: "Dinheiro de liquidez imediata, como Tesouro Selic ou CDB com resgate diário.",
    color: "var(--chart-6)",
    cdiWeight: 1,
    risk: "baixo",
  },
  {
    id: "rendaFixa",
    label: "Renda fixa",
    shortLabel: "Renda fixa",
    description: "CDBs, LCIs e Tesouro Direto. Peso alto costuma reduzir a oscilação da carteira.",
    color: "var(--chart-1)",
    cdiWeight: 1,
    risk: "baixo",
  },
  {
    id: "fiis",
    label: "Fundos imobiliários",
    shortLabel: "FIIs",
    description: "Fundos de galpões, shoppings e lajes corporativas, com renda mensal.",
    color: "var(--chart-3)",
    cdiWeight: 0.7,
    risk: "medio",
  },
  {
    id: "acoesBr",
    label: "Ações brasileiras",
    shortLabel: "Ações BR",
    description: "Empresas listadas na B3. Mais oscilação e mais potencial no longo prazo.",
    color: "var(--chart-2)",
    cdiWeight: 0,
    risk: "alto",
  },
  {
    id: "internacional",
    label: "Exposição internacional",
    shortLabel: "Internacional",
    description: "Ativos de fora do Brasil, que também sentem o câmbio e o mercado global.",
    color: "var(--chart-4)",
    cdiWeight: 0.3,
    risk: "alto",
  },
];

export type Allocation = Record<AssetClassId, number>;

export const DEFAULT_ALLOCATION: Allocation = {
  caixa: 0.1,
  rendaFixa: 0.4,
  fiis: 0.2,
  acoesBr: 0.2,
  internacional: 0.1,
};

export type PortfolioPreset = {
  id: "conservadora" | "equilibrada" | "arrojada";
  label: string;
  description: string;
  allocation: Allocation;
};

export const PORTFOLIO_PRESETS: readonly PortfolioPreset[] = [
  {
    id: "conservadora",
    label: "Conservadora",
    description: "Prioriza estabilidade: 80% em caixa e renda fixa.",
    allocation: { caixa: 0.2, rendaFixa: 0.6, fiis: 0.1, acoesBr: 0.05, internacional: 0.05 },
  },
  {
    id: "equilibrada",
    label: "Equilibrada",
    description: "Metade em renda fixa, metade em ativos de risco.",
    allocation: DEFAULT_ALLOCATION,
  },
  {
    id: "arrojada",
    label: "Arrojada",
    description: "Aceita mais oscilação para buscar mais retorno no longo prazo.",
    allocation: { caixa: 0.05, rendaFixa: 0.15, fiis: 0.2, acoesBr: 0.4, internacional: 0.2 },
  },
];

function normalizedWeights(allocation: Allocation): Allocation | null {
  const weights = {} as Allocation;
  let total = 0;

  for (const asset of ASSET_CLASSES) {
    const raw = allocation?.[asset.id];
    const value = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    weights[asset.id] = value;
    total += value;
  }

  if (total <= 0) return null;

  for (const asset of ASSET_CLASSES) {
    weights[asset.id] /= total;
  }

  return weights;
}

/** Soma dos pesos informados, antes de normalizar (1 = 100%). */
export function allocationTotal(allocation: Allocation) {
  return ASSET_CLASSES.reduce((total, asset) => {
    const raw = allocation?.[asset.id];
    return total + (Number.isFinite(raw) ? Math.max(0, raw) : 0);
  }, 0);
}

/**
 * Converte qualquer combinação de pesos em uma carteira que soma 100%.
 * Pesos negativos viram zero; uma carteira vazia cai no fallback.
 */
export function normalizeAllocation(
  allocation: Allocation,
  fallback: Allocation = DEFAULT_ALLOCATION,
): Allocation {
  return normalizedWeights(allocation) ?? normalizedWeights(fallback) ?? { ...DEFAULT_ALLOCATION };
}

/** Pesos normalizados em pontos percentuais (40 = 40%). */
export function allocationPercentages(allocation: Allocation): Allocation {
  const weights = normalizeAllocation(allocation);
  const percentages = {} as Allocation;

  for (const asset of ASSET_CLASSES) {
    percentages[asset.id] = weights[asset.id] * 100;
  }

  return percentages;
}

/** Retorno anualizado (média geométrica) de uma série de retornos decimais. */
export function annualizedReturn(returns: number[]) {
  if (returns.length === 0) return 0;

  const product = returns.reduce((total, value) => total * (1 + value), 1);
  return Math.pow(Math.max(0, product), 1 / returns.length) - 1;
}

/** Maior queda percentual de uma série de índices (drawdown máximo). */
export function maxDrawdown(values: number[]) {
  let peak = 0;
  let worst = 0;

  for (const value of values) {
    peak = Math.max(peak, value);
    if (peak > 0) worst = Math.max(worst, (peak - value) / peak);
  }

  return worst;
}

export type PortfolioPoint = {
  year: number;
  invested: number;
  portfolio: number;
  cdi: number;
  ibov: number;
  portfolioReal: number;
  cdiReal: number;
  ibovReal: number;
  investedReal: number;
  inflationIndex: number;
  /** Retorno da estratégia no ano, em decimal (0.12 = 12%). */
  portfolioReturn: number;
  cdiReturn: number;
  ibovReturn: number;
};

export type PortfolioSimulationInput = {
  allocation: Allocation;
  initial?: number;
  monthly?: number;
  startYear?: number;
  endYear?: number;
};

export type PortfolioSimulation = {
  points: PortfolioPoint[];
  years: HistoryYear[];
  allocation: Allocation;
  invested: number;
  finalPortfolio: number;
  finalCdi: number;
  finalIbov: number;
  realPortfolio: number;
  realCdi: number;
  realIbov: number;
  gain: number;
  realGain: number;
  annualizedPortfolio: number;
  annualizedCdi: number;
  annualizedIbov: number;
  maxDrawdown: number;
  cdiDrawdown: number;
  ibovDrawdown: number;
  inflationAccumulated: number;
  bestYear: PortfolioPoint;
  worstYear: PortfolioPoint;
  differenceVsCdi: number;
  differenceVsIbov: number;
};

function clampYear(year: number) {
  if (!Number.isFinite(year)) return HISTORY_END;
  return Math.min(HISTORY_END, Math.max(HISTORY_START, Math.round(year)));
}

function proxyMonthlyReturn(asset: AssetClass, monthlyCdi: number, monthlyIbov: number) {
  return asset.cdiWeight * monthlyCdi + (1 - asset.cdiWeight) * monthlyIbov;
}

/**
 * Testa a carteira contra o CDI e o Ibovespa no mesmo período e com os mesmos
 * aportes. Cada classe usa uma proxy: caixa e renda fixa seguem o CDI; ações
 * seguem o Ibovespa; FIIs e internacional misturam os dois. Os pesos são
 * rebalanceados todo mês, sem impostos, taxas ou dividendos.
 */
export function simulatePortfolio({
  allocation,
  initial = 1000,
  monthly = 200,
  startYear = HISTORY_START,
  endYear = HISTORY_END,
}: PortfolioSimulationInput): PortfolioSimulation {
  const weights = normalizeAllocation(allocation);
  const from = clampYear(Math.min(startYear, endYear));
  const to = clampYear(Math.max(startYear, endYear));
  const years = historyForRange(from, to);
  const safeInitial = Math.max(0, initial);
  const safeMonthly = Math.max(0, monthly);

  let portfolioBalance = safeInitial;
  let cdiBalance = safeInitial;
  let ibovBalance = safeInitial;
  let invested = safeInitial;
  let inflationIndex = 1;
  let portfolioIndex = 1;
  let cdiIndex = 1;
  let ibovIndex = 1;

  const portfolioIndexes: number[] = [1];
  const cdiIndexes: number[] = [1];
  const ibovIndexes: number[] = [1];
  const portfolioReturns: number[] = [];
  const cdiReturns: number[] = [];
  const ibovReturns: number[] = [];
  const points: PortfolioPoint[] = [];

  for (const item of years) {
    const monthlyCdi = annualToMonthly(item.cdi / 100);
    const monthlyIbov = annualToMonthly(item.ibov / 100);
    const monthlyPortfolio = ASSET_CLASSES.reduce(
      (total, asset) =>
        total + weights[asset.id] * proxyMonthlyReturn(asset, monthlyCdi, monthlyIbov),
      0,
    );

    for (let month = 0; month < 12; month += 1) {
      portfolioBalance = portfolioBalance * (1 + monthlyPortfolio) + safeMonthly;
      cdiBalance = cdiBalance * (1 + monthlyCdi) + safeMonthly;
      ibovBalance = ibovBalance * (1 + monthlyIbov) + safeMonthly;
      invested += safeMonthly;

      portfolioIndex *= 1 + monthlyPortfolio;
      cdiIndex *= 1 + monthlyCdi;
      ibovIndex *= 1 + monthlyIbov;

      portfolioIndexes.push(portfolioIndex);
      cdiIndexes.push(cdiIndex);
      ibovIndexes.push(ibovIndex);
    }

    inflationIndex *= 1 + item.ipca / 100;

    const portfolioReturn = Math.pow(1 + monthlyPortfolio, 12) - 1;
    portfolioReturns.push(portfolioReturn);
    cdiReturns.push(item.cdi / 100);
    ibovReturns.push(item.ibov / 100);

    points.push({
      year: item.year,
      invested,
      portfolio: portfolioBalance,
      cdi: cdiBalance,
      ibov: ibovBalance,
      portfolioReal: portfolioBalance / inflationIndex,
      cdiReal: cdiBalance / inflationIndex,
      ibovReal: ibovBalance / inflationIndex,
      investedReal: invested / inflationIndex,
      inflationIndex,
      portfolioReturn,
      cdiReturn: item.cdi / 100,
      ibovReturn: item.ibov / 100,
    });
  }

  const last = points[points.length - 1];
  const bestYear = points.reduce((best, point) =>
    point.portfolioReturn > best.portfolioReturn ? point : best,
  );
  const worstYear = points.reduce((worst, point) =>
    point.portfolioReturn < worst.portfolioReturn ? point : worst,
  );

  return {
    points,
    years,
    allocation: weights,
    invested: last.invested,
    finalPortfolio: last.portfolio,
    finalCdi: last.cdi,
    finalIbov: last.ibov,
    realPortfolio: last.portfolioReal,
    realCdi: last.cdiReal,
    realIbov: last.ibovReal,
    gain: last.portfolio - last.invested,
    realGain: last.portfolioReal - last.investedReal,
    annualizedPortfolio: annualizedReturn(portfolioReturns),
    annualizedCdi: annualizedReturn(cdiReturns),
    annualizedIbov: annualizedReturn(ibovReturns),
    maxDrawdown: maxDrawdown(portfolioIndexes),
    cdiDrawdown: maxDrawdown(cdiIndexes),
    ibovDrawdown: maxDrawdown(ibovIndexes),
    inflationAccumulated: inflationIndex - 1,
    bestYear,
    worstYear,
    differenceVsCdi: last.portfolio - last.cdi,
    differenceVsIbov: last.portfolio - last.ibov,
  };
}
