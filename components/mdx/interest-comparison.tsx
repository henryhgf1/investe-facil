import { Coins, TrendingUp } from "lucide-react";

import { projectMonthly, simpleInterestBalance } from "@/lib/finance";
import { cn, formatBRL, formatBRLPrecise, formatMultiple } from "@/lib/utils";

const PRINCIPAL = 1000;
const MONTHLY_RATE = 0.01;

const periods = [
  { months: 1, label: "1 mês" },
  { months: 6, label: "6 meses" },
  { months: 12, label: "12 meses" },
  { months: 120, label: "10 anos" },
];

function compoundBalance(months: number) {
  const points = projectMonthly({
    initial: PRINCIPAL,
    monthlyRate: MONTHLY_RATE,
    months,
  });

  return points[points.length - 1].balance;
}

function BarRow({
  label,
  value,
  width,
  tone,
}: {
  label: string;
  value: number;
  width: number;
  tone: "muted" | "brand";
}) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2">
      <dt className="text-muted text-xs">{label}</dt>
      <dd className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full", tone === "brand" ? "bg-brand-500" : "bg-slate-300")}
          style={{ width: `${width}%` }}
        />
      </dd>
      <dd className="text-ink text-right text-xs font-semibold tabular-nums sm:text-sm">
        {formatBRLPrecise(value)}
      </dd>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-brand-50 text-brand-700 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
        <TrendingUp className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-ink text-xl font-extrabold tabular-nums">{value}</p>
        <p className="text-muted mt-0.5 text-xs leading-5">{label}</p>
      </div>
    </div>
  );
}

export function InterestComparison() {
  const rows = periods.map((period) => {
    const simple = simpleInterestBalance({
      principal: PRINCIPAL,
      monthlyRate: MONTHLY_RATE,
      months: period.months,
    });
    const compound = compoundBalance(period.months);

    return { ...period, simple, compound, gap: compound - simple };
  });

  const last = rows[rows.length - 1];

  return (
    <section
      aria-labelledby="comparativo-juros"
      className="border-line my-10 overflow-hidden rounded-3xl border bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04)]"
    >
      <div className="border-line bg-canvas flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 sm:px-8">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Comparativo
          </p>
          <h2 id="comparativo-juros" className="font-display text-ink mt-1 text-xl font-bold">
            Simples × compostos
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Coins className="size-3.5" aria-hidden="true" />
          {formatBRL(PRINCIPAL)} · 1% ao mês
        </span>
      </div>

      <div className="divide-line divide-y px-6 sm:px-8">
        {rows.map((row) => (
          <article key={row.months} className="py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-ink text-base font-bold">{row.label}</p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                  row.gap > 0.005 ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600",
                )}
              >
                {row.gap > 0.005 ? `+${formatBRLPrecise(row.gap)}` : "empate"}
              </span>
            </div>

            <dl className="mt-3 space-y-2">
              <BarRow
                label="Simples"
                value={row.simple}
                width={(row.simple / row.compound) * 100}
                tone="muted"
              />
              <BarRow label="Compostos" value={row.compound} width={100} tone="brand" />
            </dl>
          </article>
        ))}
      </div>

      <div className="border-line bg-canvas grid gap-4 border-t px-6 py-5 sm:grid-cols-3 sm:px-8">
        <Stat
          value={formatMultiple(last.simple / PRINCIPAL)}
          label="o valor inicial em 10 anos com juros simples"
        />
        <Stat
          value={formatMultiple(last.compound / PRINCIPAL)}
          label="o valor inicial em 10 anos com juros compostos"
        />
        <Stat value={formatBRLPrecise(last.gap)} label="a mais nos compostos ao fim de 10 anos" />
      </div>

      <p className="text-muted border-line border-t px-6 py-4 text-xs leading-5 sm:px-8">
        Os juros simples rendem sempre sobre {formatBRL(PRINCIPAL)}. Os compostos rendem sobre o
        saldo, que já inclui os juros dos meses anteriores. Dados ilustrativos, sem impostos.
      </p>
    </section>
  );
}
