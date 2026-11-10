"use client";

import { CalendarRange, Download, Info, RotateCcw, Save, ShieldCheck, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { ProjectionChart, type ChartSeries } from "@/components/charts/projection-chart";
import { Slider } from "@/components/ui/slider";
import { HISTORY_END, HISTORY_START } from "@/content/history";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import {
  ASSET_CLASSES,
  DEFAULT_ALLOCATION,
  PORTFOLIO_PRESETS,
  allocationPercentages,
  allocationTotal,
  simulatePortfolio,
  type Allocation,
  type AssetClassId,
} from "@/lib/portfolio";
import { cn, formatBRL, formatBRLPrecise, formatPercent } from "@/lib/utils";

const STORAGE_KEY = "investe-facil:carteira";

const periodPresets = [
  { label: "Desde 2000", start: 2000, end: 2024 },
  { label: "Últimos 20 anos", start: 2005, end: 2024 },
  { label: "Últimos 10 anos", start: 2015, end: 2024 },
  { label: "Últimos 5 anos", start: 2020, end: 2024 },
];

const riskLabels = { baixo: "risco baixo", medio: "risco médio", alto: "risco alto" } as const;

function toPercent(allocation: Allocation): Allocation {
  const percentages = {} as Allocation;

  for (const asset of ASSET_CLASSES) {
    percentages[asset.id] = Math.round(allocation[asset.id] * 100);
  }

  return percentages;
}

const defaultAllocationPercent = toPercent(DEFAULT_ALLOCATION);

const savedSchema = z.object({
  allocation: z.record(z.string(), z.number()).optional(),
  initial: z.number().min(0).max(1_000_000).optional(),
  monthly: z.number().min(0).max(100_000).optional(),
  startYear: z.number().int().optional(),
  endYear: z.number().int().optional(),
  presetId: z.string().optional(),
});

type BuilderState = {
  allocation: Allocation;
  presetId: string;
  initial: number;
  monthly: number;
  startYear: number;
  endYear: number;
};

function defaultBuilderState(): BuilderState {
  return {
    allocation: { ...defaultAllocationPercent },
    presetId: "equilibrada",
    initial: 1000,
    monthly: 300,
    startYear: 2015,
    endYear: 2024,
  };
}

function allocationFromSaved(record: Record<string, number> | undefined): Allocation {
  const allocation = { ...defaultAllocationPercent };

  for (const asset of ASSET_CLASSES) {
    const value = record?.[asset.id];
    if (typeof value === "number" && Number.isFinite(value)) {
      allocation[asset.id] = Math.min(100, Math.max(0, value));
    }
  }

  return allocation;
}

function loadSavedState(): BuilderState {
  const fallback = defaultBuilderState();

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = savedSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return fallback;

    return {
      allocation: allocationFromSaved(parsed.data.allocation),
      presetId: parsed.data.presetId ?? "personalizada",
      initial: parsed.data.initial ?? fallback.initial,
      monthly: parsed.data.monthly ?? fallback.monthly,
      startYear: parsed.data.startYear ?? fallback.startYear,
      endYear: parsed.data.endYear ?? fallback.endYear,
    };
  } catch {
    return fallback;
  }
}

function signedBRL(value: number) {
  if (Math.abs(value) < 0.5) return formatBRL(0);
  return `${value > 0 ? "+" : "-"}${formatBRL(Math.abs(value))}`;
}

function relation(value: number) {
  return value >= 0 ? "acima" : "abaixo";
}

function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "brand" | "accent" | "warn";
}) {
  const tones = {
    neutral: "border-line bg-surface",
    brand: "border-brand-600/25 bg-brand-50",
    accent: "border-accent/20 bg-accent-soft",
    warn: "border-warn/25 bg-warn-soft",
  };

  return (
    <div className={cn("rounded-xl border p-4", tones[tone])}>
      <dt className="text-muted text-xs">{label}</dt>
      <dd>
        <span className="font-display text-ink mt-1 block text-xl font-extrabold tabular-nums">
          {value}
        </span>
        <span className="text-muted mt-1 block text-xs leading-5">{hint}</span>
      </dd>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <section
      aria-labelledby="simulador-carteira"
      aria-busy="true"
      className="border-line bg-surface shadow-card mt-10 min-h-[640px] rounded-3xl border p-6 sm:p-8"
    >
      <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
        Monte a sua carteira
      </p>
      <h2 id="simulador-carteira" className="font-display text-ink mt-1 text-xl font-bold">
        Quanto cada classe muda o resultado
      </h2>
      <p className="text-muted mt-4 text-sm" role="status">
        Carregando sua carteira salva neste navegador.
      </p>
    </section>
  );
}

