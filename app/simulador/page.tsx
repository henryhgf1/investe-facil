import { ArrowRight, CalendarRange, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { TimeMachine } from "@/components/sim/time-machine";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { HISTORY_END, HISTORY_START, historySource } from "@/content/history";

export const metadata: Metadata = {
  title: "Máquina do tempo: simulador histórico",
  description:
    "Compare CDI, Ibovespa e inflação de 2000 a 2024 com aportes mensais e veja como o tempo muda o resultado.",
};

export default function SimuladorPage() {
  const totalYears = HISTORY_END - HISTORY_START + 1;

  return (
    <Container className="py-12 sm:py-16">
      <Reveal className="max-w-3xl">
        <Badge variant="brand">Simulador histórico</Badge>
        <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
          E se você tivesse começado em 2000?
        </h1>
        <p className="text-muted mt-4 text-base leading-7">
          A máquina do tempo pega os aportes que você faria hoje e aplica o CDI, o Ibovespa e a
          inflação de cada ano. Sem prever o futuro: só mostrando o que o tempo fez com quem começou
          cedo e continuou aportando.
        </p>
        <div className="text-muted mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <CalendarRange className="size-4" aria-hidden="true" />
            {totalYears} anos de dados anuais
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Nenhum dinheiro em risco
          </span>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <TimeMachine />
      </Reveal>

      <Reveal
        as="section"
        aria-labelledby="fontes"
        className="border-line bg-surface mt-12 rounded-2xl border p-6"
      >
        <h2 id="fontes" className="font-display text-ink text-xl font-bold">
          De onde vêm os números
        </h2>
        <dl className="mt-4 space-y-3 text-sm leading-6">
          <div>
            <dt className="text-ink font-semibold">CDI</dt>
            <dd className="text-muted">{historySource.cdi}</dd>
          </div>
          <div>
            <dt className="text-ink font-semibold">Ibovespa</dt>
            <dd className="text-muted">{historySource.ibov}</dd>
          </div>
          <div>
            <dt className="text-ink font-semibold">Inflação</dt>
            <dd className="text-muted">{historySource.ipca}</dd>
          </div>
        </dl>
        <p className="bg-canvas text-muted mt-4 rounded-xl px-4 py-3 text-sm leading-6">
          {historySource.note}
        </p>
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <Link
          href="/trilha/fundamentos/inflacao/"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
        >
          Ver a lição de inflação
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/trilha/renda-variavel/diversificacao/"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
        >
          Ver a lição de diversificação
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </Container>
  );
}
