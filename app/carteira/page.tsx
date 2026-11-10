import { ArrowRight, CalendarRange, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PortfolioBuilder } from "@/components/sim/portfolio-builder";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { HISTORY_END, HISTORY_START, historySource } from "@/content/history";

export const metadata: Metadata = {
  title: "Carteira: monte e compare com CDI e Ibovespa",
  description:
    "Distribua seus aportes entre caixa, renda fixa, FIIs, ações e exterior e compare a evolução com o CDI e o Ibovespa de 2000 a 2024.",
};

export default function CarteiraPage() {
  const totalYears = HISTORY_END - HISTORY_START + 1;

  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <Badge variant="brand">Carteira</Badge>
        <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
          Monte uma carteira e veja o que o tempo faria com ela
        </h1>
        <p className="text-muted mt-4 text-base leading-7">
          Escolha quanto vai em cada classe de ativo, defina seus aportes e compare o resultado com
          duas réguas conhecidas: o CDI e o Ibovespa. O relatório mostra ano a ano o que mudou,
          quanto veio de aporte e quanto veio de retorno.
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
      </div>

      <PortfolioBuilder />

      <section
        aria-labelledby="fontes-carteira"
        className="border-line bg-surface mt-12 rounded-2xl border p-6"
      >
        <h2 id="fontes-carteira" className="font-display text-ink text-xl font-bold">
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
          Caixa e renda fixa seguem o CDI. Ações seguem o Ibovespa. FIIs e exposição internacional
          usam uma mistura didática dos dois índices, porque o projeto não carrega séries de IFIX ou
          de bolsas estrangeiras. {historySource.note}
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <Link
          href="/trilha/renda-variavel/diversificacao/"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
        >
          Ver a lição de diversificação
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/trilha/fundamentos/risco-e-retorno/"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
        >
          Ver a lição de risco e retorno
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/simulador/"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
        >
          Abrir a máquina do tempo
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Container>
  );
}
