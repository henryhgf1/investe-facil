"use client";

import { useMemo, useState } from "react";

import { ProjectionChart } from "@/components/charts/projection-chart";
import { Slider } from "@/components/ui/slider";
import { projectMonthly } from "@/lib/finance";
import { formatBRL, formatBRLPrecise, formatPercent } from "@/lib/utils";

export function CompoundInterestSimulator() {
  const [monthly, setMonthly] = useState(200);
  const [monthlyRate, setMonthlyRate] = useState(0.8);
  const [years, setYears] = useState(10);

  const points = useMemo(
    () =>
      projectMonthly({
        monthly,
        monthlyRate: monthlyRate / 100,
        months: years * 12,
      }),
    [monthly, monthlyRate, years],
  );

  const last = points[points.length - 1];
  const invested = last.invested;
  const interest = last.balance - invested;

  return (
    <section
      aria-labelledby="simulador-juros-compostos"
      className="border-line bg-surface shadow-card my-10 rounded-3xl border p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Simulador
          </p>
          <h2
            id="simulador-juros-compostos"
            className="font-display text-ink mt-1 text-xl font-bold"
          >
            Veja o efeito bola de neve
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 rounded-full px-3 py-1 text-xs font-medium">
          dados ilustrativos
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-6">
          <Slider
            label="Aporte por mês"
            value={monthly}
            min={0}
            max={2000}
            step={50}
            display={formatBRL(monthly)}
            onChange={setMonthly}
          />
          <Slider
            label="Rendimento ao mês"
            value={monthlyRate}
            min={0.2}
            max={1.5}
            step={0.05}
            display={`${formatPercent(monthlyRate, 2)} a.m.`}
            onChange={setMonthlyRate}
          />
          <Slider
            label="Prazo"
            value={years}
            min={1}
            max={30}
            step={1}
            display={`${years} ${years === 1 ? "ano" : "anos"}`}
            onChange={setYears}
          />
        </div>

        <div>
          <ProjectionChart
            ariaLabel={`Projeção de ${formatBRL(monthly)} por mês a ${formatPercent(monthlyRate, 2)} ao mês durante ${years} anos, chegando a ${formatBRLPrecise(last.balance)}.`}
            series={[
              {
                label: "Seu dinheiro",
                color: "var(--chart-muted)",
                values: points.map((p) => p.invested),
              },
              {
                label: "Com juros",
                color: "var(--chart-1)",
                values: points.map((p) => p.balance),
                fill: true,
              },
            ]}
          />
        </div>
      </div>

      <dl className="border-line mt-6 grid gap-3 border-t pt-5 sm:grid-cols-3">
        <div>
          <dt className="text-muted text-xs font-medium tracking-wide uppercase">Você investiu</dt>
          <dd className="font-display text-ink mt-1 text-xl font-bold tabular-nums">
            {formatBRL(invested)}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium tracking-wide uppercase">Juros ganhos</dt>
          <dd className="font-display text-brand-700 mt-1 text-xl font-bold tabular-nums">
            {formatBRL(interest)}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium tracking-wide uppercase">Saldo final</dt>
          <dd className="font-display text-ink mt-1 text-xl font-bold tabular-nums">
            {formatBRLPrecise(last.balance)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
