import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CalendarRange,
  CheckCircle2,
  Compass,
  Layers,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Wallet,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { glossary } from "@/content/glossary";
import { lessonsOfModule } from "@/content/lessons";
import { modules } from "@/content/modules";
import { XP_PER_CORRECT_ANSWER, XP_PER_LESSON } from "@/lib/xp";

export const metadata: Metadata = {
  title: "Como o Investe Fácil funciona",
  description:
    "A trilha, os simuladores, os quizzes e o progresso do Investe Fácil, explicados em uma página.",
};

const audience = [
  {
    icon: Compass,
    title: "Para quem nunca investiu",
    description:
      "A trilha parte do zero e constrói o vocabulário aos poucos, sem assumir que você já sabe o que é CDI ou liquidez.",
  },
  {
    icon: ShieldCheck,
    title: "Para quem quer entender antes de arriscar",
    description:
      "Cada conceito vem com exemplo numérico e simulador. Dá para errar à vontade sem colocar dinheiro em risco.",
  },
  {
    icon: Sparkles,
    title: "Para quem aprende fazendo",
    description:
      "Em vez de decorar definições, você mexe nos controles, compara cenários e vê o efeito de cada escolha.",
  },
];

const lessonSteps = [
  {
    title: "Leitura curta",
    description:
      "Texto direto, com exemplos em reais, fórmulas explicadas e avisos de erro comum. Cada lição leva de 4 a 7 minutos.",
  },
  {
    title: "Simulador",
    description:
      "Você arrasta os controles e vê o efeito na hora: juros, inflação, impostos, dividendos ou risco.",
  },
  {
    title: "Quiz",
    description:
      "Perguntas de fixação com correção imediata, explicação por resposta e opção de tentar de novo.",
  },
  {
    title: "Conclusão",
    description:
      "Marque a lição como concluída, ganhe XP e siga para a próxima. O progresso fica salvo no navegador.",
  },
];

const material = [
  "Linguagem direta, sem jargão antes da hora.",
  "Exemplos numéricos com valores realistas.",
  "Fórmulas explicadas peça por peça, não só apresentadas.",
  "Avisos de armadilha de iniciante e de promessa fácil.",
];

const exercises = [
  {
    icon: TrendingUp,
    title: "Juros compostos",
    description:
      "Veja quanto um aporte mensal vira ao longo de décadas e por que começar cedo importa.",
  },
  {
    icon: Wallet,
    title: "Inflação e poder de compra",
    description:
      "Compare o número no extrato com o que o dinheiro realmente compra depois dos anos.",
  },
  {
    icon: Layers,
    title: "Comparação de renda fixa",
    description: "Coloque Tesouro, CDB e LCI lado a lado e entenda o que muda no retorno.",
  },
  {
    icon: Calculator,
    title: "IR e IOF no resgate",
    description: "Mude o prazo e veja o degrau do IOF e as faixas do Imposto de Renda.",
  },
  {
    icon: Target,
    title: "Dividend yield",
    description: "Calcule quanto um dividendo representa sobre o preço da ação.",
  },
  {
    icon: BadgeCheck,
    title: "Virar sócio",
    description: "Entenda o que significa comprar uma fração de uma empresa.",
  },
  {
    icon: CalendarRange,
    title: "Máquina do tempo",
    description:
      "Compare CDI, Ibovespa e inflação de 2000 a 2024 com aportes mensais e valores corrigidos.",
  },
];

const notFor = [
  "Não é recomendação, oferta ou consultoria de investimento.",
  "Não movimenta dinheiro real nem se conecta a corretoras.",
  "Não substitui a leitura de documentos e a orientação de um profissional.",
];