export function PortfolioBuilder() {
  const hydrated = useHydrated();

  if (!hydrated) return <PortfolioSkeleton />;

  return <PortfolioBuilderClient />;
}

function PortfolioBuilderClient() {
  const [state, setState] = useState<BuilderState>(loadSavedState);
  const [real, setReal] = useState(false);

  const { allocation, presetId, initial, monthly, startYear, endYear } = state;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const simulation = useMemo(
    () => simulatePortfolio({ allocation, initial, monthly, startYear, endYear }),
    [allocation, initial, monthly, startYear, endYear],
  );

  const percentages = allocationPercentages(allocation);
  const totalPercent = allocationTotal(allocation) * 100;
  const emptyAllocation = totalPercent <= 0;
  const last = simulation.points[simulation.points.length - 1];
  const invested = real ? last.investedReal : last.invested;
  const finalPortfolio = real ? last.portfolioReal : last.portfolio;
  const finalCdi = real ? last.cdiReal : last.cdi;
  const finalIbov = real ? last.ibovReal : last.ibov;
  const gain = real ? simulation.realGain : simulation.gain;
  const preset = PORTFOLIO_PRESETS.find((item) => item.id === presetId);
  const presetLabel = preset?.label ?? "personalizada";

  const series: ChartSeries[] = [
    {
      label: real ? "Carteira corrigida" : "Carteira",
      color: "var(--chart-1)",
      values: simulation.points.map((point) => (real ? point.portfolioReal : point.portfolio)),
      fill: true,
    },
    {
      label: real ? "CDI corrigido" : "CDI",
      color: "var(--chart-6)",
      values: simulation.points.map((point) => (real ? point.cdiReal : point.cdi)),
    },
    {
      label: real ? "Ibovespa corrigido" : "Ibovespa",
      color: "var(--chart-2)",
      values: simulation.points.map((point) => (real ? point.ibovReal : point.ibov)),
    },
    {
      label: real ? "Aportes corrigidos" : "Aportes",
      color: "var(--chart-muted)",
      values: simulation.points.map((point) => (real ? point.investedReal : point.invested)),
    },
  ];

  function update(patch: Partial<BuilderState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function updateAllocation(id: AssetClassId, value: number) {
    setState((current) => ({
      ...current,
      allocation: { ...current.allocation, [id]: value },
      presetId: "personalizada",
    }));
  }

  function applyPreset(id: string) {
    const selected = PORTFOLIO_PRESETS.find((item) => item.id === id);
    if (!selected) return;

    update({ allocation: toPercent(selected.allocation), presetId: selected.id });
  }

  function changeStart(value: number) {
    setState((current) => ({
      ...current,
      startYear: value,
      endYear: value >= current.endYear ? Math.min(HISTORY_END, value + 1) : current.endYear,
    }));
  }

  function changeEnd(value: number) {
    setState((current) => ({
      ...current,
      endYear: value,
      startYear:
        value <= current.startYear ? Math.max(HISTORY_START, value - 1) : current.startYear,
    }));
  }

  function reset() {
    setState(defaultBuilderState());
    setReal(false);
  }

  function downloadCsv() {
    const header = [
      "Ano",
      "Aportado",
      "Carteira",
      "CDI",
      "Ibovespa",
      "Carteira corrigida",
      "CDI corrigido",
      "Ibovespa corrigido",
      "Retorno da carteira (%)",
      "CDI (%)",
      "Ibovespa (%)",
    ];

    const rows = simulation.points.map((point) => [
      point.year,
      point.invested,
      point.portfolio,
      point.cdi,
      point.ibov,
      point.portfolioReal,
      point.cdiReal,
      point.ibovReal,
      point.portfolioReturn * 100,
      point.cdiReturn * 100,
      point.ibovReturn * 100,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            if (typeof cell !== "number") return cell;
            if (Number.isInteger(cell)) return String(cell);
            return cell.toFixed(2).replace(".", ",");
          })
          .join(";"),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `carteira-${startYear}-${endYear}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section
        aria-labelledby="simulador-carteira"
        className="border-line bg-surface shadow-card mt-10 rounded-3xl border p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
              Monte a sua carteira
            </p>
            <h2 id="simulador-carteira" className="font-display text-ink mt-1 text-xl font-bold">
              Quanto cada classe muda o resultado
            </h2>
          </div>
          <span className="bg-brand-50 text-brand-800 rounded-full px-3 py-1 text-xs font-medium">
            {startYear} a {endYear} · dados anuais
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Perfis de carteira">
          {PORTFOLIO_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={presetId === item.id}
              onClick={() => applyPreset(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                presetId === item.id
                  ? "border-brand-600 bg-primary text-on-primary"
                  : "border-line hover:border-brand-600/40 bg-surface text-body",
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="border-line hover:text-ink bg-surface text-body ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Restaurar padrão
          </button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <h3 className="text-ink text-sm font-semibold">Distribuição por classe</h3>
            <p className="text-muted mt-1 text-xs leading-5">
              Ajuste os pesos como quiser. O cálculo normaliza tudo para 100%.
            </p>

            <div className="mt-4 space-y-4">
              {ASSET_CLASSES.map((asset) => (
                <Slider
                  key={asset.id}
                  label={asset.label}
                  value={allocation[asset.id]}
                  min={0}
                  max={100}
                  step={5}
                  display={`${allocation[asset.id]}%`}
                  hint={`${asset.description} (${riskLabels[asset.risk]})`}
                  onChange={(value) => updateAllocation(asset.id, value)}
                />
              ))}
            </div>

            <p
              className={cn(
                "mt-4 text-xs font-medium",
                emptyAllocation || Math.abs(totalPercent - 100) >= 0.5 ? "text-warn" : "text-muted",
              )}
            >
              Total informado: {formatPercent(totalPercent, 0)}.{" "}
              {emptyAllocation
                ? "Sem pesos, usamos a carteira equilibrada."
                : Math.abs(totalPercent - 100) >= 0.5
                  ? "O cálculo ajusta proporcionalmente para 100%."
                  : "Carteira pronta para simular."}
            </p>

            <div className="bg-surface-2 mt-3 flex h-3 overflow-hidden rounded-full">
              {ASSET_CLASSES.map((asset) => (
                <span
                  key={asset.id}
                  style={{
                    width: `${percentages[asset.id]}%`,
                    backgroundColor: asset.color,
                  }}
                />
              ))}
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {ASSET_CLASSES.map((asset) => (
                <li key={asset.id} className="flex items-center gap-2 text-xs">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-body">{asset.shortLabel}</span>
                  <span className="text-ink ml-auto font-semibold tabular-nums">
                    {formatPercent(percentages[asset.id], 0)}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="text-ink mt-8 text-sm font-semibold">Aportes e período</h3>
            <div className="mt-4 space-y-5">
              <Slider
                label="Quanto você começa"
                value={initial}
                min={0}
                max={50_000}
                step={500}
                display={formatBRL(initial)}
                onChange={(value) => update({ initial: value })}
              />
              <Slider
                label="Aporte por mês"
                value={monthly}
                min={0}
                max={5_000}
                step={100}
                display={formatBRL(monthly)}
                onChange={(value) => update({ monthly: value })}
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

            <div
              className="mt-4 flex flex-wrap gap-2"
              role="group"
              aria-label="Períodos predefinidos"
            >
              {periodPresets.map((item) => {
                const active = startYear === item.start && endYear === item.end;

                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ startYear: item.start, endYear: item.end })}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-brand-600 bg-primary text-on-primary"
                        : "border-line hover:border-brand-600/40 bg-surface text-body",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="text-muted mt-4 flex items-start gap-1.5 text-xs leading-5">
              <Save className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Sua carteira fica salva neste navegador. Nada é enviado para um servidor.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted text-sm">
                Período:{" "}
                <strong className="text-ink font-semibold">
                  {startYear} a {endYear}
                </strong>{" "}
                · {simulation.points.length} {simulation.points.length === 1 ? "ano" : "anos"}
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
                      real === option.id
                        ? "bg-primary text-on-primary"
                        : "hover:text-ink text-body",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <ProjectionChart
              ariaLabel={`Evolução de uma carteira ${presetLabel} com ${formatBRLPrecise(initial)} iniciais e ${formatBRLPrecise(monthly)} por mês entre ${startYear} e ${endYear}. ${real ? "Valores corrigidos pela inflação." : "Valores nominais."} A carteira termina em ${formatBRLPrecise(finalPortfolio)}, o CDI em ${formatBRLPrecise(finalCdi)} e o Ibovespa em ${formatBRLPrecise(finalIbov)}.`}
              series={series}
              xLabels={simulation.points.map((point) => String(point.year))}
            />

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Total aportado"
                value={formatBRL(invested)}
                hint={real ? "em poder de compra de hoje" : `${formatBRL(monthly)} por mês`}
              />
              <StatCard
                label="Saldo da carteira"
                value={formatBRL(finalPortfolio)}
                hint={
                  real
                    ? `${formatPercent(simulation.inflationAccumulated * 100, 1)} de inflação no período`
                    : `${formatBRLPrecise(simulation.realPortfolio)} em poder de compra`
                }
                tone="brand"
              />
              <StatCard
                label="Ganho no período"
                value={formatBRL(gain)}
                hint={`${formatPercent(simulation.annualizedPortfolio * 100, 1)} ao ano, em média`}
              />
              <StatCard
                label="Queda máxima"
                value={formatPercent(simulation.maxDrawdown * 100, 1)}
                hint="maior recuo do índice da carteira"
                tone="warn"
              />
            </dl>

            <div className="border-line bg-canvas text-body mt-4 rounded-xl border p-4 text-sm leading-6">
              <p>
                <strong className="text-ink font-semibold">Carteira contra as réguas:</strong>{" "}
                terminou {signedBRL(simulation.differenceVsCdi)}{" "}
                {relation(simulation.differenceVsCdi)} do CDI e{" "}
                {signedBRL(simulation.differenceVsIbov)} {relation(simulation.differenceVsIbov)} do
                Ibovespa, com os mesmos aportes.
              </p>
              <p className="text-muted mt-2 text-xs leading-5">
                A comparação mostra o custo e o prêmio de assumir risco. Não é recomendação de
                investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="relatorio-evolucao"
        className="border-line bg-surface shadow-card mt-8 rounded-3xl border p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
              Relatório de evolução
            </p>
            <h2 id="relatorio-evolucao" className="font-display text-ink mt-1 text-xl font-bold">
              O que aconteceu ano a ano
            </h2>
          </div>
          <button
            type="button"
            onClick={downloadCsv}
            className="border-brand-600/25 bg-brand-50 text-brand-800 hover:bg-brand-100 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Baixar CSV
          </button>
        </div>

        <p className="text-muted mt-4 max-w-3xl text-sm leading-6">
          Com {formatBRL(initial)} iniciais e {formatBRL(monthly)} por mês entre {startYear} e{" "}
          {endYear}, a carteira {presetLabel} terminaria em{" "}
          <strong className="text-ink font-semibold">
            {formatBRLPrecise(simulation.finalPortfolio)}
          </strong>{" "}
          ({formatBRLPrecise(simulation.realPortfolio)} em poder de compra), contra{" "}
          {formatBRLPrecise(simulation.finalCdi)} no CDI e {formatBRLPrecise(simulation.finalIbov)}{" "}
          no Ibovespa. O retorno médio foi de{" "}
          {formatPercent(simulation.annualizedPortfolio * 100, 1)} ao ano, com queda máxima de{" "}
          {formatPercent(simulation.maxDrawdown * 100, 1)}.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="border-line rounded-xl border p-4">
            <p className="text-muted text-xs">Melhor ano</p>
            <p className="text-ink mt-1 text-sm font-semibold">
              {simulation.bestYear.year} ·{" "}
              {formatPercent(simulation.bestYear.portfolioReturn * 100, 1)}
            </p>
          </div>
          <div className="border-line rounded-xl border p-4">
            <p className="text-muted text-xs">Pior ano</p>
            <p className="text-ink mt-1 text-sm font-semibold">
              {simulation.worstYear.year} ·{" "}
              {formatPercent(simulation.worstYear.portfolioReturn * 100, 1)}
            </p>
          </div>
          <div className="border-line rounded-xl border p-4">
            <p className="text-muted text-xs">Inflação no período</p>
            <p className="text-ink mt-1 text-sm font-semibold">
              {formatPercent(simulation.inflationAccumulated * 100, 1)}
            </p>
          </div>
        </div>

        <details className="border-line bg-surface mt-5 rounded-xl border">
          <summary className="text-ink cursor-pointer px-4 py-3 text-sm font-semibold">
            Ver a evolução ano a ano
          </summary>
          <div className="border-line overflow-x-auto border-t">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">
                Evolução anual da carteira, do CDI e do Ibovespa entre {startYear} e {endYear}
              </caption>
              <thead className="bg-canvas text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left font-semibold">
                    Ano
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    Aportado
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    Carteira
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    CDI
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    Ibovespa
                  </th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">
                    Carteira corrigida
                  </th>
                </tr>
              </thead>
              <tbody>
                {simulation.points.map((point) => (
                  <tr key={point.year} className="border-line border-t">
                    <th scope="row" className="text-ink px-4 py-2 text-left font-semibold">
                      {point.year}
                    </th>
                    <td className="text-body px-4 py-2 text-right tabular-nums">
                      {formatBRL(point.invested)}
                    </td>
                    <td className="text-brand-700 px-4 py-2 text-right font-semibold tabular-nums">
                      {formatBRL(point.portfolio)}
                    </td>
                    <td className="text-body px-4 py-2 text-right tabular-nums">
                      {formatBRL(point.cdi)}
                    </td>
                    <td className="text-accent px-4 py-2 text-right tabular-nums">
                      {formatBRL(point.ibov)}
                    </td>
                    <td className="text-body px-4 py-2 text-right tabular-nums">
                      {formatBRL(point.portfolioReal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <div className="border-warn/25 bg-warn-soft text-body mt-6 flex gap-3 rounded-2xl border p-4 text-sm leading-6">
        <Info className="text-warn mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p>
            <strong className="text-ink font-semibold">Como a conta é feita:</strong> cada classe
            usa uma proxy histórica. Caixa e renda fixa seguem o CDI; ações seguem o Ibovespa; FIIs
            usam 70% CDI e 30% Ibovespa; internacional usa 30% CDI e 70% Ibovespa. Os pesos são
            rebalanceados todo mês, sem impostos, taxas ou dividendos.
          </p>
          <p className="text-muted mt-2 text-xs leading-5">
            Dados anuais aproximados de 2000 a 2024. Rentabilidade passada não garante resultado
            futuro.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="border-line bg-surface flex items-start gap-3 rounded-xl border p-4">
          <Wallet className="text-brand-700 mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="text-muted text-xs leading-5">
            <strong className="text-ink block font-semibold">Diversificar é distribuir</strong>{" "}
            Nenhuma classe precisa ganhar sozinha. O objetivo é reduzir a dependência de uma única
            aposta.
          </p>
        </div>
        <div className="border-line bg-surface flex items-start gap-3 rounded-xl border p-4">
          <ShieldCheck className="text-brand-700 mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="text-muted text-xs leading-5">
            <strong className="text-ink block font-semibold">Risco aparece na queda</strong> A queda
            máxima mostra o tamanho do susto. Uma carteira só é confortável se você aguenta
            segurá-la no pior momento.
          </p>
        </div>
        <div className="border-line bg-surface flex items-start gap-3 rounded-xl border p-4">
          <CalendarRange className="text-brand-700 mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="text-muted text-xs leading-5">
            <strong className="text-ink block font-semibold">Tempo faz o trabalho</strong> Aportes
            regulares e prazos longos suavizam os anos ruins e deixam os juros compostos agirem.
          </p>
        </div>
      </div>
    </>
  );
}
