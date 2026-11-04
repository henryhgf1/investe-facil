"use client";

import { useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { incomeTaxRate, iofRate, netFixedIncome } from "@/lib/finance";
import { cn, formatBRLPrecise, formatPercent } from "@/lib/utils";

type Product = "cdb" | "lci";

export function TaxCalculator() {
  const [principal, setPrincipal] = useState(10_000);
  const [annualRate, setAnnualRate] = useState(12);
  const [days, setDays] = useState(365);
  const [product, setProduct] = useState<Product>("cdb");

  const result = useMemo(
    () =>
      netFixedIncome({
        principal,
        annualRate: annualRate / 100,
        days,
        product,
      }),
    [annualRate, days, principal, product],
  );

  const taxRate = incomeTaxRate(days);
  const iof = iofRate(days);
  const taxable = product === "cdb";
  const netShare = result.gross > 0 ? result.netGain / result.gross : 0;
  const iofShare = result.gross > 0 ? result.iof / result.gross : 0;
  const irShare = result.gross > 0 ? result.ir / result.gross : 0;

  return (
    <section
      aria-labelledby="simulador-impostos"
      className="border-line my-10 rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-warn text-xs font-semibold tracking-widest uppercase">Simulador</p>
          <h2 id="simulador-impostos" className="font-display text-ink mt-1 text-xl font-bold">
            Quanto sobra depois dos impostos
          </h2>
        </div>
        <span className="bg-warn-soft text-warn rounded-full px-3 py-1 text-xs font-medium">
          dados ilustrativos
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="space-y-5">
          <Slider
            label="Valor aplicado"
            value={principal}
            min={1_000}
            max={50_000}
            step={1_000}
            display={formatBRLPrecise(principal)}
            onChange={setPrincipal}
          />
          <Slider
            label="Rentabilidade ao ano"
            value={annualRate}
            min={6}
            max={18}
            step={0.5}
            display={`${formatPercent(annualRate, 1)} a.a.`}
            onChange={setAnnualRate}
          />
          <Slider
            label="Prazo até o resgate"
            value={days}
            min={1}
            max={1_080}
            step={1}
            display={`${days} ${days === 1 ? "dia" : "dias"}`}
            onChange={setDays}
          />

          <fieldset>
            <legend className="text-ink mb-2 text-sm font-medium">Tipo de produto</legend>
            <div className="flex gap-2">
              {(
                [
                  { id: "cdb", label: "CDB (paga IR)" },
                  { id: "lci", label: "LCI/LCA (isenta)" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={product === option.id}
                  onClick={() => setProduct(option.id)}
                  className={cn(
                    "flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                    product === option.id
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line hover:border-brand-600/40 bg-white text-slate-600",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
          <dl className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">Rendimento bruto</dt>
              <dd className="font-display text-ink mt-0.5 text-lg font-bold tabular-nums">
                {formatBRLPrecise(result.gross)}
              </dd>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">IOF ({formatPercent(iof * 100, 0)})</dt>
              <dd className="font-display text-warn mt-0.5 text-lg font-bold tabular-nums">
                − {formatBRLPrecise(result.iof)}
              </dd>
            </div>
            <div className="border-line bg-canvas rounded-xl border p-3">
              <dt className="text-muted text-xs">IR ({formatPercent(taxRate * 100, 1)})</dt>
              <dd className="font-display text-warn mt-0.5 text-lg font-bold tabular-nums">
                − {formatBRLPrecise(result.ir)}
              </dd>
            </div>
            <div className="border-brand-600/25 bg-brand-50 rounded-xl border p-3">
              <dt className="text-brand-800 text-xs">Você recebe</dt>
              <dd className="font-display text-brand-800 mt-0.5 text-lg font-extrabold tabular-nums">
                {formatBRLPrecise(result.netAmount)}
              </dd>
            </div>
          </dl>

          <div className="mt-4" aria-hidden="true">
            <p className="text-muted mb-1.5 text-xs font-medium">
              Para onde vai o rendimento bruto
            </p>
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="bg-brand-600 h-full"
                style={{ width: `${Math.max(0, netShare) * 100}%` }}
              />
              <div className="bg-warn h-full" style={{ width: `${Math.max(0, irShare) * 100}%` }} />
              <div
                className="bg-danger h-full"
                style={{ width: `${Math.max(0, iofShare) * 100}%` }}
              />
            </div>
            <div className="text-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-brand-600 inline-block size-2 rounded-full" />
                líquido
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-warn inline-block size-2 rounded-full" />
                IR
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-danger inline-block size-2 rounded-full" />
                IOF
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm leading-6">
            <p className="bg-canvas rounded-xl px-4 py-3 text-slate-700">
              <strong className="text-ink font-semibold">Taxa efetiva:</strong>{" "}
              {formatPercent(result.effectiveAnnualRate * 100, 2)} ao ano, já descontados IOF e IR.
            </p>

            {taxable && days < 30 ? (
              <p className="bg-warn-soft text-warn rounded-xl px-4 py-3">
                Resgate antes do 30º dia: o IOF consome {formatPercent(iof * 100, 0)} do rendimento
                bruto. Espere o 30º dia e o IOF zera.
              </p>
            ) : null}

            {taxable && days >= 30 && days <= 180 ? (
              <p className="bg-accent-soft text-accent rounded-xl px-4 py-3">
                Você está na faixa de 22,5% de IR. Passando de 180 dias, a alíquota cai para 20%.
              </p>
            ) : null}

            {product === "lci" ? (
              <p className="bg-brand-50 text-brand-800 rounded-xl px-4 py-3">
                LCI e LCA são isentas de IR. A contrapartida costuma ser uma taxa menor e a
                carência, que impede o resgate imediato.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
