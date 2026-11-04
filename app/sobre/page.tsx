import { BookOpen, Code2, ShieldCheck, Timer, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sobre o projeto",
  description:
    "Como o Investe Fácil foi construído, quais decisões técnicas guiaram o projeto e o que ele não é.",
};

const decisions = [
  {
    icon: Timer,
    title: "Conteúdo em MDX, versionado no Git",
    description:
      "Cada lição é um arquivo de texto no repositório. Sem CMS, sem banco: o conteúdo evolui por pull request e o build falha se um link quebrar.",
  },
  {
    icon: Code2,
    title: "100% estático, sem backend",
    description:
      "O progresso vive no localStorage, com schema versionado e exportação em JSON. O resultado é custo zero, deploy instantâneo e nenhum dado pessoal coletado.",
  },
  {
    icon: Wrench,
    title: "Motor de simulação em funções puras",
    description:
      "Os cálculos de juros compostos, inflação e retorno real ficam isolados da interface e cobertos por testes — fáceis de auditar e de reutilizar.",
  },
];

export default function SobrePage() {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Badge variant="brand">Projeto de portfólio</Badge>
      <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
        Sobre o Investe Fácil
      </h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        Um projeto pessoal que começou com uma pergunta simples: por que aprender a investir parece
        tão mais difícil do que é?
      </p>

      <div className="mt-10 space-y-6 text-[17px] leading-8 text-slate-700">
        <p>
          A maioria dos conteúdos para iniciantes assume que você já sabe o que é CDI, liquidez ou
          marcação a mercado. O Investe Fácil parte do zero e constrói o vocabulário aos poucos,
          sempre com um exemplo numérico e um simulador para testar a ideia.
        </p>
        <p>
          A segunda aposta é que{" "}
          <strong className="text-ink font-semibold">errar sem dinheiro</strong> é a melhor forma de
          aprender. Por isso cada lição tem um componente interativo: em vez de ler que juros
          compostos crescem exponencialmente, você arrasta um controle e vê a curva mudar.
        </p>
      </div>

      <h2 className="font-display text-ink mt-12 text-2xl font-bold">Decisões técnicas</h2>
      <div className="mt-5 space-y-3">
        {decisions.map((decision) => (
          <Card key={decision.title} className="flex gap-4 p-5">
            <span className="bg-brand-50 text-brand-700 flex size-10 shrink-0 items-center justify-center rounded-xl">
              <decision.icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-ink text-base font-bold">{decision.title}</h3>
              <p className="text-muted mt-1 text-sm leading-6">{decision.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="font-display text-ink mt-12 text-2xl font-bold">Stack</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Zustand", "Vitest", "Zod"].map(
          (item) => (
            <Badge key={item} variant="outline" className="px-3 py-1 text-xs">
              {item}
            </Badge>
          ),
        )}
      </div>

      <h2 className="font-display text-ink mt-12 text-2xl font-bold">O que está por vir</h2>
      <ul className="mt-4 space-y-2 text-[17px] leading-8 text-slate-700">
        <li className="flex gap-2">
          <BookOpen className="text-brand-600 mt-1.5 size-4 shrink-0" aria-hidden="true" />
          As 7 lições restantes dos módulos de renda fixa e renda variável.
        </li>
        <li className="flex gap-2">
          <BookOpen className="text-brand-600 mt-1.5 size-4 shrink-0" aria-hidden="true" />
          Simulador com dados históricos: comece em 2020 e avance no tempo para viver a crise sem
          perder dinheiro.
        </li>
        <li className="flex gap-2">
          <BookOpen className="text-brand-600 mt-1.5 size-4 shrink-0" aria-hidden="true" />
          Missões práticas, glossário e relatório de evolução da carteira.
        </li>
      </ul>

      <div className="border-warn/25 bg-warn-soft mt-12 rounded-2xl border p-5">
        <p className="font-display text-ink flex items-center gap-2 text-base font-bold">
          <ShieldCheck className="text-warn size-4" aria-hidden="true" />
          Aviso importante
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Este é um projeto educacional. Nada aqui constitui recomendação, oferta ou consultoria de
          investimentos. Todos os números são ilustrativos e não representam produtos reais.
          Rentabilidades passadas não garantem resultados futuros.
        </p>
      </div>

      <div className="border-line mt-10 flex flex-wrap items-center gap-4 border-t pt-6 text-sm">
        <Link
          href="https://github.com/henryhgf1/investe-facil"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-2 font-semibold"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
          </svg>
          Código no GitHub
        </Link>
        <Link href="/trilha/" className="text-brand-700 hover:text-brand-800 font-semibold">
          Começar a trilha
        </Link>
      </div>
    </Container>
  );
}
