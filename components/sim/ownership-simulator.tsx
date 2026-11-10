"use client";

import { useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { formatBRL, formatBRLPrecise, formatPercent } from "@/lib/utils";

const TOTAL_SHARES = 1_000_000;

export function OwnershipSimulator() {
  const [investment, setInvestment] = useState(10_000);
  const [price, setPrice] = useState(20);
  const [annualProfit, setAnnualProfit] = useState(5_000_000);

  const numbers = useMemo(() => {
    const shares = Math.floor(investment / price);
    const ownership = shares / TOTAL_SHARES;
    const stakeValue = shares * price;
    const profitShare = ownership * annualProfit;
    const earningsPerShare = annualProfit / TOTAL_SHARES;
    const marketCap = price * TOTAL_SHARES;
    const dividendYield = earningsPerShare / price;

    return {
      shares,
      ownership,
      stakeValue,
      profitShare,
      earningsPerShare,
      marketCap,
      dividendYield,
    };
  }, [annualProfit, investment, price]);

  const ownershipPercent = numbers.ownership * 100;
  const barWidth = Math.max(0.6, Math.min(100, ownershipPercent * 100));

  return (
    <section
      aria-labelledby="simulador-socio"
      className="border-line bg-surface shadow-card my-10 rounded-3xl border p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Simulador
          </p>
          <h2 id="simulador-socio" className="font-display text-ink mt-1 text-xl font-bold">
            Quanto da empresa é seu
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 rounded-full px-3 py-1 text-xs font-medium">
          empresa fictícia com 1 milhão de ações
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="space-y-5">
          <Slider
            label="Quanto você investe"
            value={investment}
            min={1_000}
            max={50_000}
            step={1_000}
            display={formatBRL(investment)}
            onChange={setInvestment}
          />
          <Slider
            label="Preço de cada ação"
            value={price}
            min={5}
            max={100}
            step={1}
            display={formatBRLPrecise(price)}
            onChange={setPrice}
          />
          <Slider
            label="Lucro líquido anual da empresa"
            value={annualProfit}
            min={1_000_000}
            max={20_000_000}
            step={500_000}
            display={formatBRL(annualProfit)}
            onChange={setAnnualProfit}
          />
        </div>

        <div>
          <div className="border-brand-600/20 from-brand-50 rounded-2xl border bg-linear-to-br to-white p-5">
            <p className="text-brand-800 text-xs font-semibold tracking-wide uppercase">
              Sua fatia da empresa
            </p>
            <p className="font-display text-brand-800 mt-1 text-3xl font-extrabold tabular-nums">
              {ownershipPercent < 0.01
                ? formatPercent(ownershipPercent, 4)
                : formatPercent(ownershipPercent, 3)}
            </p>
            <p className="text-muted mt-1 text-sm">
              {numbers.shares.toLocaleString("pt-BR")}{" "}
              {numbers.shares === 1 ? "ação comprada" : "ações compradas"} por{" "}
              {formatBRLPrecise(numbers.stakeValue)}
            </p>

            <div
              className="bg-track mt-4 h-3 w-full overflow-hidden rounded-full"
              aria-hidden="true"
            >
              <div className="bg-brand-600 h-full rounded-full" style={{ width: `${barWidth}%` }} />
            </div>
            <p className="text-muted mt-1.5 text-xs">
              A barra exagera a sua fatia para ficar visível: cada 1% dela representa 0,01% da
              empresa.
            </p>
          </div>

          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Sua parte do lucro anual</dt>
              <dd className="font-display text-ink mt-0.5 text-lg font-bold tabular-nums">
                {formatBRLPrecise(numbers.profitShare)}
              </dd>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Lucro por ação</dt>
              <dd className="font-display text-ink mt-0.5 text-lg font-bold tabular-nums">
                {formatBRLPrecise(numbers.earningsPerShare)}
              </dd>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Valor de mercado da empresa</dt>
              <dd className="font-display text-ink mt-0.5 text-lg font-bold tabular-nums">
                {formatBRL(numbers.marketCap)}
              </dd>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Dividend yield (se distribuir tudo)</dt>
              <dd className="font-display text-brand-700 mt-0.5 text-lg font-bold tabular-nums">
                {formatPercent(numbers.dividendYield * 100, 2)}
              </dd>
            </div>
          </dl>

          <p className="border-line bg-canvas text-muted mt-4 rounded-xl border px-4 py-3 text-sm leading-6">
            Você não compra um código na tela: compra uma fração de um negócio. Se a empresa gera
            lucro, essa fração vale algo, mesmo quando o preço da ação passa meses parado.
          </p>
        </div>
      </div>
    </section>
  );
}
