import { Flame, HandCoins, Hourglass, Layers, LineChart, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { RISK_TYPES, type RiskTone } from "@/content/risk-types";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  mercado: LineChart,
  credito: HandCoins,
  liquidez: Hourglass,
  inflacao: Flame,
  concentracao: Target,
};

const tones: Record<RiskTone, { icon: string }> = {
  accent: { icon: "bg-accent-soft text-accent" },
  warn: { icon: "bg-warn-soft text-warn" },
  brand: { icon: "bg-brand-50 text-brand-700" },
  danger: { icon: "bg-red-50 text-danger" },
  neutral: { icon: "bg-slate-100 text-slate-600" },
};

export function RiskTypes() {
  return (
    <section
      aria-labelledby="tipos-de-risco"
      className="border-line my-10 overflow-hidden rounded-3xl border bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04)]"
    >
      <div className="border-line bg-canvas flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 sm:px-8">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Mapa de riscos
          </p>
          <h2 id="tipos-de-risco" className="font-display text-ink mt-1 text-xl font-bold">
            Cinco riscos que andam juntos
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Layers className="size-3.5" aria-hidden="true" />
          quase nunca um só
        </span>
      </div>

      <ul
        aria-label="Tipos de risco"
        className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3"
      >
        {RISK_TYPES.map((risk, index) => {
          const Icon = icons[risk.id] ?? Layers;

          return (
            <li
              key={risk.id}
              className={cn(
                "border-line flex flex-col rounded-2xl border bg-white p-5",
                index === RISK_TYPES.length - 1 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  tones[risk.tone].icon,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-ink mt-4 text-base font-bold">{risk.name}</h3>
              <p className="text-muted mt-1 text-sm leading-6">{risk.definition}</p>
              <p className="border-line mt-auto border-t pt-3 text-sm leading-6 text-slate-700">
                <span className="text-ink font-semibold">Exemplo: </span>
                {risk.example}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="border-line bg-canvas text-muted border-t px-6 py-4 text-xs leading-5 sm:px-8">
        Os exemplos são ilustrativos. Na prática, o mesmo investimento costuma carregar mais de um
        destes riscos ao mesmo tempo.
      </p>
    </section>
  );
}
