import { Landmark } from "lucide-react";

import { IR_BRACKETS } from "@/lib/finance";
import { cn, formatPercent } from "@/lib/utils";

const barTones = ["bg-warn", "bg-warn/70", "bg-brand-400", "bg-brand-600"];

function formatRate(rate: number) {
  const percent = rate * 100;
  return formatPercent(percent, Number.isInteger(percent) ? 0 : 1);
}

export function TaxBrackets() {
  const topRate = IR_BRACKETS[0].rate;
  const lastRate = IR_BRACKETS[IR_BRACKETS.length - 1].rate;
  const spread = (topRate - lastRate) * 100;

  return (
    <section
      aria-labelledby="faixas-ir"
      className="border-line my-10 overflow-hidden rounded-3xl border bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04)]"
    >
      <div className="border-line bg-canvas flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 sm:px-8">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Tabela regressiva
          </p>
          <h2 id="faixas-ir" className="font-display text-ink mt-1 text-xl font-bold">
            IR na renda fixa
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Landmark className="size-3.5" aria-hidden="true" />
          quanto mais tempo, menos imposto
        </span>
      </div>

      <ul className="divide-line divide-y px-6 sm:px-8">
        {IR_BRACKETS.map((bracket, index) => (
          <li key={bracket.label} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-ink text-sm font-semibold">{bracket.label}</p>
              <p className="font-display text-ink text-lg font-extrabold tabular-nums">
                {formatRate(bracket.rate)}
              </p>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full", barTones[index] ?? "bg-brand-600")}
                style={{ width: `${(bracket.rate / topRate) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="border-line bg-canvas text-muted border-t px-6 py-4 text-xs leading-5 sm:px-8">
        A diferença entre a primeira e a última faixa é de{" "}
        <strong className="text-ink font-semibold">{formatPercent(spread, 1)}</strong> só pelo tempo
        de permanência. Alíquotas sobre o rendimento, por dias corridos.
      </p>
    </section>
  );
}
