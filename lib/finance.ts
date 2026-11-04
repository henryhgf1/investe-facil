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
