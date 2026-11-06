import { levelForXp, MAX_LEVEL, MAX_XP } from "./xp";

export type BadgeProgress = {
  xp: number;
  lessons: Record<string, unknown>;
  quizzes: Record<string, { bestScore: number; total: number }>;
  missions: Record<string, unknown>;
};

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  /** Dica de como conquistar a badge, exibida quando ela ainda não foi ganha. */
  hint: string;
  accent: "brand" | "accent" | "warn";
  earned: (progress: BadgeProgress) => boolean;
};

export type BadgeStatus = Omit<BadgeDefinition, "earned"> & { earned: boolean };

function lessonCount(progress: BadgeProgress) {
  return Object.keys(progress.lessons).length;
}

function missionCount(progress: BadgeProgress) {
  return Object.keys(progress.missions).length;
}

function quizCount(progress: BadgeProgress) {
  return Object.keys(progress.quizzes).length;
}

function hasPerfectQuiz(progress: BadgeProgress) {
  return Object.values(progress.quizzes).some(
    (quiz) => quiz.total > 0 && quiz.bestScore >= quiz.total,
  );
}

export const badges: BadgeDefinition[] = [
  {
    id: "primeiro-passo",
    title: "Primeiro passo",
    description: "Você concluiu a primeira lição da trilha.",
    hint: "Conclua uma lição para começar.",
    accent: "brand",
    earned: (progress) => lessonCount(progress) >= 1,
  },
  {
    id: "curioso",
    title: "Curioso de plantão",
    description: "Três lições concluídas. O hábito está pegando.",
    hint: "Conclua três lições.",
    accent: "brand",
    earned: (progress) => lessonCount(progress) >= 3,
  },
  {
    id: "trilha-concluida",
    title: "Trilha completa",
    description: "As dez lições publicadas foram concluídas.",
    hint: "Conclua todas as lições da trilha.",
    accent: "brand",
    earned: (progress) => lessonCount(progress) >= 10,
  },
  {
    id: "nota-dez",
    title: "Nota dez",
    description: "Você acertou todas as perguntas de um quiz.",
    hint: "Acerte 100% de um quiz.",
    accent: "accent",
    earned: hasPerfectQuiz,
  },
  {
    id: "mente-fria",
    title: "Mente fria",
    description: "Cinco quizzes respondidos, sem pular nenhum.",
    hint: "Responda cinco quizzes diferentes.",
    accent: "accent",
    earned: (progress) => quizCount(progress) >= 5,
  },
  {
    id: "hora-extra",
    title: "Hora extra",
    description: "A primeira missão prática foi cumprida.",
    hint: "Conclua uma missão prática.",
    accent: "warn",
    earned: (progress) => missionCount(progress) >= 1,
  },
  {
    id: "mao-na-massa",
    title: "Mão na massa",
    description: "Quatro missões práticas concluídas.",
    hint: "Conclua quatro missões práticas.",
    accent: "warn",
    earned: (progress) => missionCount(progress) >= 4,
  },
  {
    id: "praticante",
    title: "Praticante",
    description: "Todas as oito missões práticas foram concluídas.",
    hint: "Conclua todas as missões práticas.",
    accent: "warn",
    earned: (progress) => missionCount(progress) >= 8,
  },
  {
    id: "nivel-4",
    title: "Nível 4",
    description: "Você chegou ao quarto nível de experiência.",
    hint: "Acumule XP para chegar ao nível 4.",
    accent: "brand",
    earned: (progress) => levelForXp(progress.xp).level >= 4,
  },
  {
    id: "nivel-6",
    title: "Nível 6",
    description: "Você chegou ao sexto nível de experiência.",
    hint: "Acumule XP para chegar ao nível 6.",
    accent: "accent",
    earned: (progress) => levelForXp(progress.xp).level >= 6,
  },
  {
    id: "nivel-maximo",
    title: "Nível máximo",
    description: `Você chegou ao nível ${MAX_LEVEL}, o topo da trilha.`,
    hint: `Acumule ${MAX_XP} XP para chegar ao nível ${MAX_LEVEL}.`,
    accent: "brand",
    earned: (progress) => levelForXp(progress.xp).level >= MAX_LEVEL,
  },
  {
    id: "investidor-completo",
    title: "Investidor completo",
    description: "Todo o XP disponível na trilha foi conquistado.",
    hint: `Conquiste os ${MAX_XP} XP disponíveis.`,
    accent: "brand",
    earned: (progress) => progress.xp >= MAX_XP,
  },
];

export function badgeStatus(progress: BadgeProgress): BadgeStatus[] {
  return badges.map(({ earned, ...badge }) => ({ ...badge, earned: earned(progress) }));
}

export function earnedBadges(progress: BadgeProgress): BadgeStatus[] {
  return badgeStatus(progress).filter((badge) => badge.earned);
}

export function earnedBadgeCount(progress: BadgeProgress) {
  return earnedBadges(progress).length;
}

export function nextBadge(progress: BadgeProgress): BadgeStatus | null {
  return badgeStatus(progress).find((badge) => !badge.earned) ?? null;
}
