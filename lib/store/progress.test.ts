import { beforeEach, describe, expect, it } from "vitest";

import { createInitialSnapshot, useProgressStore } from "./progress";

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

  it("exporta e importa o progresso sem perda", () => {
    const { completeLesson, recordQuiz, exportProgress, reset, importProgress } =
      useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    const backup = exportProgress();

    reset();
    expect(useProgressStore.getState().xp).toBe(0);

    expect(importProgress(backup)).toEqual({ ok: true });
    expect(useProgressStore.getState().xp).toBe(35);
    expect(useProgressStore.getState().lessons.inflacao).toBeTruthy();
    expect(useProgressStore.getState().quizzes.inflacao.bestScore).toBe(3);
  });

  it("rejeita backup com formato inválido", () => {
    const { importProgress } = useProgressStore.getState();

    expect(importProgress("{ não é json").ok).toBe(false);
    expect(importProgress(JSON.stringify({ app: "outro" })).ok).toBe(false);
  });
});
