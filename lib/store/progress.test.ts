import { beforeEach, describe, expect, it } from "vitest";

import { createInitialSnapshot, migrateProgress, useProgressStore } from "./progress";

function resetStore() {
  localStorage.clear();
  useProgressStore.setState(createInitialSnapshot());
}

function createProfile() {
  useProgressStore.getState().saveProfile("Henry", "folha");
}

describe("progress store", () => {
  beforeEach(resetStore);

  it("bloqueia lição, quiz e missão sem perfil", () => {
    const { completeLesson, recordQuiz, completeMission } = useProgressStore.getState();

    completeLesson("juros-compostos", 20);
    recordQuiz("inflacao", 2, 4, 5);
    completeMission("mapa-do-dinheiro", 15);

    expect(useProgressStore.getState().xp).toBe(0);
    expect(useProgressStore.getState().lessons).toEqual({});
    expect(useProgressStore.getState().quizzes).toEqual({});
    expect(useProgressStore.getState().missions).toEqual({});
  });

  it("cria e edita o perfil mantendo a data de criação", () => {
    createProfile();

    const created = useProgressStore.getState().profile;
    expect(created?.name).toBe("Henry");
    expect(created?.avatarId).toBe("folha");

    useProgressStore.getState().saveProfile("  Henry GF  ", "foguete");

    const edited = useProgressStore.getState().profile;
    expect(edited?.name).toBe("Henry GF");
    expect(edited?.avatarId).toBe("foguete");
    expect(edited?.createdAt).toBe(created?.createdAt);
  });

  it("ignora nome vazio ao salvar o perfil", () => {
    useProgressStore.getState().saveProfile("   ", "folha");

    expect(useProgressStore.getState().profile).toBeNull();
  });

  it("não soma XP duas vezes ao concluir a mesma lição", () => {
    createProfile();
    const { completeLesson } = useProgressStore.getState();

    completeLesson("juros-compostos", 20);
    completeLesson("juros-compostos", 20);

    expect(useProgressStore.getState().xp).toBe(20);
    expect(useProgressStore.getState().lessons["juros-compostos"]).toBeTruthy();
  });

  it("soma XP de lições diferentes", () => {
    createProfile();
    const { completeLesson } = useProgressStore.getState();

    completeLesson("por-que-investir", 20);
    completeLesson("juros-compostos", 20);

    expect(useProgressStore.getState().xp).toBe(40);
  });

  it("premia apenas a melhora no quiz", () => {
    createProfile();
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
    createProfile();
    const { completeMission } = useProgressStore.getState();

    completeMission("mapa-do-dinheiro", 15);
    completeMission("mapa-do-dinheiro", 15);

    expect(useProgressStore.getState().xp).toBe(15);
    expect(useProgressStore.getState().missions["mapa-do-dinheiro"]).toBeTruthy();
  });

  it("soma XP de missões diferentes", () => {
    createProfile();
    const { completeMission } = useProgressStore.getState();

    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);

    expect(useProgressStore.getState().xp).toBe(30);
  });

  it("apaga uma missão e recalcula o XP", () => {
    createProfile();
    const { completeLesson, completeMission, resetMission } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);
    expect(useProgressStore.getState().xp).toBe(50);

    resetMission("mapa-do-dinheiro");

    expect(useProgressStore.getState().missions["mapa-do-dinheiro"]).toBeUndefined();
    expect(useProgressStore.getState().missions["teste-do-tempo"]).toBeTruthy();
    expect(useProgressStore.getState().lessons.inflacao).toBeTruthy();
    expect(useProgressStore.getState().xp).toBe(35);
  });

  it("apaga uma lição junto com o resultado do quiz", () => {
    createProfile();
    const { completeLesson, recordQuiz, resetLesson } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    expect(useProgressStore.getState().xp).toBe(35);

    resetLesson("inflacao");

    expect(useProgressStore.getState().lessons.inflacao).toBeUndefined();
    expect(useProgressStore.getState().quizzes.inflacao).toBeUndefined();
    expect(useProgressStore.getState().xp).toBe(0);
  });

  it("apaga todas as missões mantendo a trilha e o perfil", () => {
    createProfile();
    const { completeLesson, completeMission, resetMissions } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);

    resetMissions();

    expect(useProgressStore.getState().missions).toEqual({});
    expect(useProgressStore.getState().lessons.inflacao).toBeTruthy();
    expect(useProgressStore.getState().profile).not.toBeNull();
    expect(useProgressStore.getState().xp).toBe(20);
  });

  it("apaga a trilha mantendo as missões e o perfil", () => {
    createProfile();
    const { completeLesson, recordQuiz, completeMission, resetTrail } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    completeMission("mapa-do-dinheiro", 15);

    resetTrail();

    expect(useProgressStore.getState().lessons).toEqual({});
    expect(useProgressStore.getState().quizzes).toEqual({});
    expect(useProgressStore.getState().missions["mapa-do-dinheiro"]).toBeTruthy();
    expect(useProgressStore.getState().profile).not.toBeNull();
    expect(useProgressStore.getState().xp).toBe(15);
  });

  it("apaga todo o progresso sem apagar o perfil", () => {
    createProfile();
    const { completeLesson, recordQuiz, completeMission, resetProgress } =
      useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    completeMission("mapa-do-dinheiro", 15);

    resetProgress();

    expect(useProgressStore.getState().xp).toBe(0);
    expect(useProgressStore.getState().lessons).toEqual({});
    expect(useProgressStore.getState().quizzes).toEqual({});
    expect(useProgressStore.getState().missions).toEqual({});
    expect(useProgressStore.getState().profile?.name).toBe("Henry");
  });

  it("exporta e importa o progresso e o perfil sem perda", () => {
    createProfile();
    const {
      completeLesson,
      recordQuiz,
      completeMission,
      exportProgress,
      resetProgress,
      importProgress,
    } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    completeMission("cesta-de-precos", 15);
    const backup = exportProgress();

    resetProgress();
    expect(useProgressStore.getState().xp).toBe(0);
    expect(useProgressStore.getState().profile?.name).toBe("Henry");

    expect(importProgress(backup)).toEqual({ ok: true });
    expect(useProgressStore.getState().xp).toBe(50);
    expect(useProgressStore.getState().lessons.inflacao).toBeTruthy();
    expect(useProgressStore.getState().quizzes.inflacao.bestScore).toBe(3);
    expect(useProgressStore.getState().missions["cesta-de-precos"]).toBeTruthy();
    expect(useProgressStore.getState().profile?.avatarId).toBe("folha");
  });

  it("importa backup da versão 1 sem missões e mantém o perfil atual", () => {
    createProfile();
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
    expect(useProgressStore.getState().profile?.name).toBe("Henry");
  });

  it("importa backup da versão 3 restaurando o perfil", () => {
    const { importProgress } = useProgressStore.getState();
    const backup = JSON.stringify({
      app: "investe-facil",
      version: 3,
      data: {
        xp: 20,
        lessons: {},
        quizzes: {},
        missions: {},
        badges: [],
        profile: {
          name: "Ana",
          avatarId: "bussola",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      },
    });

    expect(importProgress(backup)).toEqual({ ok: true });
    expect(useProgressStore.getState().profile?.name).toBe("Ana");
    expect(useProgressStore.getState().profile?.avatarId).toBe("bussola");
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
    expect(migrated.profile).toBeNull();
  });

  it("migra snapshot da versão 2 preservando o progresso sem perfil", () => {
    const migrated = migrateProgress(
      {
        xp: 35,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: { inflacao: { bestScore: 3, total: 4 } },
        missions: { "mapa-do-dinheiro": { completedAt: "2026-01-01T00:00:00.000Z" } },
        badges: [],
      },
      2,
    );

    expect(migrated.xp).toBe(35);
    expect(migrated.quizzes.inflacao.bestScore).toBe(3);
    expect(migrated.missions["mapa-do-dinheiro"]).toBeTruthy();
    expect(migrated.profile).toBeNull();
  });

  it("rejeita backup com formato inválido", () => {
    const { importProgress } = useProgressStore.getState();

    expect(importProgress("{ não é json").ok).toBe(false);
    expect(importProgress(JSON.stringify({ app: "outro" })).ok).toBe(false);
  });
});
