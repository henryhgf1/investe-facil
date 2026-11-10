import { ArrowRight, BookOpen, CalendarRange, Clock3, Compass, Gauge, Target } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { glossary } from "@/content/glossary";
import { lessonsOfModule, readyLessons } from "@/content/lessons";
import { missions } from "@/content/missions";
import { modules } from "@/content/modules";
import { projectMonthly } from "@/lib/finance";
import { formatBRL, formatCompactBRL, formatPercent } from "@/lib/utils";

const preview = projectMonthly({ monthly: 200, monthlyRate: 0.008, months: 120 });
const lastPreview = preview[preview.length - 1];
const previewInterest = lastPreview.balance - lastPreview.invested;

const sparkValues = preview.map((point) => point.balance);
const sparkMax = Math.max(...sparkValues);
const sparkPath = sparkValues
  .map((value, index) => {
    const x = (index / (sparkValues.length - 1)) * 100;
    const y = 38 - (value / sparkMax) * 34;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  })
  .join(" L ");

const steps = [
  {
    icon: BookOpen,
    title: "Aprenda em doses curtas",
    description:
      "Lições de 4 a 7 minutos, escritas em português claro. Sem jargão, sem enrolação, com quiz no final para fixar.",
  },
  {
    icon: Gauge,
    title: "Simule antes de arriscar",
    description:
      "Ajuste aporte, taxa e prazo e veja o efeito dos juros compostos em tempo real. Errar aqui custa zero.",
  },
  {
    icon: Target,
    title: "Siga um caminho claro",
    description:
      "Fundamentos, renda fixa e renda variável, na ordem certa. Você sempre sabe qual é o próximo passo.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-line relative overflow-hidden border-b">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
        <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <p className="border-line bg-surface/70 text-body inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              <span className="bg-primary size-1.5 rounded-full" aria-hidden="true" />
              Educação financeira sem jargão
            </p>

            <h1 className="font-display text-ink mt-5 text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Aprenda a investir <span className="text-gradient">sem arriscar</span> dinheiro de
              verdade.
            </h1>

            <p className="text-body mt-6 max-w-xl text-lg leading-8">
              Teoria curta, simuladores interativos e um caminho claro do primeiro aporte à primeira
              carteira diversificada. Feito para quem está começando, de verdade.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/trilha/" className={buttonStyles({ size: "lg" })}>
                Começar pela trilha
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="#como-funciona"
                className={buttonStyles({ variant: "secondary", size: "lg" })}
              >
                Como funciona
              </Link>
            </div>

            <dl className="border-line bg-line mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4">
              {[
                { label: "Módulos", value: modules.length },
                { label: "Lições no ar", value: readyLessons.length },
                { label: "Missões práticas", value: missions.length },
                { label: "Dinheiro em risco", value: "R$ 0" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface/85 px-4 py-3 backdrop-blur">
                  <dt className="text-muted text-xs">{stat.label}</dt>
                  <dd className="font-display text-ink mt-0.5 text-xl font-bold tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Card className="ring-glow relative overflow-hidden p-6 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--primary)_10%,transparent),transparent)]"
            />
            <div className="relative flex items-center justify-between gap-3">
              <Badge variant="neutral">Prévia do simulador</Badge>
              <span className="text-muted text-xs">dados ilustrativos</span>
            </div>

            <p className="text-muted relative mt-6 text-sm">Saldo simulado em 10 anos</p>
            <p className="font-display text-ink relative mt-1 text-4xl font-extrabold tabular-nums">
              {formatBRL(lastPreview.balance)}
            </p>
            <p className="text-brand-700 relative mt-1 text-sm">
              +{formatPercent((previewInterest / lastPreview.invested) * 100, 0)} sobre o valor
              investido
            </p>

            <div className="relative mt-6">
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="h-24 w-full"
              >
                <defs>
                  <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M ${sparkPath} L 100,40 L 0,40 Z`} fill="url(#hero-fill)" />
                <path
                  d={`M ${sparkPath}`}
                  fill="none"
                  stroke="var(--chart-1)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <dl className="border-line relative mt-2 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
              <div>
                <dt className="text-muted">Você investiu</dt>
                <dd className="text-ink font-semibold tabular-nums">
                  {formatCompactBRL(lastPreview.invested)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Juros compostos</dt>
                <dd className="text-brand-700 font-semibold tabular-nums">
                  {formatCompactBRL(previewInterest)}
                </dd>
              </div>
            </dl>

            <p className="bg-surface-2 text-muted relative mt-4 rounded-lg px-3 py-2 text-xs leading-5">
              R$ 200 por mês a 0,8% ao mês. Rentabilidade passada não garante resultado futuro.
            </p>
          </Card>
        </Container>
      </section>

      <section id="como-funciona" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-brand-700 mb-2 text-xs font-bold tracking-widest uppercase">
              Como funciona
            </p>
            <h2 className="font-display text-ink text-3xl font-bold">
              Três passos, nenhum atalho mágico
            </h2>
            <p className="text-muted mt-3 text-base leading-7">
              O Investe Fácil foi desenhado para quem nunca investiu: primeiro entender, depois
              experimentar, só então decidir.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} className="p-6">
                <span className="bg-brand-50 text-brand-700 flex size-11 items-center justify-center rounded-xl">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-muted mt-5 text-xs font-bold tracking-widest uppercase">
                  Passo {index + 1}
                </p>
                <h3 className="font-display text-ink mt-1 text-lg font-bold">{step.title}</h3>
                <p className="text-muted mt-2 text-sm leading-6">{step.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-line bg-surface border-y py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-brand-700 mb-2 text-xs font-bold tracking-widest uppercase">
                A trilha
              </p>
              <h2 className="font-display text-ink text-3xl font-bold">
                Do zero à primeira carteira
              </h2>
              <p className="text-muted mt-3 text-base leading-7">
                Cada lição termina com um quiz, e a maioria traz um simulador para testar a ideia.
                As {readyLessons.length} lições da trilha já estão no ar.
              </p>
            </div>
            <Link
              href="/trilha/"
              className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Ver trilha completa
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {modules.map((module) => {
              const moduleLessons = lessonsOfModule(module.id);
              const ready = moduleLessons.filter((lesson) => lesson.status === "ready").length;

              return (
                <Card key={module.id} className="flex flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted font-mono text-xs font-bold">
                      MÓDULO {String(module.order).padStart(2, "0")}
                    </span>
                    <Badge variant={ready === moduleLessons.length ? "brand" : "outline"}>
                      {ready === moduleLessons.length
                        ? "completo"
                        : `${ready} de ${moduleLessons.length} no ar`}
                    </Badge>
                  </div>

                  <h3 className="font-display text-ink mt-4 text-xl font-bold">{module.title}</h3>
                  <p className="text-muted mt-2 flex-1 text-sm leading-6">{module.description}</p>

                  <ul className="border-line mt-5 space-y-1.5 border-t pt-4 text-sm">
                    {moduleLessons.slice(0, 3).map((lesson) => (
                      <li key={lesson.slug} className="text-body flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={
                            lesson.status === "ready"
                              ? "bg-brand-600 size-1.5 rounded-full"
                              : "bg-line-strong size-1.5 rounded-full"
                          }
                        />
                        {lesson.title}
                      </li>
                    ))}
                  </ul>

                  <p className="text-muted mt-4 inline-flex items-center gap-1.5 text-xs">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {moduleLessons.reduce((sum, lesson) => sum + lesson.durationMin, 0)} min de
                    leitura
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="border-line bg-canvas mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-4">
            <p className="text-muted text-sm">
              Encontrou uma sigla desconhecida? O glossário explica {glossary.length} termos em
              português claro, com busca que ignora acentos.
            </p>
            <Link
              href="/glossario/"
              className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-2 text-sm font-semibold"
            >
              Abrir o glossário
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-line border-t py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="text-brand-700 mb-2 text-xs font-bold tracking-widest uppercase">
              Pratique sem risco
            </p>
            <h2 className="font-display text-ink text-3xl font-bold">
              Duas formas de aprender fazendo
            </h2>
            <p className="text-muted mt-3 text-base leading-7">
              Depois da teoria, use os números a seu favor: volte no tempo com dados reais de
              mercado ou leve o aprendizado para uma tarefa concreta do dia a dia.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Link href="/simulador/" className="group">
              <Card className="group-hover:border-brand-600/40 group-hover:shadow-card-hover h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5">
                <span className="bg-brand-50 text-brand-700 flex size-11 items-center justify-center rounded-xl">
                  <CalendarRange className="size-5" aria-hidden="true" />
                </span>
                <Badge variant="brand" className="mt-4">
                  Simulador histórico
                </Badge>
                <h3 className="font-display text-ink mt-2 text-xl font-bold">Máquina do tempo</h3>
                <p className="text-muted mt-2 text-sm leading-6">
                  Compare CDI, Ibovespa e inflação de 2000 a 2024 com os seus aportes e veja como o
                  tempo muda o resultado.
                </p>
                <span className="text-brand-700 mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Abrir o simulador
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>

            <Link href="/missoes/" className="group">
              <Card className="group-hover:border-brand-600/40 group-hover:shadow-card-hover h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5">
                <span className="bg-warn-soft text-warn flex size-11 items-center justify-center rounded-xl">
                  <Target className="size-5" aria-hidden="true" />
                </span>
                <Badge variant="warn" className="mt-4">
                  Prática
                </Badge>
                <h3 className="font-display text-ink mt-2 text-xl font-bold">
                  Missões e conquistas
                </h3>
                <p className="text-muted mt-2 text-sm leading-6">
                  Oito missões curtas para aplicar o conteúdo na vida real, com checklist, pergunta
                  de verificação, XP e badges que acompanham o seu progresso.
                </p>
                <span className="text-brand-700 mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Ver missões
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Card className="border-brand-600/20 from-cta-from to-cta-to text-cta-ink shadow-card overflow-hidden bg-linear-to-br p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div>
                <p className="text-cta-muted inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Compass className="size-4" aria-hidden="true" />
                  Comece agora
                </p>
                <h2 className="font-display mt-3 text-3xl font-bold">
                  Seu primeiro investimento começa com uma pergunta simples.
                </h2>
                <p className="text-cta-muted mt-3 max-w-xl text-base leading-7">
                  Quanto tempo você quer esperar? A resposta muda tudo. Comece pela lição de juros
                  compostos e veja o efeito na prática.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/trilha/fundamentos/juros-compostos/"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "bg-cta-ink text-cta-from hover:bg-cta-muted w-full justify-center border-white/25",
                  })}
                >
                  Abrir a lição
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/trilha/"
                  className="text-cta-ink inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  Ver todos os módulos
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
