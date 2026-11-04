"use client";

import { useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { netFixedIncome, poupancaAnnualRate } from "@/lib/finance";
import { formatBRLPrecise, formatPercent } from "@/lib/utils";

type Preset = "tesouro-poupanca" | "cdb-lci";

type ProductResult = {
  name: string;
  detail: string;
  grossRate: number;
  netAmount: number;
  netRate: number;
  taxLabel: string;
  color: string;
};

const PRINCIPAL = 10_000;

export function FixedIncomeComparison({ preset }: { preset: Preset }) {
  const [baseRate, setBaseRate] = useState(11);
  const [months, setMonths] = useState(24);

  const days = months * 30;

  const products = useMemo<ProductResult[]>(() => {
    const rate = baseRate / 100;

    if (preset === "tesouro-poupanca") {
      const tesouroRate = Math.max(0, rate - 0.002);
      const tesouro = netFixedIncome({
        principal: PRINCIPAL,
        annualRate: tesouroRate,
        days,
      });
      const poupancaRate = poupancaAnnualRate(rate);
      const poupanca = netFixedIncome({
        principal: PRINCIPAL,
        annualRate: poupancaRate,
        days,
        product: "lci",
      });

      return [
        {
          name: "Tesouro Selic",
          detail: "Selic menos a taxa de custódia da B3 (0,2% a.a.)",
          grossRate: tesouroRate,
          netAmount: tesouro.netAmount,
          netRate: tesouro.effectiveAnnualRate,
          taxLabel: "paga IR",
          color: "#0f6b4f",
        },
        {
          name: "Poupança",
          detail: rate > 0.085 ? "0,5% ao mês + TR (TR ignorada)" : "70% da Selic",
          grossRate: poupancaRate,
          netAmount: poupanca.netAmount,
          netRate: poupanca.effectiveAnnualRate,
          taxLabel: "isenta de IR",
          color: "#b45309",
        },
      ];
    }

    const cdb = netFixedIncome({ principal: PRINCIPAL, annualRate: rate, days });
    const lciRate = rate * 0.9;
    const lci = netFixedIncome({
      principal: PRINCIPAL,
      annualRate: lciRate,
      days,
      product: "lci",
    });

    return [
      {
        name: "CDB 100% do CDI",
        detail: "tributado pela tabela regressiva",
        grossRate: rate,
        netAmount: cdb.netAmount,
        netRate: cdb.effectiveAnnualRate,
        taxLabel: "paga IR",
        color: "#1d4ed8",
      },
      {
        name: "LCI 90% do CDI",
        detail: "isenta de IR, com carência",
        grossRate: lciRate,
        netAmount: lci.netAmount,
        netRate: lci.effectiveAnnualRate,
        taxLabel: "isenta de IR",
        color: "#0f6b4f",
      },
    ];
  }, [baseRate, days, preset]);

  const best = products.reduce((winner, product) =>
    product.netAmount > winner.netAmount ? product : winner,
  );
  const worst = products.find((product) => product !== best) ?? products[0];
  const difference = best.netAmount - worst.netAmount;

  const title =
    preset === "tesouro-poupanca" ? "Tesouro Selic ou poupança?" : "CDB de 100% ou LCI de 90%?";
  const rateLabel = preset === "tesouro-poupanca" ? "Selic ao ano" : "CDI ao ano";

  return (
    <section
      aria-labelledby="simulador-renda-fixa"
      className="border-line my-10 rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-accent text-xs font-semibold tracking-widest uppercase">Simulador</p>
          <h2 id="simulador-renda-fixa" className="font-display text-ink mt-1 text-xl font-bold">
            {title}
          </h2>
        </div>
        <span className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs font-medium">
          R$ 10.000 · dados ilustrativos
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="space-y-6">
          <Slider
            label={rateLabel}
            value={baseRate}
            min={8}
            max={16}
            step={0.25}
            display={`${formatPercent(baseRate, 2)} a.a.`}
            onChange={setBaseRate}
          />
          <Slider
            label="Prazo"
            value={months}
            min={1}
            max={36}
            step={1}
            display={`${months} ${months === 1 ? "mês" : "meses"}`}
            onChange={setMonths}
          />
          <p className="bg-canvas text-muted rounded-xl p-4 text-sm leading-6">
            O mesmo valor, o mesmo prazo. A única diferença é a taxa, a tributação e a liquidez de
            cada produto.
          </p>
        </div>

        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((product) => {
              const isBest = product === best;

              return (
                <div
                  key={product.name}
                  className={
                    isBest
                      ? "border-brand-600/40 bg-brand-50/50 rounded-2xl border-2 p-4"
                      : "border-line rounded-2xl border bg-white p-4"
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-ink text-sm font-bold">{product.name}</p>
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-block size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: product.color }}
                    />
                  </div>
                  <p className="text-muted mt-0.5 text-xs leading-5">{product.detail}</p>

                  <p className="font-display text-ink mt-3 text-2xl font-extrabold tabular-nums">
                    {formatBRLPrecise(product.netAmount)}
                  </p>
                  <p className="text-muted mt-0.5 text-xs">valor líquido no resgate</p>

                  <dl className="border-line/70 mt-3 space-y-1 border-t pt-2 text-xs">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Taxa bruta</dt>
                      <dd className="text-ink font-semibold tabular-nums">
                        {formatPercent(product.grossRate * 100, 2)} a.a.
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Taxa líquida</dt>
                      <dd className="text-brand-700 font-semibold tabular-nums">
                        {formatPercent(product.netRate * 100, 2)} a.a.
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Tributação</dt>
                      <dd className="text-slate-600">{product.taxLabel}</dd>
                    </div>
                  </dl>

                  {isBest ? (
                    <p className="bg-brand-600 mt-3 rounded-lg px-2.5 py-1 text-center text-xs font-semibold text-white">
                      Melhor líquido
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <p className="border-line bg-canvas mt-4 rounded-xl border px-4 py-3 text-sm leading-6 text-slate-700">
            <strong className="text-ink font-semibold">Diferença:</strong>{" "}
            {formatBRLPrecise(difference)} a mais em {months} {months === 1 ? "mês" : "meses"} para{" "}
            {best.name.toLowerCase()}.
            {preset === "cdb-lci"
              ? " A taxa de indiferença da LCI é o CDB multiplicado por (1 − alíquota de IR)."
              : " A poupança não paga IR, mas isso raramente compensa a diferença de rentabilidade."}
          </p>
        </div>
      </div>
    </section>
  );
}
