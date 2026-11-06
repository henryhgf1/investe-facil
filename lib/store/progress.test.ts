import { beforeEach, describe, expect, it } from "vitest";

import { createInitialSnapshot, migrateProgress, useProgressStore } from "./progress";

function resetStore() {
  localStorage.clear();
  useProgressStore.setState(createInitialSnapshot());
}

describe("progress store", () => {
  beforeEach(resetStore);

  it("não soma XP duas vezes ao concluir a mesma lição", () => {
    const { completeLesson } = useProgressStore.getState();

    completeLesson("juros-compostos", 20);
    completeLesson("juros-compostos", 20);

    expect(useProgressStore.getState().xp).toBe(20);
    expect(useProgressStore.getState().lessons["juros-compostos"]).toBeTruthy();
  });

  it("soma XP de lições diferentes", () => {
    const { completeLesson } = useProgressStore.getState();

    completeLesson("por-que-investir", 20);
    completeLesson("juros-compostos", 20);

    expect(useProgressStore.getState().xp).toBe(40);
  });

  it("premia apenas a melhora no quiz", () => {
    const { recordQuiz } = useProgressStore.getState();

    recordQuiz("inflacao", 2, 4, 5);
    expect(useProgressStore.getState().xp).toBe(10);

    recordQuiz("inflacao", 1, 4, 5);
    expect(useProgressStore.getState().xp).toBe(10);

    recordQuiz("inflacao", 4, 4, 5);
    expect(useProgressStore.getState().xp).toBe(20);
    expect(useProgressStore.getState().quizzes.inflacao).toEqual({ bestScore: 4, total: 4 });
  });

  it("não soma XP duas vezes ao concluir a mesma missão", () => {
    const { completeMission } = useProgressStore.getState();

    completeMission("mapa-do-dinheiro", 15);
    completeMission("mapa-do-dinheiro", 15);

    expect(useProgressStore.getState().xp).toBe(15);
    expect(useProgressStore.getState().missions["mapa-do-dinheiro"]).toBeTruthy();
  });

  it("soma XP de missões diferentes", () => {
    const { completeMission } = useProgressStore.getState();

    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);

    expect(useProgressStore.getState().xp).toBe(30);
  });

  it("exporta e importa o progresso sem perda", () => {
    const { completeLesson, recordQuiz, completeMission, exportProgress, reset, importProgress } =
      useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    completeMission("cesta-de-precos", 15);
    const backup = exportProgress();

    reset();
    expect(useProgressStore.getState().xp).toBe(0);

    expect(importProgress(backup)).toEqual({ ok: true });
    expect(useProgressStore.getState().xp).toBe(50);
    expect(useProgressStore.getState().lessons.inflacao).toBeTruthy();
    expect(useProgressStore.getState().quizzes.inflacao.bestScore).toBe(3);
    expect(useProgressStore.getState().missions["cesta-de-precos"]).toBeTruthy();
  });

  it("importa backup da versão 1 sem missões", () => {
    const { importProgress } = useProgressStore.getState();
    const legacy = JSON.stringify({
      app: "investe-facil",
      version: 1,
      data: {
        xp: 20,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: {},
        badges: [],
      },
    });

    expect(importProgress(legacy)).toEqual({ ok: true });
    expect(useProgressStore.getState().xp).toBe(20);
    expect(useProgressStore.getState().missions).toEqual({});
  });

  it("migra snapshot da versão 1 adicionando missões vazias", () => {
    const migrated = migrateProgress(
      {
        xp: 40,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: {},
        badges: [],
      },
      1,
    );

    expect(migrated.xp).toBe(40);
    expect(migrated.missions).toEqual({});
    expect(migrated.lessons.inflacao).toBeTruthy();
  });

  it("rejeita backup com formato inválido", () => {
    const { importProgress } = useProgressStore.getState();

    expect(importProgress("{ não é json").ok).toBe(false);
    expect(importProgress(JSON.stringify({ app: "outro" })).ok).toBe(false);
  });
});
