import type { Metadata } from "next";
import Link from "next/link";

import { GlossaryList } from "@/components/learn/glossary-list";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { glossary, glossaryCategories } from "@/content/glossary";

export const metadata: Metadata = {
  title: "Glossário de investimentos",
  description:
    "Mais de 50 termos de investimentos explicados em português claro: Selic, CDI, CDB, FII, ETF, IOF, tabela regressiva e muito mais.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Glossário de investimentos do Investe Fácil",
  description:
    "Termos de educação financeira para iniciantes, com definições curtas e ligações entre conceitos.",
  hasDefinedTerm: glossary.map((term) => ({
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
  })),
};

export default function GlossarioPage() {
  return (
    <Container className="max-w-5xl py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl">
        <Badge variant="brand">Consulta rápida</Badge>
        <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
          Glossário de investimentos
        </h1>
        <p className="text-muted mt-4 text-base leading-7">
          {glossary.length} termos explicados sem jargão, organizados em {glossaryCategories.length}{" "}
          categorias. Use a busca: ela ignora acentos e encontra siglas como CDI, FII e IOF.
        </p>
      </div>

      <div className="mt-8">
        <GlossaryList />
      </div>

      <div className="border-line bg-canvas mt-12 rounded-2xl border p-6">
        <p className="font-display text-ink text-base font-bold">
          Não achou o termo que procurava?
        </p>
        <p className="text-muted mt-2 text-sm leading-6">
          O glossário cobre o vocabulário usado na trilha. Se um termo ainda não está aqui, ele
          provavelmente aparece em uma das lições, e o contexto ajuda a fixar o significado.
        </p>
        <Link
          href="/trilha/"
          className="text-brand-700 hover:text-brand-800 mt-3 inline-block text-sm font-semibold"
        >
          Ver a trilha completa →
        </Link>
      </div>
    </Container>
  );
}
