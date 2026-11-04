import type { ModuleId } from "./modules";

export type LessonStatus = "ready" | "soon";

export type LessonMeta = {
  slug: string;
  module: ModuleId;
  order: number;
  title: string;
  summary: string;
  durationMin: number;
  status: LessonStatus;
  /** Slug da lição que precisa ser concluída antes desta. */
  requires?: string;
};

export const lessons: LessonMeta[] = [
  {
    slug: "por-que-investir",
    module: "fundamentos",
    order: 1,
    title: "Por que investir (e não só guardar)",
    summary:
      "Guardar dinheiro protege do impulso. Investir protege do tempo. A diferença está no que acontece enquanto você dorme.",
    durationMin: 4,
    status: "ready",
  },
  {
    slug: "juros-compostos",
    module: "fundamentos",
    order: 2,
    title: "Juros compostos: o motor dos investimentos",
    summary:
      "A conta que faz R$ 200 por mês virarem mais de R$ 40 mil. E por que começar cedo importa mais do que acertar a taxa.",
    durationMin: 6,
    status: "ready",
    requires: "por-que-investir",
  },
  {
    slug: "inflacao",
    module: "fundamentos",
    order: 3,
    title: "Inflação: o ladrão silencioso",
    summary:
      "R$ 1.000 parados não perdem valor no extrato — mas perdem poder de compra. Aprenda a calcular o ganho que realmente importa.",
    durationMin: 6,
    status: "ready",
    requires: "juros-compostos",
  },
  {
    slug: "risco-e-retorno",
    module: "fundamentos",
    order: 4,
    title: "Risco e retorno: não existe almoço grátis",
    summary:
      "Todo retorno acima da média vem com uma dose de incerteza. Aprenda a nomear o risco antes de aceitá-lo.",
    durationMin: 5,
    status: "soon",
    requires: "inflacao",
  },
  {
    slug: "cdi-selic-tesouro",
    module: "renda-fixa",
    order: 1,
    title: "CDI, Selic e Tesouro Direto",
    summary:
      "As três siglas que aparecem em todo lugar, explicadas sem jargão: quem paga, para quem e por quê.",
    durationMin: 6,
    status: "soon",
  },
  {
    slug: "cdb-lci-lca",
    module: "renda-fixa",
    order: 2,
    title: "CDB, LCI e LCA: o que muda de verdade",
    summary:
      "Rentabilidade, liquidez e o FGC. Como comparar produtos que parecem iguais mas não são.",
    durationMin: 6,
    status: "soon",
    requires: "cdi-selic-tesouro",
  },
  {
    slug: "ir-iof-liquidez",
    module: "renda-fixa",
    order: 3,
    title: "IR, IOF e liquidez: o que sobra no seu bolso",
    summary:
      "A tabela regressiva do Imposto de Renda e o IOF dos primeiros 30 dias explicam por que resgatar cedo pode custar caro.",
    durationMin: 5,
    status: "soon",
    requires: "cdb-lci-lca",
  },
  {
    slug: "o-que-e-uma-acao",
    module: "renda-variavel",
    order: 1,
    title: "O que é uma ação, afinal",
    summary:
      "Comprar uma ação é virar sócio de um negócio. Entenda o que você ganha, o que você arrisca e o que a bolsa não é.",
    durationMin: 6,
    status: "soon",
  },
  {
    slug: "dividendos-fiis-etfs",
    module: "renda-variavel",
    order: 2,
    title: "Dividendos, FIIs e ETFs",
    summary:
      "Três formas diferentes de receber dinheiro de empresas e imóveis — e o que cada uma exige de você.",
    durationMin: 7,
    status: "soon",
    requires: "o-que-e-uma-acao",
  },
  {
    slug: "diversificacao",
    module: "renda-variavel",
    order: 3,
    title: "Diversificação e os erros de iniciante",
    summary: "Concentrar parece ousado, diversificar parece chato. Os dados dizem o contrário.",
    durationMin: 6,
    status: "soon",
    requires: "dividendos-fiis-etfs",
  },
];

export const readyLessons = lessons.filter((lesson) => lesson.status === "ready");

export function getLesson(moduleId: string, slug: string) {
  return lessons.find((lesson) => lesson.module === moduleId && lesson.slug === slug);
}

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function lessonsOfModule(moduleId: ModuleId) {
  return lessons.filter((lesson) => lesson.module === moduleId).sort((a, b) => a.order - b.order);
}

export function lessonPath(lesson: Pick<LessonMeta, "module" | "slug">) {
  return `/trilha/${lesson.module}/${lesson.slug}/`;
}

export function nextReadyLesson(slug: string) {
  const index = readyLessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return null;
  return readyLessons[index + 1] ?? null;
}

export function previousReadyLesson(slug: string) {
  const index = readyLessons.findIndex((lesson) => lesson.slug === slug);
  if (index <= 0) return null;
  return readyLessons[index - 1] ?? null;
}
