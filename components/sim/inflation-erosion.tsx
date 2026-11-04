"use client";

import { useMemo, useState } from "react";

import { ProjectionChart } from "@/components/charts/projection-chart";
import { Slider } from "@/components/ui/slider";
import { purchasingPowerSeries } from "@/lib/finance";
import { formatBRLPrecise, formatPercent } from "@/lib/utils";

const INITIAL = 1000;

export function InflationErosion() {
  const [inflation, setInflation] = useState(5);
  const [years, setYears] = useState(10);

  const points = useMemo(
    () => purchasingPowerSeries({ initial: INITIAL, annualInflation: inflation / 100, years }),
    [inflation, years],
  );

  const last = points[points.length - 1];
  const loss = 1 - last.real / INITIAL;

  return (
    <section
      aria-labelledby="simulador-inflacao"
      className="border-line my-10 rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-warn text-xs font-semibold tracking-widest uppercase">Simulador</p>
          <h2 id="simulador-inflacao" className="font-display text-ink mt-1 text-xl font-bold">
            R$ 1.000 parados no tempo
          </h2>
        </div>
        <span className="bg-warn-soft text-warn rounded-full px-3 py-1 text-xs font-medium">
          dados ilustrativos
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-6">
          <Slider
            label="Inflação ao ano"
            value={inflation}
            min={2}
            max={12}
            step={0.5}
            display={`${formatPercent(inflation, 1)} a.a.`}
            onChange={setInflation}
          />
          <Slider
            label="Tempo parado"
            value={years}
            min={1}
            max={30}
            step={1}
            display={`${years} ${years === 1 ? "ano" : "anos"}`}
            onChange={setYears}
          />
          <p className="bg-canvas text-muted rounded-xl p-4 text-sm leading-6">
            O valor na conta continua {formatBRLPrecise(INITIAL)}. O que muda é o que ele consegue
            comprar.
          </p>
        </div>

        <div>
          <ProjectionChart
            ariaLabel={`Com inflação de ${formatPercent(inflation, 1)} ao ano, R$ 1.000 parados passam a valer ${formatBRLPrecise(last.real)} em poder de compra após ${years} anos.`}
            series={[
              { label: "Valor na conta", color: "#94a3b8", values: points.map((p) => p.nominal) },
              {
                label: "Poder de compra",
                color: "#b45309",
                values: points.map((p) => p.real),
                fill: true,
              },
            ]}
          />
        </div>
      </div>

      <div className="border-line mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-5">
        <span className="text-muted text-sm">Perda de poder de compra:</span>
        <span className="font-display text-warn text-xl font-bold tabular-nums">
          {formatPercent(loss * 100, 1)}
        </span>
        <span className="text-muted text-sm">
          — sobram {formatBRLPrecise(last.real)} de valor real.
        </span>
      </div>
    </section>
  );
}
