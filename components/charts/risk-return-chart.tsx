"use client";

import { useState } from "react";

import { cn, formatPercent } from "@/lib/utils";

export type RiskAsset = {
  id: string;
  name: string;
  /** Risco percebido de 0 a 100 (volatilidade e incerteza). */
  risk: number;
  /** Retorno esperado em % ao ano. Ilustrativo. */
  returnPct: number;
  color: string;
  description: string;
};

const WIDTH = 640;
const HEIGHT = 380;
const PADDING = { top: 24, right: 28, bottom: 46, left: 58 };
const Y_MAX = 25;

export const RISK_RETURN_ASSETS: RiskAsset[] = [
  {
    id: "poupanca",
    name: "Poupança",
    risk: 3,
    returnPct: 6.2,
    color: "#94a3b8",
    description:
      "Risco baixíssimo e retorno baixo. Serve para guardar o que você precisa amanhã, não para construir patrimônio no longo prazo.",
  },
  {
    id: "tesouro-selic",
    name: "Tesouro Selic",
    risk: 6,
    returnPct: 11,
    color: "#0f6b4f",
    description:
      "Você empresta ao governo federal. O risco de crédito é muito baixo e a liquidez é diária, mas o retorno acompanha a Selic e cai quando ela cai.",
  },
  {
    id: "cdb",
    name: "CDB",
    risk: 9,
    returnPct: 12,
    color: "#0b5740",
    description:
      "Empréstimo a um banco, com proteção do FGC até R$ 250 mil por CPF e instituição. Paga Imposto de Renda e costuma exigir prazo.",
  },
  {
    id: "tesouro-ipca",
    name: "Tesouro IPCA+",
    risk: 14,
    returnPct: 11.5,
    color: "#1d4ed8",
    description:
      "Garante inflação mais uma taxa fixa se você levar até o vencimento. Se vender antes, o preço do título oscila, e pode cair.",
  },
  {
    id: "fii",
    name: "FII",
    risk: 35,
    returnPct: 10,
    color: "#b45309",
    description:
      "Imóveis negociados em bolsa. Distribuem renda mensal, mas a cota oscila com juros, vacância e humor do mercado.",
  },
  {
    id: "acoes",
    name: "Ações",
    risk: 55,
    returnPct: 13,
    color: "#7c3aed",
    description:
      "Você vira sócio de empresas. O retorno esperado é maior no longo prazo, mas o caminho inclui quedas de 30% ou mais sem aviso.",
  },
  {
    id: "cripto",
    name: "Cripto",
    risk: 90,
    returnPct: 22,
    color: "#dc2626",
    description:
      "Alta volatilidade, regulação ainda em evolução e risco de perda total. Só entra com dinheiro que você aceita perder por inteiro.",
  },
];

