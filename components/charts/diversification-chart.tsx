"use client";

import { useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { portfolioRisk } from "@/lib/finance";
import { formatPercent } from "@/lib/utils";

const WIDTH = 640;
const HEIGHT = 300;
const PADDING = { top: 24, right: 24, bottom: 42, left: 54 };
const MAX_ASSETS = 30;

export function DiversificationChart() {
  const [assetCount, setAssetCount] = useState(4);
  const [correlation, setCorrelation] = useState(40);
  const [assetRisk, setAssetRisk] = useState(25);

  const rho = correlation / 100;
  const risk = assetRisk / 100;

  const curve = useMemo(
    () =>
      Array.from({ length: MAX_ASSETS }, (_, index) => {
        const count = index + 1;
        return {
          count,
          value: portfolioRisk({ assetRisk: risk, assetCount: count, correlation: rho }),
        };
      }),
    [rho, risk],
  );

  const current = curve[assetCount - 1];
  const single = curve[0];
  const floor = risk * Math.sqrt(Math.max(0, rho));
  const reduction = single.value > 0 ? 1 - current.value / single.value : 0;

  const yMax = Math.max(risk * 1.08, 0.0001);
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const xFor = (count: number) => PADDING.left + ((count - 1) / (MAX_ASSETS - 1)) * innerWidth;
  const yFor = (value: number) =>
    PADDING.top + innerHeight - (Math.min(value, yMax) / yMax) * innerHeight;

  const linePath = curve
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(point.count)} ${yFor(point.value)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xFor(MAX_ASSETS)} ${yFor(0)} L ${xFor(1)} ${yFor(0)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = [1, 5, 10, 20, 30];

  return (
    <section
      aria-labelledby="simulador-diversificacao"
      className="border-line my-10 rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Simulador
          </p>
          <h2
            id="simulador-diversificacao"
            className="font-display text-ink mt-1 text-xl font-bold"
          >
            O risco que a diversificação remove
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 rounded-full px-3 py-1 text-xs font-medium">
          modelo didático, não uma previsão
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="space-y-5">
          <Slider
            label="Ativos na carteira"
            value={assetCount}
            min={1}
            max={MAX_ASSETS}
            step={1}
            display={`${assetCount} ${assetCount === 1 ? "ativo" : "ativos"}`}
            onChange={setAssetCount}
          />
          <Slider
            label="Correlação média entre eles"
            value={correlation}
            min={0}
            max={100}
            step={5}
            display={formatPercent(correlation, 0)}
            onChange={setCorrelation}
            hint="0% = ativos independentes · 100% = todos se movem juntos"
          />
          <Slider
            label="Risco de cada ativo"
            value={assetRisk}
            min={5}
            max={50}
            step={1}
            display={`${formatPercent(assetRisk, 0)} ao ano`}
            onChange={setAssetRisk}
          />
        </div>

        <div>
          <figure>
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              role="img"
              aria-label={`Com ${assetCount} ativos e correlação de ${correlation}%, o risco da carteira cai de ${formatPercent(single.value * 100, 1)} para ${formatPercent(current.value * 100, 1)} ao ano, uma redução de ${formatPercent(reduction * 100, 0)}.`}
              className="h-auto w-full overflow-visible"
            >
              <defs>
                <linearGradient id="diversification-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f6b4f" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0f6b4f" stopOpacity="0" />
                </linearGradient>
              </defs>

              {yTicks.map((tick) => (
                <g key={`y-${tick}`}>
                  <line
                    x1={PADDING.left}
                    x2={WIDTH - PADDING.right}
                    y1={yFor(risk * tick)}
                    y2={yFor(risk * tick)}
                    stroke="currentColor"
                    className="text-line"
                    strokeDasharray={tick === 0 ? undefined : "4 6"}
                  />
                  <text
                    x={PADDING.left - 10}
                    y={yFor(risk * tick) + 4}
                    textAnchor="end"
                    className="fill-muted text-[11px]"
                  >
                    {formatPercent(assetRisk * tick, 0)}
                  </text>
                </g>
              ))}

              {xTicks.map((tick) => (
                <text
                  key={`x-${tick}`}
                  x={xFor(tick)}
                  y={HEIGHT - PADDING.bottom + 18}
                  textAnchor="middle"
                  className="fill-muted text-[11px]"
                >
                  {tick}
                </text>
              ))}
              <text
                x={PADDING.left + innerWidth / 2}
                y={HEIGHT - 6}
                textAnchor="middle"
                className="fill-muted text-[11px] font-medium"
              >
                número de ativos
              </text>

              <path d={areaPath} fill="url(#diversification-fill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#0f6b4f"
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={yFor(floor)}
                y2={yFor(floor)}
                stroke="#b45309"
                strokeWidth={1.5}
                strokeDasharray="6 5"
              />
              <text
                x={WIDTH - PADDING.right}
                y={yFor(floor) - 6}
                textAnchor="end"
                className="fill-warn text-[10px] font-medium"
              >
                piso da correlação: {formatPercent(floor * 100, 1)}
              </text>

              <line
                x1={xFor(assetCount)}
                x2={xFor(assetCount)}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="#1d4ed8"
                strokeDasharray="3 4"
                opacity={0.5}
              />
              <circle
                cx={xFor(assetCount)}
                cy={yFor(current.value)}
                r={7}
                fill="#1d4ed8"
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={xFor(assetCount)}
                y={yFor(current.value) - 14}
                textAnchor="middle"
                className="fill-accent text-[11px] font-semibold"
              >
                {formatPercent(current.value * 100, 1)}
              </text>
            </svg>
            <figcaption className="text-muted mt-2 text-xs leading-5">
              A curva cai rápido nas primeiras posições e depois achata. Passar de 1 para 5 ativos
              reduz muito mais risco do que passar de 20 para 30.
            </figcaption>
          </figure>

          <dl className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Risco com 1 ativo</dt>
              <dd className="font-display text-ink mt-0.5 text-lg font-bold tabular-nums">
                {formatPercent(single.value * 100, 1)}
              </dd>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Risco com {assetCount}</dt>
              <dd className="font-display text-brand-700 mt-0.5 text-lg font-bold tabular-nums">
                {formatPercent(current.value * 100, 1)}
              </dd>
            </div>
            <div className="border-brand-600/25 bg-brand-50 rounded-xl border p-3">
              <dt className="text-brand-800 text-xs">Risco removido</dt>
              <dd className="font-display text-brand-800 mt-0.5 text-lg font-extrabold tabular-nums">
                {formatPercent(reduction * 100, 0)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
