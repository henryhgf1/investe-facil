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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(15,107,79,0.10),transparent_70%)]"
        />
        <Container className="relative grid gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <h1 className="font-display text-ink text-4xl leading-[1.05] font-extrabold sm:text-5xl">
              Aprenda a investir{" "}
              <span className="text-brand-700 relative whitespace-nowrap">
                sem arriscar
                <span
                  aria-hidden="true"
                  className="bg-brand-200 absolute bottom-[0.07em] left-0 h-1.5 w-full rounded-full"
                />
              </span>{" "}
              dinheiro de verdade.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
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

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-muted">Módulos</dt>
                <dd className="font-display text-ink text-xl font-bold">{modules.length}</dd>
              </div>
              <div>
                <dt className="text-muted">Lições no ar</dt>
                <dd className="font-display text-ink text-xl font-bold">{readyLessons.length}</dd>
              </div>
              <div>
                <dt className="text-muted">Missões práticas</dt>
                <dd className="font-display text-ink text-xl font-bold">{missions.length}</dd>
              </div>
              <div>
                <dt className="text-muted">Dinheiro em risco</dt>
                <dd className="font-display text-brand-700 text-xl font-bold">R$ 0</dd>
              </div>
            </dl>
          </div>

          <Card className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="neutral">Prévia do simulador</Badge>
              <span className="text-muted text-xs">dados ilustrativos</span>
            </div>

            <p className="text-muted mt-6 text-sm">Saldo simulado em 10 anos</p>
            <p className="font-display text-ink mt-1 text-4xl font-extrabold tabular-nums">
              {formatBRL(lastPreview.balance)}
            </p>
            <p className="text-brand-700 mt-1 text-sm">
              +{formatPercent((previewInterest / lastPreview.invested) * 100, 0)} sobre o valor
              investido
            </p>

            <div className="mt-6">
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="h-24 w-full"
              >
                <defs>
                  <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f6b4f" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0f6b4f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M ${sparkPath} L 100,40 L 0,40 Z`} fill="url(#hero-fill)" />
                <path
                  d={`M ${sparkPath}`}
                  fill="none"
                  stroke="#0f6b4f"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <dl className="border-line mt-2 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
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

            <p className="bg-canvas text-muted mt-4 rounded-lg px-3 py-2 text-xs leading-5">
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

      <section className="border-line border-y bg-white py-16 sm:py-20">
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
                      <li key={lesson.slug} className="flex items-center gap-2 text-slate-600">
                        <span
                          aria-hidden="true"
                          className={
                            lesson.status === "ready"
                              ? "bg-brand-600 size-1.5 rounded-full"
                              : "size-1.5 rounded-full bg-slate-300"
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
              <Card className="group-hover:border-brand-600/40 h-full p-6 transition-colors">
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
              <Card className="group-hover:border-brand-600/40 h-full p-6 transition-colors">
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
          <Card className="border-brand-600/15 from-brand-800 to-brand-600 overflow-hidden bg-linear-to-br p-8 text-white sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div>
                <p className="text-brand-100 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Compass className="size-4" aria-hidden="true" />
                  Comece agora
                </p>
                <h2 className="font-display mt-3 text-3xl font-bold">
                  Seu primeiro investimento começa com uma pergunta simples.
                </h2>
                <p className="text-brand-50 mt-3 max-w-xl text-base leading-7">
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
                    className: "w-full justify-center",
                  })}
                >
                  Abrir a lição
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/trilha/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
