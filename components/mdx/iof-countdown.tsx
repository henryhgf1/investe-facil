import { Timer } from "lucide-react";

import { IOF_TABLE } from "@/lib/finance";
import { cn, formatPercent } from "@/lib/utils";

const maxRate = IOF_TABLE[0];

const milestones = [1, 10, 20, 29, 30].map((day) => ({
  day,
  label: day === 30 ? "A partir do 30º dia" : `${day}º dia`,
  rate: IOF_TABLE[day - 1],
}));

export function IofCountdown() {
  return (
    <section
      aria-labelledby="tabela-iof"
      className="border-line bg-surface shadow-card my-10 overflow-hidden rounded-3xl border"
    >
      <div className="border-line bg-canvas flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 sm:px-8">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Contagem regressiva
          </p>
          <h2 id="tabela-iof" className="font-display text-ink mt-1 text-xl font-bold">
            IOF nos primeiros 30 dias
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Timer className="size-3.5" aria-hidden="true" />
          só sobre o rendimento
        </span>
      </div>

      <div className="px-6 pt-6 sm:px-8">
        <div aria-hidden="true" className="flex h-16 items-end gap-[2px]">
          {IOF_TABLE.map((rate, index) => (
            <div
              key={index}
              className={cn("flex-1 rounded-t-sm", rate > 0 ? "bg-warn" : "bg-brand-500")}
              style={{
                height: `${Math.max(4, (rate / maxRate) * 100)}%`,
                opacity: rate > 0 ? 0.35 + 0.65 * (rate / maxRate) : 1,
              }}
            />
          ))}
        </div>
        <div className="text-muted mt-2 flex justify-between text-[11px]">
          <span>1º dia</span>
          <span>30º dia</span>
        </div>
      </div>

      <ul className="divide-line mt-4 divide-y px-6 sm:px-8">
        {milestones.map((milestone) => (
          <li key={milestone.day} className="py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-ink text-sm font-semibold">{milestone.label}</p>
              <p className="font-display text-ink text-lg font-extrabold tabular-nums">
                {formatPercent(milestone.rate * 100, 0)}
              </p>
            </div>
            <div className="bg-surface-2 mt-1.5 h-2 overflow-hidden rounded-full">
              <div
                className={cn(
                  "h-full rounded-full",
                  milestone.rate > 0 ? "bg-warn" : "bg-brand-500",
                )}
                style={{ width: `${(milestone.rate / maxRate) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="border-line bg-canvas text-muted border-t px-6 py-4 text-xs leading-5 sm:px-8">
        O IOF incide só sobre o rendimento e desaparece a partir do 30º dia corrido. Antes disso,
        ele reduz a base do IR.
      </p>
    </section>
  );
}