export function RiskReturnChart({ assets = RISK_RETURN_ASSETS }: { assets?: RiskAsset[] }) {
  const [selectedId, setSelectedId] = useState(assets[0]?.id ?? "");
  const selected = assets.find((asset) => asset.id === selectedId) ?? assets[0];

  if (!selected) return null;

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const xFor = (risk: number) => PADDING.left + (risk / 100) * innerWidth;
  const yFor = (returnPct: number) =>
    PADDING.top + innerHeight - (Math.min(returnPct, Y_MAX) / Y_MAX) * innerHeight;

  const xTicks = [0, 25, 50, 75, 100];
  const yTicks = [0, 5, 10, 15, 20, 25];

  return (
    <section
      aria-labelledby="simulador-risco-retorno"
      className="border-line my-10 rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Simulador
          </p>
          <h2 id="simulador-risco-retorno" className="font-display text-ink mt-1 text-xl font-bold">
            Onde cada investimento se posiciona
          </h2>
        </div>
        <span className="bg-warn-soft text-warn rounded-full px-3 py-1 text-xs font-medium">
          posições ilustrativas
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <figure>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Gráfico de dispersão com risco no eixo horizontal e retorno esperado no eixo vertical. Poupança e Tesouro Selic ficam no canto inferior esquerdo; ações e cripto no canto superior direito."
            className="h-auto w-full overflow-visible"
          >
            {yTicks.map((tick) => (
              <g key={`y-${tick}`}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={yFor(tick)}
                  y2={yFor(tick)}
                  stroke="currentColor"
                  className="text-line"
                  strokeDasharray={tick === 0 ? undefined : "4 6"}
                />
                <text
                  x={PADDING.left - 10}
                  y={yFor(tick) + 4}
                  textAnchor="end"
                  className="fill-muted text-[11px]"
                >
                  {tick}%
                </text>
              </g>
            ))}

            {xTicks.map((tick) => (
              <g key={`x-${tick}`}>
                <line
                  x1={xFor(tick)}
                  x2={xFor(tick)}
                  y1={PADDING.top}
                  y2={HEIGHT - PADDING.bottom}
                  stroke="currentColor"
                  className="text-line/60"
                  strokeDasharray="4 6"
                />
                <text
                  x={xFor(tick)}
                  y={HEIGHT - PADDING.bottom + 20}
                  textAnchor="middle"
                  className="fill-muted text-[11px]"
                >
                  {tick}
                </text>
              </g>
            ))}

            <text
              x={PADDING.left + innerWidth / 2}
              y={HEIGHT - 6}
              textAnchor="middle"
              className="fill-muted text-[11px] font-medium"
            >
              risco (0 = nenhum, 100 = máximo)
            </text>
            <text
              x={14}
              y={PADDING.top + innerHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${PADDING.top + innerHeight / 2})`}
              className="fill-muted text-[11px] font-medium"
            >
              retorno esperado ao ano
            </text>

            {assets.map((asset) => {
              const isSelected = asset.id === selected.id;
              return (
                <g
                  key={asset.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${asset.name}: risco ${asset.risk} de 100, retorno esperado de ${formatPercent(asset.returnPct, 1)} ao ano`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(asset.id)}
                  onFocus={() => setSelectedId(asset.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(asset.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <circle
                    cx={xFor(asset.risk)}
                    cy={yFor(asset.returnPct)}
                    r={18}
                    fill="transparent"
                  />
                  {isSelected ? (
                    <circle
                      cx={xFor(asset.risk)}
                      cy={yFor(asset.returnPct)}
                      r={13}
                      fill={asset.color}
                      opacity={0.18}
                    />
                  ) : null}
                  <circle
                    cx={xFor(asset.risk)}
                    cy={yFor(asset.returnPct)}
                    r={isSelected ? 8 : 6}
                    fill={asset.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <text
                    x={xFor(asset.risk)}
                    y={yFor(asset.returnPct) - 14}
                    textAnchor="middle"
                    className={cn(
                      "text-[11px]",
                      isSelected ? "fill-ink font-semibold" : "fill-muted",
                    )}
                  >
                    {asset.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="text-muted mt-2 text-xs leading-5">
            Toque nos pontos ou navegue com Tab. As posições são qualitativas: servem para comparar
            a lógica de risco, não para prever retorno.
          </figcaption>
        </figure>

        <div
          aria-live="polite"
          className="border-line bg-canvas flex flex-col rounded-2xl border p-5"
        >
          <p className="text-muted text-xs font-semibold tracking-wide uppercase">
            Ativo selecionado
          </p>
          <p className="font-display text-ink mt-1 text-lg font-bold">{selected.name}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted text-xs">Risco</dt>
              <dd className="text-ink font-semibold tabular-nums">{selected.risk} / 100</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Retorno esperado</dt>
              <dd className="text-brand-700 font-semibold tabular-nums">
                {formatPercent(selected.returnPct, 1)} a.a.
              </dd>
            </div>
          </dl>

          <p className="mt-4 flex-1 text-sm leading-6 text-slate-700">{selected.description}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedId(asset.id)}
                aria-pressed={asset.id === selected.id}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  asset.id === selected.id
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line hover:border-brand-600/40 bg-white text-slate-600",
                )}
              >
                {asset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
