import { beforeEach, describe, expect, it } from "vitest";

import {
  createEmptyProgress,
  createInitialSnapshot,
  getActiveProfile,
  MAX_PROFILES,
  migrateProgress,
  useProgressStore,
} from "./progress";

function resetStore() {
  localStorage.clear();
  useProgressStore.setState(createInitialSnapshot());
}

function activeProfile() {
  return getActiveProfile(useProgressStore.getState());
}

function createProfile(name = "Henry", avatarId = "folha") {
  const result = useProgressStore.getState().createProfile(name, avatarId);
  if (!result.ok) throw new Error(result.error);
  return result.profileId;
}

describe("progress store", () => {
  beforeEach(resetStore);

  it("bloqueia lição, quiz e missão sem perfil", () => {
    const { completeLesson, recordQuiz, completeMission } = useProgressStore.getState();

    completeLesson("juros-compostos", 20);
    recordQuiz("inflacao", 2, 4, 5);
    completeMission("mapa-do-dinheiro", 15);

    expect(useProgressStore.getState().profiles).toEqual([]);
    expect(useProgressStore.getState().pendingProgress).toBeNull();
  });

  it("cria e edita o perfil mantendo a data de criação", () => {
    createProfile("Henry", "folha");

    const created = activeProfile();
    expect(created?.name).toBe("Henry");
    expect(created?.avatarId).toBe("folha");

    const result = useProgressStore.getState().updateProfile("  Henry GF  ", "foguete");
    expect(result.ok).toBe(true);

    const edited = activeProfile();
    expect(edited?.name).toBe("Henry GF");
    expect(edited?.avatarId).toBe("foguete");
    expect(edited?.createdAt).toBe(created?.createdAt);
    expect(useProgressStore.getState().profiles).toHaveLength(1);
  });

  it("rejeita nome curto, vazio e repetido sem diferenciar maiúsculas", () => {
    createProfile("Henry");

    expect(useProgressStore.getState().createProfile("  ", "folha").ok).toBe(false);
    expect(useProgressStore.getState().createProfile("A", "folha").ok).toBe(false);
    expect(useProgressStore.getState().createProfile("henry", "folha").ok).toBe(false);
    expect(useProgressStore.getState().profiles).toHaveLength(1);
  });

  it("limita a três perfis por navegador", () => {
    createProfile("Ana");
    createProfile("Bruno");
    createProfile("Carla");

    const result = useProgressStore.getState().createProfile("Diego", "folha");

    expect(result.ok).toBe(false);
    expect(useProgressStore.getState().profiles).toHaveLength(MAX_PROFILES);
  });

  it("mantém o progresso isolado por perfil", () => {
    createProfile("Ana");
    useProgressStore.getState().completeLesson("juros-compostos", 20);
    useProgressStore.getState().recordQuiz("inflacao", 2, 4, 5);

    createProfile("Bruno");
    useProgressStore.getState().completeMission("mapa-do-dinheiro", 15);

    expect(activeProfile()?.name).toBe("Bruno");
    expect(activeProfile()?.xp).toBe(15);
    expect(activeProfile()?.lessons).toEqual({});
    expect(activeProfile()?.quizzes).toEqual({});

    const ana = useProgressStore.getState().profiles.find((profile) => profile.name === "Ana");
    expect(ana?.xp).toBe(30);
    expect(ana?.lessons["juros-compostos"]).toBeTruthy();
    expect(ana?.quizzes.inflacao.bestScore).toBe(2);
    expect(ana?.missions).toEqual({});
  });

  it("adota o progresso pendente no primeiro perfil criado", () => {
    useProgressStore.setState({
      ...createInitialSnapshot(),
      pendingProgress: {
        xp: 40,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: {},
        missions: {},
        badges: [],
      },
    });

    createProfile("Ana");

    expect(activeProfile()?.xp).toBe(40);
    expect(activeProfile()?.lessons.inflacao).toBeTruthy();
    expect(useProgressStore.getState().pendingProgress).toBeNull();

    createProfile("Bruno");
    expect(activeProfile()?.xp).toBe(0);
  });

  it("apaga o perfil ativo e ativa o próximo da lista", () => {
    createProfile("Ana");
    const bruno = createProfile("Bruno");
    createProfile("Carla");

    useProgressStore.getState().switchProfile(bruno);
    expect(activeProfile()?.name).toBe("Bruno");

    useProgressStore.getState().deleteProfile(bruno);

    expect(useProgressStore.getState().profiles.map((profile) => profile.name)).toEqual([
      "Ana",
      "Carla",
    ]);
    expect(activeProfile()?.name).toBe("Carla");
  });

  it("apaga o último perfil e volta ao estado sem perfil", () => {
    const ana = createProfile("Ana");

    useProgressStore.getState().deleteProfile(ana);

    expect(useProgressStore.getState().profiles).toEqual([]);
    expect(useProgressStore.getState().activeProfileId).toBeNull();

    useProgressStore.getState().completeLesson("inflacao", 20);
    expect(useProgressStore.getState().profiles).toEqual([]);
  });

  it("reseta apenas o progresso do perfil ativo", () => {
    createProfile("Ana");
    useProgressStore.getState().completeLesson("inflacao", 20);
    useProgressStore.getState().completeMission("mapa-do-dinheiro", 15);

    createProfile("Bruno");
    useProgressStore.getState().completeLesson("juros-compostos", 20);

    const ana = useProgressStore.getState().profiles.find((profile) => profile.name === "Ana");
    if (!ana) throw new Error("perfil Ana não encontrado");

    useProgressStore.getState().switchProfile(ana.id);
    useProgressStore.getState().resetProgress();

    expect(activeProfile()?.name).toBe("Ana");
    expect(activeProfile()?.xp).toBe(0);
    expect(activeProfile()?.lessons).toEqual({});

    const bruno = useProgressStore.getState().profiles.find((profile) => profile.name === "Bruno");
    expect(bruno?.xp).toBe(20);
    expect(bruno?.lessons["juros-compostos"]).toBeTruthy();
  });

  it("não soma XP duas vezes ao concluir a mesma lição", () => {
    createProfile();
    const { completeLesson } = useProgressStore.getState();

    completeLesson("juros-compostos", 20);
    completeLesson("juros-compostos", 20);

    expect(activeProfile()?.xp).toBe(20);
    expect(activeProfile()?.lessons["juros-compostos"]).toBeTruthy();
  });

  it("soma XP de lições diferentes", () => {
    createProfile();
    const { completeLesson } = useProgressStore.getState();

    completeLesson("por-que-investir", 20);
    completeLesson("juros-compostos", 20);

    expect(activeProfile()?.xp).toBe(40);
  });

  it("premia apenas a melhora no quiz", () => {
    createProfile();
    const { recordQuiz } = useProgressStore.getState();

    recordQuiz("inflacao", 2, 4, 5);
    expect(activeProfile()?.xp).toBe(10);

    recordQuiz("inflacao", 1, 4, 5);
    expect(activeProfile()?.xp).toBe(10);

    recordQuiz("inflacao", 4, 4, 5);
    expect(activeProfile()?.xp).toBe(20);
    expect(activeProfile()?.quizzes.inflacao).toEqual({ bestScore: 4, total: 4 });
  });

  it("não soma XP duas vezes ao concluir a mesma missão", () => {
    createProfile();
    const { completeMission } = useProgressStore.getState();

    completeMission("mapa-do-dinheiro", 15);
    completeMission("mapa-do-dinheiro", 15);

    expect(activeProfile()?.xp).toBe(15);
    expect(activeProfile()?.missions["mapa-do-dinheiro"]).toBeTruthy();
  });

  it("soma XP de missões diferentes", () => {
    createProfile();
    const { completeMission } = useProgressStore.getState();

    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);

    expect(activeProfile()?.xp).toBe(30);
  });

  it("apaga uma missão e recalcula o XP", () => {
    createProfile();
    const { completeLesson, completeMission, resetMission } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);
    expect(activeProfile()?.xp).toBe(50);

    resetMission("mapa-do-dinheiro");

    expect(activeProfile()?.missions["mapa-do-dinheiro"]).toBeUndefined();
    expect(activeProfile()?.missions["teste-do-tempo"]).toBeTruthy();
    expect(activeProfile()?.lessons.inflacao).toBeTruthy();
    expect(activeProfile()?.xp).toBe(35);
  });

  it("apaga uma lição junto com o resultado do quiz", () => {
    createProfile();
    const { completeLesson, recordQuiz, resetLesson } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    expect(activeProfile()?.xp).toBe(35);

    resetLesson("inflacao");

    expect(activeProfile()?.lessons.inflacao).toBeUndefined();
    expect(activeProfile()?.quizzes.inflacao).toBeUndefined();
    expect(activeProfile()?.xp).toBe(0);
  });

  it("apaga todas as missões mantendo a trilha e o perfil", () => {
    createProfile();
    const { completeLesson, completeMission, resetMissions } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    completeMission("mapa-do-dinheiro", 15);
    completeMission("teste-do-tempo", 15);

    resetMissions();

    expect(activeProfile()?.missions).toEqual({});
    expect(activeProfile()?.lessons.inflacao).toBeTruthy();
    expect(activeProfile()?.name).toBe("Henry");
    expect(activeProfile()?.xp).toBe(20);
  });

  it("apaga a trilha mantendo as missões e o perfil", () => {
    createProfile();
    const { completeLesson, recordQuiz, completeMission, resetTrail } = useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    completeMission("mapa-do-dinheiro", 15);

    resetTrail();

    expect(activeProfile()?.lessons).toEqual({});
    expect(activeProfile()?.quizzes).toEqual({});
    expect(activeProfile()?.missions["mapa-do-dinheiro"]).toBeTruthy();
    expect(activeProfile()?.name).toBe("Henry");
    expect(activeProfile()?.xp).toBe(15);
  });

  it("apaga todo o progresso sem apagar o perfil", () => {
    createProfile();
    const { completeLesson, recordQuiz, completeMission, resetProgress } =
      useProgressStore.getState();

    completeLesson("inflacao", 20);
    recordQuiz("inflacao", 3, 4, 5);
    completeMission("mapa-do-dinheiro", 15);

    resetProgress();

    expect(activeProfile()?.xp).toBe(0);
    expect(activeProfile()?.lessons).toEqual({});
    expect(activeProfile()?.quizzes).toEqual({});
    expect(activeProfile()?.missions).toEqual({});
    expect(activeProfile()?.name).toBe("Henry");
  });

  it("exporta e importa todos os perfis e o perfil ativo", () => {
    createProfile("Ana");
    useProgressStore.getState().completeLesson("inflacao", 20);
    createProfile("Bruno");
    useProgressStore.getState().completeMission("cesta-de-precos", 15);

    const ana = useProgressStore.getState().profiles.find((profile) => profile.name === "Ana");
    if (!ana) throw new Error("perfil Ana não encontrado");
    useProgressStore.getState().switchProfile(ana.id);

    const backup = useProgressStore.getState().exportProgress();

    useProgressStore.setState(createInitialSnapshot());

    expect(useProgressStore.getState().importProgress(backup)).toEqual({ ok: true });
    expect(useProgressStore.getState().profiles).toHaveLength(2);
    expect(activeProfile()?.name).toBe("Ana");
    expect(activeProfile()?.xp).toBe(20);
    expect(activeProfile()?.lessons.inflacao).toBeTruthy();

    const bruno = useProgressStore.getState().profiles.find((profile) => profile.name === "Bruno");
    expect(bruno?.xp).toBe(15);
    expect(bruno?.missions["cesta-de-precos"]).toBeTruthy();
  });

  it("importa backup da versão 1 sem missões no perfil ativo", () => {
    createProfile();
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

    expect(useProgressStore.getState().importProgress(legacy)).toEqual({ ok: true });
    expect(activeProfile()?.xp).toBe(20);
    expect(activeProfile()?.missions).toEqual({});
    expect(activeProfile()?.name).toBe("Henry");
  });

  it("guarda backup antigo sem perfil como progresso pendente", () => {
    const legacy = JSON.stringify({
      app: "investe-facil",
      version: 2,
      data: {
        xp: 35,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: { inflacao: { bestScore: 3, total: 4 } },
        missions: { "mapa-do-dinheiro": { completedAt: "2026-01-01T00:00:00.000Z" } },
        badges: [],
      },
    });

    expect(useProgressStore.getState().importProgress(legacy)).toEqual({ ok: true });
    expect(useProgressStore.getState().pendingProgress?.xp).toBe(35);

    createProfile("Ana");
    expect(activeProfile()?.xp).toBe(35);
    expect(activeProfile()?.quizzes.inflacao.bestScore).toBe(3);
  });

  it("importa backup da versão 3 restaurando o perfil único", () => {
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

    expect(useProgressStore.getState().importProgress(backup)).toEqual({ ok: true });
    expect(useProgressStore.getState().profiles).toHaveLength(1);
    expect(activeProfile()?.name).toBe("Ana");
    expect(activeProfile()?.avatarId).toBe("bussola");
    expect(activeProfile()?.xp).toBe(20);
  });

  it("rejeita backup inválido, com perfis demais ou nomes repetidos", () => {
    const { importProgress } = useProgressStore.getState();

    expect(importProgress("{ não é json").ok).toBe(false);
    expect(importProgress(JSON.stringify({ app: "outro" })).ok).toBe(false);

    const profile = {
      id: "a",
      name: "Ana",
      avatarId: "folha",
      createdAt: "2026-01-01T00:00:00.000Z",
      ...createEmptyProgress(),
    };

    const tooMany = JSON.stringify({
      app: "investe-facil",
      version: 4,
      data: {
        profiles: [
          profile,
          { ...profile, id: "b", name: "Bia" },
          { ...profile, id: "c", name: "Caio" },
          { ...profile, id: "d", name: "Duda" },
        ],
        activeProfileId: "a",
        pendingProgress: null,
      },
    });
    expect(importProgress(tooMany).ok).toBe(false);

    const duplicateNames = JSON.stringify({
      app: "investe-facil",
      version: 4,
      data: {
        profiles: [profile, { ...profile, id: "b", name: "ana" }],
        activeProfileId: "a",
        pendingProgress: null,
      },
    });
    expect(importProgress(duplicateNames).ok).toBe(false);
  });

  it("migra snapshot da versão 1 mantendo o progresso pendente", () => {
    const migrated = migrateProgress(
      {
        xp: 40,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: {},
        badges: [],
      },
      1,
    );

    expect(migrated.profiles).toEqual([]);
    expect(migrated.pendingProgress?.xp).toBe(40);
    expect(migrated.pendingProgress?.missions).toEqual({});
    expect(migrated.pendingProgress?.lessons.inflacao).toBeTruthy();
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

    expect(migrated.profiles).toEqual([]);
    expect(migrated.pendingProgress?.xp).toBe(35);
    expect(migrated.pendingProgress?.quizzes.inflacao.bestScore).toBe(3);
    expect(migrated.pendingProgress?.missions["mapa-do-dinheiro"]).toBeTruthy();
  });

  it("migra snapshot da versão 3 com perfil para um perfil ativo", () => {
    const migrated = migrateProgress(
      {
        xp: 20,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: {},
        missions: {},
        badges: [],
        profile: {
          name: "Ana",
          avatarId: "bussola",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      },
      3,
    );

    expect(migrated.profiles).toHaveLength(1);
    expect(migrated.profiles[0].name).toBe("Ana");
    expect(migrated.profiles[0].xp).toBe(20);
    expect(migrated.activeProfileId).toBe(migrated.profiles[0].id);
    expect(migrated.pendingProgress).toBeNull();
  });

  it("migra snapshot da versão 3 sem perfil para progresso pendente", () => {
    const migrated = migrateProgress(
      {
        xp: 20,
        lessons: { inflacao: { completedAt: "2026-01-01T00:00:00.000Z" } },
        quizzes: {},
        missions: {},
        badges: [],
        profile: null,
      },
      3,
    );

    expect(migrated.profiles).toEqual([]);
    expect(migrated.pendingProgress?.xp).toBe(20);
  });
});
