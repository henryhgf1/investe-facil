export type ProjectionPoint = {
  month: number;
  invested: number;
  balance: number;
};

type ProjectMonthlyInput = {
  initial?: number;
  monthly?: number;
  monthlyRate: number;
  months: number;
};

/**
 * Projeta o saldo mês a mês com juros compostos.
 * A taxa é mensal e expressa em decimal (0.008 = 0,8% ao mês).
 */
export function projectMonthly({
  initial = 0,
  monthly = 0,
  monthlyRate,
  months,
}: ProjectMonthlyInput): ProjectionPoint[] {
  const points: ProjectionPoint[] = [{ month: 0, invested: initial, balance: initial }];

  let balance = initial;
  let invested = initial;

  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + monthlyRate) + monthly;
    invested += monthly;
    points.push({ month, invested, balance });
  }

  return points;
}

/** Converte uma taxa anual em taxa mensal equivalente. */
export function annualToMonthly(annualRate: number) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * Retorno real (descontada a inflação), pela fórmula de Fisher:
 * (1 + nominal) / (1 + inflação) - 1
 */
export function realReturn(nominal: number, inflation: number) {
  return (1 + nominal) / (1 + inflation) - 1;
}

export type PurchasingPowerPoint = {
  month: number;
  nominal: number;
  real: number;
};

/** Série do poder de compra de um valor parado, mês a mês. */
export function purchasingPowerSeries({
  initial,
  annualInflation,
  years,
}: {
  initial: number;
  annualInflation: number;
  years: number;
}): PurchasingPowerPoint[] {
  const monthlyInflation = annualToMonthly(annualInflation);
  const months = Math.round(years * 12);
  const points: PurchasingPowerPoint[] = [];

  for (let month = 0; month <= months; month += 1) {
    points.push({
      month,
      nominal: initial,
      real: initial / Math.pow(1 + monthlyInflation, month),
    });
  }

  return points;
}

/**
 * Alíquota do Imposto de Renda na tabela regressiva da renda fixa.
 * 22,5% até 180 dias · 20% de 181 a 360 · 17,5% de 361 a 720 · 15% acima.
 */
export function incomeTaxRate(days: number) {
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.2;
  if (days <= 720) return 0.175;
  return 0.15;
}

/**
 * Tabela oficial do IOF sobre o rendimento, em % do lucro bruto.
 * Índice 0 = 1º dia (96%), índice 28 = 29º dia (3%), índice 29 = 30º dia (0%).
 */
export const IOF_TABLE = [
  0.96, 0.93, 0.9, 0.86, 0.83, 0.8, 0.76, 0.73, 0.7, 0.66, 0.63, 0.6, 0.56, 0.53, 0.5, 0.46, 0.43,
  0.4, 0.36, 0.33, 0.3, 0.26, 0.23, 0.2, 0.16, 0.13, 0.1, 0.06, 0.03, 0,
] as const;

/** Alíquota do IOF para resgate em `days` dias corridos. Zero a partir do 30º. */
export function iofRate(days: number) {
  if (days >= 30) return 0;
  if (days < 1) return IOF_TABLE[0];
  return IOF_TABLE[Math.floor(days) - 1];
}

export type FixedIncomeProduct = "cdb" | "lci";

export type NetFixedIncomeInput = {
  principal: number;
  /** Taxa anual efetiva em decimal (0.12 = 12% ao ano). */
  annualRate: number;
  days: number;
  /** CDB paga IR e IOF; LCI/LCA são isentos de IR (e a carência impede IOF). */
  product?: FixedIncomeProduct;
};

export type NetFixedIncomeResult = {
  gross: number;
  iof: number;
  ir: number;
  netAmount: number;
  netGain: number;
  effectiveAnnualRate: number;
};

/**
 * Rendimento líquido de renda fixa.
 *
 * Ordem de cálculo usada pelas corretoras: IOF sobre o rendimento bruto e,
 * depois, IR sobre o rendimento que sobrou. Juros compostos por dias
 * corridos (base 365) — uma simplificação didática em relação aos 252 dias
 * úteis do mercado.
 */
export function netFixedIncome({
  principal,
  annualRate,
  days,
  product = "cdb",
}: NetFixedIncomeInput): NetFixedIncomeResult {
  const safePrincipal = Math.max(0, principal);
  const safeDays = Math.max(1, Math.floor(days));
  const gross = safePrincipal * (Math.pow(1 + annualRate, safeDays / 365) - 1);
  const exempt = product === "lci";

  const iof = exempt ? 0 : Math.max(0, gross) * iofRate(safeDays);
  const taxableGain = Math.max(0, gross - iof);
  const ir = exempt ? 0 : taxableGain * incomeTaxRate(safeDays);
  const netGain = gross - iof - ir;
  const netAmount = safePrincipal + netGain;

  return {
    gross,
    iof,
    ir,
    netAmount,
    netGain,
    effectiveAnnualRate:
      safePrincipal > 0 ? Math.pow(netAmount / safePrincipal, 365 / safeDays) - 1 : 0,
  };
}

/**
 * Rentabilidade anual da poupança. Acima de 8,5% de Selic: 0,5% ao mês + TR
 * (TR ignorada). Abaixo: 70% da Selic. Isenta de IR.
 */
export function poupancaAnnualRate(selic: number) {
  const safeSelic = Math.max(0, selic);
  if (safeSelic > 0.085) return Math.pow(1.005, 12) - 1;
  return safeSelic * 0.7;
}

/** Dividend yield = provento por ação dividido pelo preço da ação. */
export function dividendYield({
  dividendPerShare,
  price,
}: {
  dividendPerShare: number;
  price: number;
}) {
  if (price <= 0) return 0;
  return Math.max(0, dividendPerShare) / price;
}

/**
 * Risco de uma carteira igualmente distribuída, dado o risco de cada ativo e
 * a correlação média entre eles. Mostra por que diversificar reduz o risco
 * até um piso que depende da correlação.
 */
export function portfolioRisk({
  assetRisk,
  assetCount,
  correlation,
}: {
  assetRisk: number;
  assetCount: number;
  correlation: number;
}) {
  const n = Math.max(1, Math.floor(assetCount));
  const rho = Math.min(1, Math.max(-1, correlation));
  return Math.max(0, assetRisk) * Math.sqrt(1 / n + rho * (1 - 1 / n));
}
