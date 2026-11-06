export type HistoryYear = {
  year: number;
  /** Retorno anual do CDI em percentual (17.3 = 17,3% ao ano). */
  cdi: number;
  /** Variação anual do Ibovespa em pontos, sem dividendos. */
  ibov: number;
  /** IPCA acumulado no ano, em percentual. */
  ipca: number;
};

/**
 * Série anual de 2000 a 2024. Os valores são arredondados e servem para
 * ilustrar o efeito do tempo, não para reproduzir um investimento real.
 */
export const history: HistoryYear[] = [
  { year: 2000, cdi: 17.3, ibov: -9.5, ipca: 6.0 },
  { year: 2001, cdi: 19.0, ibov: -11.0, ipca: 7.7 },
  { year: 2002, cdi: 19.1, ibov: -17.0, ipca: 12.5 },
  { year: 2003, cdi: 23.3, ibov: 22.2, ipca: 9.3 },
  { year: 2004, cdi: 16.2, ibov: 17.8, ipca: 7.6 },
  { year: 2005, cdi: 19.1, ibov: 27.7, ipca: 5.7 },
  { year: 2006, cdi: 15.1, ibov: 32.9, ipca: 3.1 },
  { year: 2007, cdi: 11.5, ibov: 43.7, ipca: 4.5 },
  { year: 2008, cdi: 12.4, ibov: -41.2, ipca: 5.9 },
  { year: 2009, cdi: 9.9, ibov: 82.7, ipca: 4.3 },
  { year: 2010, cdi: 9.8, ibov: 1.0, ipca: 5.9 },
  { year: 2011, cdi: 11.6, ibov: -18.1, ipca: 6.5 },
  { year: 2012, cdi: 8.5, ibov: 7.4, ipca: 5.8 },
  { year: 2013, cdi: 8.2, ibov: -15.5, ipca: 5.9 },
  { year: 2014, cdi: 10.8, ibov: -2.9, ipca: 6.4 },
  { year: 2015, cdi: 13.2, ibov: -13.3, ipca: 10.7 },
  { year: 2016, cdi: 14.0, ibov: 38.9, ipca: 6.3 },
  { year: 2017, cdi: 9.9, ibov: 26.9, ipca: 3.0 },
  { year: 2018, cdi: 6.4, ibov: 15.0, ipca: 3.8 },
  { year: 2019, cdi: 6.0, ibov: 31.6, ipca: 4.3 },
  { year: 2020, cdi: 2.8, ibov: 2.9, ipca: 4.5 },
  { year: 2021, cdi: 4.4, ibov: -11.9, ipca: 10.1 },
  { year: 2022, cdi: 12.4, ibov: 4.7, ipca: 5.8 },
  { year: 2023, cdi: 13.0, ibov: 22.3, ipca: 4.6 },
  { year: 2024, cdi: 10.9, ibov: -10.4, ipca: 4.8 },
];

export const HISTORY_START = history[0].year;
export const HISTORY_END = history[history.length - 1].year;

export const historySource = {
  cdi: "Banco Central do Brasil, série SGS 12 (CDI acumulado no ano).",
  ibov: "B3, variação anual do Ibovespa em pontos, sem dividendos.",
  ipca: "IBGE, IPCA acumulado no ano.",
  note: "Valores arredondados para uma casa decimal. As séries não incluem impostos, taxas de corretagem, custódia ou dividendos.",
};

export function historyForRange(startYear: number, endYear: number) {
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);

  return history.filter((item) => item.year >= from && item.year <= to);
}
