import { HISTORY_END, HISTORY_START, history, type HistoryYear } from "@/content/history";

import { annualToMonthly } from "./finance";

export type HistoryPoint = {
  year: number;
  invested: number;
  cdi: number;
  ibov: number;
  cdiReal: number;
  ibovReal: number;
  investedReal: number;
  inflationIndex: number;
};

export type HistorySimulationInput = {
  initial?: number;
  monthly?: number;
  startYear?: number;
  endYear?: number;
};

export type HistorySimulation = {
  points: HistoryPoint[];
  years: HistoryYear[];
  invested: number;
  finalCdi: number;
  finalIbov: number;
  realCdi: number;
  realIbov: number;
  inflationAccumulated: number;
  cdiAccumulated: number;
  ibovAccumulated: number;
  bestIbovYear: HistoryYear;
  worstIbovYear: HistoryYear;
};

function clampYear(year: number) {
  return Math.min(HISTORY_END, Math.max(HISTORY_START, Math.round(year)));
}

/**
 * Simula aportes mensais aplicados às séries anuais de CDI e Ibovespa.
 * Cada ano usa a taxa mensal equivalente à taxa anual, com o aporte no fim
 * de cada mês. A inflação corrige os valores para poder de compra.
 */
export function simulateHistory({
  initial = 1000,
  monthly = 200,
  startYear = HISTORY_START,
  endYear = HISTORY_END,
}: HistorySimulationInput = {}): HistorySimulation {
  const from = clampYear(Math.min(startYear, endYear));
  const to = clampYear(Math.max(startYear, endYear));
  const years = history.filter((item) => item.year >= from && item.year <= to);

  const safeInitial = Math.max(0, initial);
  const safeMonthly = Math.max(0, monthly);

  let cdiBalance = safeInitial;
  let ibovBalance = safeInitial;
  let invested = safeInitial;
  let inflationIndex = 1;
  let cdiIndex = 1;
  let ibovIndex = 1;

  const points: HistoryPoint[] = [];

  for (const item of years) {
    const monthlyCdi = annualToMonthly(item.cdi / 100);
    const monthlyIbov = annualToMonthly(item.ibov / 100);

    for (let month = 0; month < 12; month += 1) {
      cdiBalance = cdiBalance * (1 + monthlyCdi) + safeMonthly;
      ibovBalance = ibovBalance * (1 + monthlyIbov) + safeMonthly;
      invested += safeMonthly;
    }

    inflationIndex *= 1 + item.ipca / 100;
    cdiIndex *= 1 + item.cdi / 100;
    ibovIndex *= 1 + item.ibov / 100;

    points.push({
      year: item.year,
      invested,
      cdi: cdiBalance,
      ibov: ibovBalance,
      cdiReal: cdiBalance / inflationIndex,
      ibovReal: ibovBalance / inflationIndex,
      investedReal: invested / inflationIndex,
      inflationIndex,
    });
  }

  const last = points[points.length - 1];
  const bestIbovYear = years.reduce(
    (best, item) => (item.ibov > best.ibov ? item : best),
    years[0],
  );
  const worstIbovYear = years.reduce(
    (worst, item) => (item.ibov < worst.ibov ? item : worst),
    years[0],
  );

  return {
    points,
    years,
    invested: last?.invested ?? safeInitial,
    finalCdi: last?.cdi ?? safeInitial,
    finalIbov: last?.ibov ?? safeInitial,
    realCdi: last?.cdiReal ?? safeInitial,
    realIbov: last?.ibovReal ?? safeInitial,
    inflationAccumulated: inflationIndex - 1,
    cdiAccumulated: cdiIndex - 1,
    ibovAccumulated: ibovIndex - 1,
    bestIbovYear,
    worstIbovYear,
  };
}
