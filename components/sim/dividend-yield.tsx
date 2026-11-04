"use client";

import { useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { dividendYield, poupancaAnnualRate } from "@/lib/finance";
import { cn, formatBRL, formatBRLPrecise, formatPercent } from "@/lib/utils";

const SELIC = 0.11;

export function DividendYield() {
  const [dividend, setDividend] = useState(0.6);
  const [price, setPrice] = useState(12);
  const [investment, setInvestment] = useState(10_000);

  const numbers = useMemo(() => {
    const yieldRate = dividendYield({ dividendPerShare: dividend, price });
    const shares = Math.floor(investment / price);
    const invested = shares * price;
    const annualIncome = shares * dividend;
    const monthlyIncome = annualIncome / 12;
    const poupancaRate = poupancaAnnualRate(SELIC);
    const poupancaIncome = invested * poupancaRate;

    return {
      yieldRate,
      shares,
      invested,
      annualIncome,
      monthlyIncome,
      poupancaRate,
      poupancaIncome,
    };
  }, [dividend, investment, price]);

  const maxIncome = Math.max(numbers.annualIncome, numbers.poupancaIncome, 1);
  const rows = [
    {
      label: "Dividendos",
      detail: `${formatPercent(numbers.yieldRate * 100, 2)} ao ano`,
      value: numbers.annualIncome,
      color: "bg-brand-600",
    },
    {
      label: "Poupança",
      detail: `${formatPercent(numbers.poupancaRate * 100, 2)} ao ano, isenta de IR`,
      value: numbers.poupancaIncome,
      color: "bg-warn",
    },
  ];

  return (
    <section
      aria-labelledby="simulador-dividend-yield"
      className="border-line my-10 rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-accent text-xs font-semibold tracking-widest uppercase">Simulador</p>
          <h2
            id="simulador-dividend-yield"
            className="font-display text-ink mt-1 text-xl font-bold"
          >
            Dividend yield na prática
          </h2>
        </div>
        <span className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs font-medium">
          Selic ilustrativa de 11% ao ano
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="space-y-5">
          <Slider
            label="Dividendo por ação (12 meses)"
            value={dividend}
            min={0}
            max={5}
            step={0.05}
            display={formatBRLPrecise(dividend)}
            onChange={setDividend}
          />
          <Slider
            label="Preço da ação"
            value={price}
            min={5}
            max={100}
            step={1}
            display={formatBRLPrecise(price)}
            onChange={setPrice}
          />
          <Slider
            label="Quanto você investe"
            value={investment}
            min={1_000}
            max={100_000}
            step={1_000}
            display={formatBRL(investment)}
            onChange={setInvestment}
          />
        </div>

        <div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-brand-600/25 bg-brand-50 rounded-xl border p-3">
              <p className="text-brand-800 text-xs">Dividend yield</p>
              <p className="font-display text-brand-800 mt-0.5 text-2xl font-extrabold tabular-nums">
                {formatPercent(numbers.yieldRate * 100, 2)}
              </p>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <p className="text-muted text-xs">Renda por ano</p>
              <p className="font-display text-ink mt-0.5 text-2xl font-bold tabular-nums">
                {formatBRL(numbers.annualIncome)}
              </p>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <p className="text-muted text-xs">Média por mês</p>
              <p className="font-display text-ink mt-0.5 text-2xl font-bold tabular-nums">
                {formatBRLPrecise(numbers.monthlyIncome)}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-muted mb-2 text-xs font-medium">
              Renda anual sobre {formatBRL(numbers.invested)} investidos
            </p>
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-ink font-medium">
                      {row.label}{" "}
                      <span className="text-muted text-xs font-normal">· {row.detail}</span>
                    </span>
                    <span className="text-ink font-semibold tabular-nums">
                      {formatBRLPrecise(row.value)}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={cn("h-full rounded-full", row.color)}
                      style={{ width: `${Math.max(2, (row.value / maxIncome) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="border-line bg-canvas text-muted mt-5 rounded-xl border px-4 py-3 text-sm leading-6">
            Você compraria {numbers.shares.toLocaleString("pt-BR")}{" "}
            {numbers.shares === 1 ? "ação" : "ações"}. O dividend yield é uma foto do passado: nada
            garante que a empresa repita o pagamento, e o preço da ação pode cair mais do que o
            dividendo recebido.
          </p>
        </div>
      </div>
    </section>
  );
}
