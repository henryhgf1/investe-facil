import { Clock3, TrendingUp } from "lucide-react";

import { projectMonthly } from "@/lib/finance";
import { cn, formatBRL, formatMultiple } from "@/lib/utils";

const MONTHLY = 300;
const MONTHLY_RATE = 0.008;

type Profile = {
  name: string;
  years: number;
  highlight: boolean;
};

const profiles: Profile[] = [
  { name: "Ana", years: 10, highlight: false },
  { name: "Bruno", years: 20, highlight: true },
];

function projectionFor(years: number) {
  const points = projectMonthly({
    monthly: MONTHLY,
    monthlyRate: MONTHLY_RATE,
    months: years * 12,
  });
  const last = points[points.length - 1];

  return {
    invested: last.invested,
    balance: last.balance,
    interest: last.balance - last.invested,
  };
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

export function TimeComparison() {
  const results = profiles.map((profile) => ({ ...profile, ...projectionFor(profile.years) }));
  const [ana, bruno] = results;

  const balanceRatio = bruno.balance / ana.balance;
  const interestRatio = bruno.interest / ana.interest;
  const extraInvested = bruno.invested - ana.invested;

  return (
    <section
      aria-labelledby="comparativo-tempo"
      className="border-line bg-surface shadow-card my-10 overflow-hidden rounded-3xl border"
    >
      <div className="border-line bg-canvas flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 sm:px-8">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
            Comparativo
          </p>
          <h2 id="comparativo-tempo" className="font-display text-ink mt-1 text-xl font-bold">
            Mesmo aporte, prazos diferentes
          </h2>
        </div>
        <span className="bg-brand-50 text-brand-800 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
          <Clock3 className="size-3.5" aria-hidden="true" />
          R$ 300/mês · 0,8% ao mês
        </span>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        {results.map((person) => {
          const investedShare = (person.invested / person.balance) * 100;

          return (
            <article
              key={person.name}
              className={cn(
                "rounded-2xl border p-5",
                person.highlight
                  ? "border-brand-600/30 from-brand-50/80 ring-brand-600/10 bg-linear-to-br to-surface ring-1"
                  : "border-line bg-surface",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-ink text-lg font-bold">{person.name}</p>
                  <p className="text-muted text-xs">{person.years} anos investindo</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    person.highlight ? "bg-primary text-on-primary" : "bg-surface-2 text-body",
                  )}
                >
                  {person.years * 12} aportes
                </span>
              </div>

              <p className="text-muted mt-5 text-xs font-medium tracking-wide uppercase">
                Saldo final
              </p>
              <p className="font-display text-ink mt-1 text-3xl font-extrabold tabular-nums">
                {formatBRL(person.balance)}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-muted text-xs">Aportado</dt>
                  <dd className="text-ink mt-0.5 text-sm font-semibold tabular-nums">
                    {formatBRL(person.invested)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted text-xs">Juros</dt>
                  <dd className="text-brand-700 mt-0.5 text-sm font-semibold tabular-nums">
                    {formatBRL(person.interest)}
                  </dd>
                </div>
              </dl>

              <div
                role="img"
                aria-label={`${person.name} aportou ${formatBRL(person.invested)} e ganhou ${formatBRL(person.interest)} em juros, chegando a ${formatBRL(person.balance)}.`}
                className="bg-surface-2 mt-4 flex h-3 overflow-hidden rounded-full"
              >
                <div className="bg-line-strong" style={{ width: `${investedShare}%` }} />
                <div className="bg-brand-500" style={{ width: `${100 - investedShare}%` }} />
              </div>

              <div className="text-muted mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="bg-line-strong size-2 rounded-full" aria-hidden="true" />o que{" "}
                  {person.name} aportou
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="bg-brand-500 size-2 rounded-full" aria-hidden="true" />
                  juros
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-line bg-canvas grid gap-4 border-t px-6 py-5 sm:grid-cols-3 sm:px-8">
        <Stat
          value={formatMultiple(balanceRatio)}
          label={`o saldo de ${bruno.name} em relação ao de ${ana.name}`}
        />
        <Stat
          value={formatMultiple(interestRatio)}
          label={`os juros de ${bruno.name} em relação aos de ${ana.name}`}
        />
        <Stat
          value={formatBRL(extraInvested)}
          label={`a mais que ${bruno.name} aportou no total`}
        />
      </div>

      <p className="text-muted border-line border-t px-6 py-4 text-xs leading-5 sm:px-8">
        R$ 300 por mês a 0,8% ao mês, com aportes no fim de cada mês. Valores brutos, sem impostos.
        Dados ilustrativos.
      </p>
    </section>
  );
}
