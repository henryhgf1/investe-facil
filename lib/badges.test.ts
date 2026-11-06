import { describe, expect, it } from "vitest";

import {
  badgeStatus,
  badges,
  earnedBadgeCount,
  earnedBadges,
  nextBadge,
  type BadgeProgress,
} from "./badges";

function progress(overrides: Partial<BadgeProgress> = {}): BadgeProgress {
  return { xp: 0, lessons: {}, quizzes: {}, missions: {}, ...overrides };
}

function lessons(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `licao-${index}`,
      { completedAt: "2026-01-01T00:00:00.000Z" },
    ]),
  );
}

function missions(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `missao-${index}`,
      { completedAt: "2026-01-01T00:00:00.000Z" },
    ]),
  );
}

describe("badges", () => {
  it("não entrega nenhuma badge sem progresso", () => {
    expect(earnedBadges(progress())).toHaveLength(0);
    expect(earnedBadgeCount(progress())).toBe(0);
  });

  it("entrega a primeira badge ao concluir uma lição", () => {
    const earned = earnedBadges(progress({ lessons: lessons(1) }));

    expect(earned.map((badge) => badge.id)).toEqual(["primeiro-passo"]);
  });

  it("reconhece quiz perfeito apenas quando acerta tudo", () => {
    const quase = progress({ quizzes: { inflacao: { bestScore: 3, total: 4 } } });
    const perfeito = progress({ quizzes: { inflacao: { bestScore: 4, total: 4 } } });

    expect(earnedBadges(quase).some((badge) => badge.id === "nota-dez")).toBe(false);
    expect(earnedBadges(perfeito).some((badge) => badge.id === "nota-dez")).toBe(true);
  });

  it("acompanha o número de missões concluídas", () => {
    expect(earnedBadges(progress({ missions: missions(1) })).map((badge) => badge.id)).toContain(
      "hora-extra",
    );
    expect(earnedBadges(progress({ missions: missions(4) })).map((badge) => badge.id)).toContain(
      "mao-na-massa",
    );
    expect(earnedBadges(progress({ missions: missions(8) })).map((badge) => badge.id)).toContain(
      "praticante",
    );
  });

  it("marca o nível máximo e o XP completo", () => {
    const earned = earnedBadges(progress({ xp: 480 })).map((badge) => badge.id);

    expect(earned).toContain("nivel-maximo");
    expect(earned).toContain("investidor-completo");
  });

  it("mantém todas as badges com id único", () => {
    const ids = badges.map((badge) => badge.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("devolve o status de cada badge e a próxima a conquistar", () => {
    const status = badgeStatus(progress());
    expect(status).toHaveLength(badges.length);
    expect(status.every((badge) => !badge.earned)).toBe(true);
    expect(nextBadge(progress())?.id).toBe("primeiro-passo");
  });

  it("não sugere nova badge quando todas foram conquistadas", () => {
    const completo = progress({
      xp: 480,
      lessons: lessons(10),
      missions: missions(8),
      quizzes: Object.fromEntries(
        Array.from({ length: 5 }, (_, index) => [`quiz-${index}`, { bestScore: 4, total: 4 }]),
      ),
    });

    expect(nextBadge(completo)).toBeNull();
  });
});