export default function SobrePage() {
  const totalLessons = modules.reduce(
    (sum, lessonModule) => sum + lessonsOfModule(lessonModule.id).length,
    0,
  );

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Badge variant="brand">Sobre o Investe Fácil</Badge>
      <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
        Como o Investe Fácil funciona
      </h1>
      <p className="text-body mt-4 text-lg leading-8">
        Uma trilha curta para entender como o dinheiro cresce, como os investimentos funcionam e
        quais riscos existem antes de colocar dinheiro real. Você lê, simula e responde quiz no
        mesmo lugar, sem cadastro e sem movimentar um centavo.
      </p>

      <section aria-labelledby="para-quem" className="mt-12">
        <h2 id="para-quem" className="font-display text-ink text-2xl font-bold">
          Para quem é
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {audience.map((item) => (
            <Card key={item.title} className="p-4">
              <span className="bg-brand-50 text-brand-700 flex size-9 items-center justify-center rounded-xl">
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-ink mt-3 text-base font-bold">{item.title}</h3>
              <p className="text-muted mt-1 text-sm leading-6">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="trilha" className="mt-12">
        <h2 id="trilha" className="font-display text-ink text-2xl font-bold">
          A trilha em 3 módulos
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          São {totalLessons} lições pensadas para serem lidas na ordem, dos fundamentos à renda
          variável.
        </p>
        <div className="mt-5 space-y-3">
          {modules.map((lessonModule, index) => {
            const lessonCount = lessonsOfModule(lessonModule.id).length;

            return (
              <Card key={lessonModule.id} className="flex gap-4 p-5">
                <span className="bg-brand-50 text-brand-700 font-display flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-ink text-base font-bold">
                      {lessonModule.title}
                    </h3>
                    <Badge variant="outline">
                      {lessonCount} {lessonCount === 1 ? "lição" : "lições"}
                    </Badge>
                  </div>
                  <p className="text-muted mt-1 text-sm leading-6">{lessonModule.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="licao" className="mt-12">
        <h2 id="licao" className="font-display text-ink text-2xl font-bold">
          Como uma lição funciona
        </h2>
        <ol className="mt-5 space-y-3">
          {lessonSteps.map((step, index) => (
            <li key={step.title}>
              <Card className="flex gap-4 p-5">
                <span className="bg-primary text-on-primary font-display flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-ink text-base font-bold">{step.title}</h3>
                  <p className="text-muted mt-1 text-sm leading-6">{step.description}</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="material" className="mt-12">
        <h2 id="material" className="font-display text-ink text-2xl font-bold">
          O material
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          O conteúdo foi escrito para quem está começando, sem pular etapas.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {material.map((item) => (
            <li
              key={item}
              className="border-line bg-surface text-body flex gap-3 rounded-xl border p-4 text-sm leading-6"
            >
              <CheckCircle2 className="text-brand-600 mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="exercicios" className="mt-12">
        <h2 id="exercicios" className="font-display text-ink text-2xl font-bold">
          Os exercícios
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Sete simuladores permitem testar as ideias da trilha sem dinheiro real.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {exercises.map((exercise) => (
            <Card key={exercise.title} className="p-4">
              <span className="bg-brand-50 text-brand-700 flex size-9 items-center justify-center rounded-xl">
                <exercise.icon className="size-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-ink mt-3 text-base font-bold">{exercise.title}</h3>
              <p className="text-muted mt-1 text-sm leading-6">{exercise.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="progresso" className="mt-12">
        <h2 id="progresso" className="font-display text-ink text-2xl font-bold">
          Quiz e progresso
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Card className="p-5">
            <span className="bg-accent-soft text-accent flex size-9 items-center justify-center rounded-xl">
              <ListChecks className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-ink mt-3 text-base font-bold">Quiz com explicação</h3>
            <p className="text-muted mt-1 text-sm leading-6">
              Cada lição termina com perguntas de fixação. A correção vem na hora, com o motivo de
              cada resposta.
            </p>
            <Badge variant="accent" className="mt-3">
              +{XP_PER_CORRECT_ANSWER} XP por acerto
            </Badge>
          </Card>
          <Card className="p-5">
            <span className="bg-brand-50 text-brand-700 flex size-9 items-center justify-center rounded-xl">
              <Trophy className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-ink mt-3 text-base font-bold">Progresso sem conta</h3>
            <p className="text-muted mt-1 text-sm leading-6">
              Cada lição concluída após o quiz vale {XP_PER_LESSON} XP. O nível sobe de 1 a 8 e o
              progresso fica no seu navegador, com backup em JSON.
            </p>
            <Badge variant="brand" className="mt-3">
              Sem login e sem coleta de dados
            </Badge>
          </Card>
          <Card className="p-5">
            <span className="bg-warn-soft text-warn flex size-9 items-center justify-center rounded-xl">
              <Target className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-ink mt-3 text-base font-bold">Missões e badges</h3>
            <p className="text-muted mt-1 text-sm leading-6">
              Oito missões práticas com checklist e pergunta de verificação valem 15 XP cada. Doze
              conquistas aparecem conforme lições, quizzes e missões avançam.
            </p>
            <Badge variant="warn" className="mt-3">
              +15 XP por missão
            </Badge>
          </Card>
        </div>
      </section>

      <section aria-labelledby="glossario" className="mt-12">
        <h2 id="glossario" className="font-display text-ink text-2xl font-bold">
          Glossário
        </h2>
        <p className="text-body mt-2 text-sm leading-6">
          Os {glossary.length} termos da trilha estão reunidos no glossário, com busca que ignora
          acentos e filtros por categoria.
        </p>
        <Link
          href="/glossario/"
          className="text-brand-700 hover:text-brand-800 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
        >
          <Search className="size-4" aria-hidden="true" />
          Consultar o glossário
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section aria-labelledby="nao-e" className="mt-12">
        <h2 id="nao-e" className="font-display text-ink text-2xl font-bold">
          O que o Investe Fácil não é
        </h2>
        <ul className="mt-4 space-y-2">
          {notFor.map((item) => (
            <li key={item} className="text-body flex gap-2 text-[17px] leading-8">
              <XCircle className="text-danger mt-1.5 size-4 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="border-warn/25 bg-warn-soft mt-12 rounded-2xl border p-5">
        <p className="font-display text-ink flex items-center gap-2 text-base font-bold">
          <ShieldCheck className="text-warn size-4" aria-hidden="true" />
          Aviso importante
        </p>
        <p className="text-body mt-2 text-sm leading-6">
          Este é um projeto educacional. Nada aqui constitui recomendação, oferta ou consultoria de
          investimentos. Todos os números são ilustrativos e não representam produtos reais.
          Rentabilidades passadas não garantem resultados futuros.
        </p>
      </div>

      <div className="border-line mt-10 flex flex-wrap items-center gap-4 border-t pt-6 text-sm">
        <Link
          href="/trilha/"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
        >
          Começar a trilha
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link href="/simulador/" className="text-brand-700 hover:text-brand-800 font-semibold">
          Abrir o simulador
        </Link>
        <Link href="/missoes/" className="text-brand-700 hover:text-brand-800 font-semibold">
          Ver missões
        </Link>
        <Link href="/glossario/" className="text-brand-700 hover:text-brand-800 font-semibold">
          Consultar o glossário
        </Link>
        <a
          href="https://github.com/henryhgf1/investe-facil"
          className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-2 font-semibold"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
          </svg>
          Código e detalhes técnicos
        </a>
      </div>
    </Container>
  );
}
