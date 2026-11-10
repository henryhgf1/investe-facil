"use client";

import { Info } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectionChart, type ChartSeries } from "@/components/charts/projection-chart";
import { Slider } from "@/components/ui/slider";
import { HISTORY_END, HISTORY_START } from "@/content/history";
import { simulateHistory } from "@/lib/history";
import { cn, formatBRL, formatBRLPrecise, formatPercent } from "@/lib/utils";

const presets = [
  { label: "Desde 2000", start: 2000, end: 2024 },
  { label: "Últimos 20 anos", start: 2005, end: 2024 },
  { label: "Últimos 10 anos", start: 2015, end: 2024 },
  { label: "Últimos 5 anos", start: 2020, end: 2024 },
];

export function TimeMachine() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [startYear, setStartYear] = useState(HISTORY_START);
  const [endYear, setEndYear] = useState(HISTORY_END);
  const [real, setReal] = useState(false);

  const simulation = useMemo(
    () => simulateHistory({ initial, monthly, startYear, endYear }),
    [initial, monthly, startYear, endYear],
  );

  const last = simulation.points[simulation.points.length - 1];
  const invested = real ? last.investedReal : last.invested;
  const finalCdi = real ? last.cdiReal : last.cdi;
  const finalIbov = real ? last.ibovReal : last.ibov;
  const difference = Math.abs(finalCdi - finalIbov);
  const leader = finalCdi >= finalIbov ? "CDI" : "Ibovespa";
  const years = simulation.points.length;
  const equivalent = 100 * (1 + simulation.inflationAccumulated);

  const series: ChartSeries[] = real
    ? [
        {
          label: "CDI corrigido",
          color: "var(--chart-1)",
          values: simulation.points.map((point) => point.cdiReal),
          fill: true,
        },
        {
          label: "Ibovespa corrigido",
          color: "var(--chart-2)",
          values: simulation.points.map((point) => point.ibovReal),
        },
        {
          label: "Aportes corrigidos",
          color: "var(--chart-muted)",
          values: simulation.points.map((point) => point.investedReal),
        },
      ]
    : [
        {
          label: "CDI",
          color: "var(--chart-1)",
          values: simulation.points.map((point) => point.cdi),
          fill: true,
        },
        {
          label: "Ibovespa",
          color: "var(--chart-2)",
          values: simulation.points.map((point) => point.ibov),
        },
        {
          label: "Aportes",
          color: "var(--chart-muted)",
          values: simulation.points.map((point) => point.invested),
        },
      ];

  function changeStart(value: number) {
    setStartYear(value);
    if (value >= endYear) setEndYear(Math.min(HISTORY_END, value + 1));
  }

  function changeEnd(value: number) {
    setEndYear(value);
    if (value <= startYear) setStartYear(Math.max(HISTORY_START, value - 1));
  }

  return (
    <section
      aria-labelledby="simulador-historico"
      className="border-line bg-surface shadow-card my-10 rounded-3xl border p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Máquina do tempo
          </p>
          <h2 id="simulador-historico" className="font-display text-ink mt-1 text-xl font-bold">
            Quanto o tempo muda o resultado
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 rounded-full px-3 py-1 text-xs font-medium">
          2000 a 2024 · dados anuais
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Períodos predefinidos">
        {presets.map((preset) => {
          const active = startYear === preset.start && endYear === preset.end;

          return (
            <button
              key={preset.label}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setStartYear(preset.start);
                setEndYear(preset.end);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-brand-600 bg-primary text-on-primary"
                  : "border-line hover:border-brand-600/40 bg-surface text-body",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Slider
          label="Quanto você começa"
          value={initial}
          min={0}
          max={10_000}
          step={100}
          display={formatBRL(initial)}
          onChange={setInitial}
        />
        <Slider
          label="Aporte por mês"
          value={monthly}
          min={0}
          max={2_000}
          step={50}
          display={formatBRL(monthly)}
          onChange={setMonthly}
        />
        <Slider
          label="Ano inicial"
          value={startYear}
          min={HISTORY_START}
          max={HISTORY_END - 1}
          step={1}
          display={String(startYear)}
          onChange={changeStart}
        />
        <Slider
          label="Ano final"
          value={endYear}
          min={HISTORY_START + 1}
          max={HISTORY_END}
          step={1}
          display={String(endYear)}
          onChange={changeEnd}
        />
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted text-sm">
            Período:{" "}
            <strong className="text-ink font-semibold">
              {startYear} a {endYear}
            </strong>{" "}
            · {years} {years === 1 ? "ano" : "anos"}
          </p>

          <div
            className="border-line bg-surface inline-flex rounded-xl border p-1"
            role="group"
            aria-label="Ajuste dos valores"
          >
            {[
              { id: false, label: "Valores nominais" },
              { id: true, label: "Corrigidos pela inflação" },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={real === option.id}
                onClick={() => setReal(option.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  real === option.id ? "bg-primary text-on-primary" : "hover:text-ink text-body",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ProjectionChart
          ariaLabel={`Evolução de ${formatBRLPrecise(initial)} com ${formatBRLPrecise(monthly)} por mês entre ${startYear} e ${endYear}. ${real ? "Valores corrigidos pela inflação." : "Valores nominais."} O CDI termina em ${formatBRLPrecise(finalCdi)} e o Ibovespa em ${formatBRLPrecise(finalIbov)}.`}
          series={series}
          xLabels={simulation.points.map((point) => String(point.year))}
        />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-line bg-canvas rounded-xl border p-4">
          <dt className="text-muted text-xs">Total aportado</dt>
          <dd>
            <span className="font-display text-ink mt-1 block text-xl font-bold tabular-nums">
              {formatBRL(invested)}
            </span>
            <span className="text-muted mt-1 block text-xs font-normal">
              {real ? "em poder de compra de hoje" : `${formatBRL(monthly)} por mês`}
            </span>
          </dd>
        </div>

        <div className="border-brand-600/25 bg-brand-50 rounded-xl border p-4">
          <dt className="text-brand-800 text-xs">Saldo com CDI</dt>
          <dd>
            <span className="font-display text-brand-800 mt-1 block text-xl font-extrabold tabular-nums">
              {formatBRL(finalCdi)}
            </span>
            <span className="text-brand-700 mt-1 block text-xs font-normal">
              CDI acumulado: {formatPercent(simulation.cdiAccumulated * 100, 1)}
            </span>
          </dd>
        </div>

        <div className="border-accent/20 bg-accent-soft rounded-xl border p-4">
          <dt className="text-accent text-xs">Saldo com Ibovespa</dt>
          <dd>
            <span className="font-display text-accent mt-1 block text-xl font-extrabold tabular-nums">
              {formatBRL(finalIbov)}
            </span>
            <span className="text-accent mt-1 block text-xs font-normal">
              Ibovespa acumulado: {formatPercent(simulation.ibovAccumulated * 100, 1)}
            </span>
          </dd>
        </div>

        <div className="border-warn/25 bg-warn-soft rounded-xl border p-4">
          <dt className="text-warn text-xs">Inflação no período</dt>
          <dd>
            <span className="font-display text-warn mt-1 block text-xl font-extrabold tabular-nums">
              {formatPercent(simulation.inflationAccumulated * 100, 1)}
            </span>
            <span className="text-warn mt-1 block text-xs font-normal">
              R$ 100 de {startYear} valem {formatBRL(equivalent)} em {endYear}
            </span>
          </dd>
        </div>
      </dl>

      <p className="border-brand-600/20 bg-brand-50 text-brand-900 mt-4 rounded-xl border px-4 py-3 text-sm leading-6">
        <strong className="font-semibold">{leader} à frente:</strong> com os mesmos aportes,
        terminou {formatBRL(difference)} acima do outro índice no período, em{" "}
        {real ? "valores corrigidos pela inflação" : "valores nominais"}. O CDI é renda fixa e o
        Ibovespa é renda variável: a comparação mostra o custo e o prêmio de assumir risco, não uma
        recomendação.
      </p>

      <details className="border-line bg-surface mt-6 rounded-xl border">
        <summary className="text-ink cursor-pointer px-4 py-3 text-sm font-semibold">
          Ver ano a ano
        </summary>
        <div className="border-line overflow-x-auto border-t">
          <table className="w-full min-w-[420px] text-sm">
            <caption className="sr-only">
              Rentabilidade anual de CDI, Ibovespa e IPCA entre {startYear} e {endYear}
            </caption>
            <thead className="bg-canvas text-muted">
              <tr>
                <th scope="col" className="px-4 py-2 text-left font-semibold">
                  Ano
                </th>
                <th scope="col" className="px-4 py-2 text-right font-semibold">
                  CDI
                </th>
                <th scope="col" className="px-4 py-2 text-right font-semibold">
                  Ibovespa
                </th>
                <th scope="col" className="px-4 py-2 text-right font-semibold">
                  IPCA
                </th>
              </tr>
            </thead>
            <tbody>
              {simulation.years.map((item) => (
                <tr key={item.year} className="border-line border-t">
                  <th scope="row" className="text-ink px-4 py-2 text-left font-semibold">
                    {item.year}
                  </th>
                  <td
                    className={cn(
                      "px-4 py-2 text-right tabular-nums",
                      item.cdi >= 0 ? "text-brand-700" : "text-danger",
                    )}
                  >
                    {formatPercent(item.cdi, 1)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2 text-right tabular-nums",
                      item.ibov >= 0 ? "text-brand-700" : "text-danger",
                    )}
                  >
                    {formatPercent(item.ibov, 1)}
                  </td>
                  <td className="text-body px-4 py-2 text-right tabular-nums">
                    {formatPercent(item.ipca, 1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="border-warn/25 bg-warn-soft text-body mt-6 flex gap-3 rounded-2xl border p-4 text-sm leading-6">
        <Info className="text-warn mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <strong className="text-ink font-semibold">Como ler estes números:</strong> os dados são
          anuais e aproximados. O cálculo não desconta impostos, taxas de corretagem, custódia ou
          dividendos, e o Ibovespa mede a variação do índice em pontos, não o retorno de um fundo.
          Rentabilidade passada não garante resultado futuro.
        </p>
      </div>
    </section>
  );
}
