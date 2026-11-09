"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";

import { getProfileAvatar } from "@/content/profile";
import { xpFromProgress } from "@/lib/xp";

export type LessonRecord = {
  completedAt: string;
};

export type QuizRecord = {
  bestScore: number;
  total: number;
};

export type MissionRecord = {
  completedAt: string;
};

export type ProfileProgress = {
  xp: number;
  lessons: Record<string, LessonRecord>;
  quizzes: Record<string, QuizRecord>;
  missions: Record<string, MissionRecord>;
  badges: string[];
};

export type Profile = ProfileProgress & {
  id: string;
  name: string;
  avatarId: string;
  createdAt: string;
};

export type ProgressSnapshot = {
  profiles: Profile[];
  activeProfileId: string | null;
  pendingProgress: ProfileProgress | null;
};

export const PROGRESS_VERSION = 4;
export const MAX_PROFILES = 3;
export const MAX_PROFILE_NAME = 24;

export function createEmptyProgress(): ProfileProgress {
  return { xp: 0, lessons: {}, quizzes: {}, missions: {}, badges: [] };
}

export function createInitialSnapshot(): ProgressSnapshot {
  return { profiles: [], activeProfileId: null, pendingProgress: null };
}

export function getActiveProfile(
  snapshot: Pick<ProgressSnapshot, "profiles" | "activeProfileId">,
): Profile | null {
  return snapshot.profiles.find((profile) => profile.id === snapshot.activeProfileId) ?? null;
}

function createProfileId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `perfil-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function hasProgress(progress: ProfileProgress) {
  return (
    progress.xp > 0 ||
    Object.keys(progress.lessons).length > 0 ||
    Object.keys(progress.quizzes).length > 0 ||
    Object.keys(progress.missions).length > 0 ||
    progress.badges.length > 0
  );
}

type LegacyProfile = {
  name: string;
  avatarId: string;
  createdAt: string;
};

type LegacySnapshot = Partial<ProfileProgress> & {
  profile?: LegacyProfile | null;
};

function progressFromLegacy(data: LegacySnapshot): ProfileProgress {
  return {
    xp: typeof data.xp === "number" ? data.xp : 0,
    lessons: data.lessons ?? {},
    quizzes: data.quizzes ?? {},
    missions: data.missions ?? {},
    badges: Array.isArray(data.badges) ? data.badges : [],
  };
}

function normalizeProfile(profile: Profile): Profile {
  return {
    id: profile.id || createProfileId(),
    name: (profile.name ?? "").trim().slice(0, 40) || "Perfil",
    avatarId: getProfileAvatar(profile.avatarId).id,
    createdAt: profile.createdAt || new Date().toISOString(),
    xp: Number.isFinite(profile.xp) ? Math.max(0, Math.floor(profile.xp)) : 0,
    lessons: profile.lessons ?? {},
    quizzes: profile.quizzes ?? {},
    missions: profile.missions ?? {},
    badges: Array.isArray(profile.badges) ? profile.badges : [],
  };
}

function normalizeProgress(progress: ProfileProgress): ProfileProgress {
  return {
    xp: Number.isFinite(progress.xp) ? Math.max(0, Math.floor(progress.xp)) : 0,
    lessons: progress.lessons ?? {},
    quizzes: progress.quizzes ?? {},
    missions: progress.missions ?? {},
    badges: Array.isArray(progress.badges) ? progress.badges : [],
  };
}

function normalizeSnapshot(persisted: unknown): ProgressSnapshot {
  const data = (persisted ?? {}) as Partial<ProgressSnapshot>;
  const profiles = Array.isArray(data.profiles)
    ? data.profiles
        .filter((profile): profile is Profile => Boolean(profile) && typeof profile === "object")
        .slice(0, MAX_PROFILES)
        .map(normalizeProfile)
    : [];
  const activeProfileId =
    data.activeProfileId && profiles.some((profile) => profile.id === data.activeProfileId)
      ? data.activeProfileId
      : (profiles[0]?.id ?? null);
  const pendingProgress =
    profiles.length === 0 && data.pendingProgress ? normalizeProgress(data.pendingProgress) : null;

  return { profiles, activeProfileId, pendingProgress };
}

/**
 * Converte snapshots antigos para o formato atual.
 * As versões 1 e 2 não tinham perfil e a versão 3 tinha um único perfil.
 * Progresso antigo sem perfil fica em pendingProgress até o primeiro cadastro.
 */
export function migrateProgress(persisted: unknown, version: number): ProgressSnapshot {
  if (version >= PROGRESS_VERSION) return normalizeSnapshot(persisted);

  const data = (persisted ?? {}) as LegacySnapshot;
  const progress = progressFromLegacy(data);
  const legacyProfile = version >= 3 ? (data.profile ?? null) : null;

  if (legacyProfile) {
    const id = createProfileId();

    return {
      profiles: [
        {
          id,
          name: legacyProfile.name,
          avatarId: getProfileAvatar(legacyProfile.avatarId).id,
          createdAt: legacyProfile.createdAt,
          ...progress,
        },
      ],
      activeProfileId: id,
      pendingProgress: null,
    };
  }

  return {
    profiles: [],
    activeProfileId: null,
    pendingProgress: hasProgress(progress) ? progress : null,
  };
}

const recordSchema = z.object({ completedAt: z.string().min(1) });

const quizRecordSchema = z.object({
  bestScore: z.number().int().min(0),
  total: z.number().int().min(0),
});

const progressSchema = z.object({
  xp: z.number().int().min(0).max(1_000_000),
  lessons: z.record(z.string(), recordSchema),
  quizzes: z.record(z.string(), quizRecordSchema),
  missions: z.record(z.string(), recordSchema),
  badges: z.array(z.string()),
});

const legacyProfileSchema = z.object({
  name: z.string().trim().min(1).max(40),
  avatarId: z.string().min(1).max(40),
  createdAt: z.string().min(1),
});

const legacyPayloadSchema = z.object({
  app: z.literal("investe-facil"),
  version: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  data: z.object({
    xp: z.number().int().min(0).max(1_000_000),
    lessons: z.record(z.string(), recordSchema),
    quizzes: z.record(z.string(), quizRecordSchema),
    missions: z.record(z.string(), recordSchema).default({}),
    badges: z.array(z.string()).default([]),
    profile: legacyProfileSchema.nullable().optional(),
  }),
});

const profileSchema = progressSchema.extend({
  id: z.string().min(1).max(64),
  name: z.string().trim().min(1).max(MAX_PROFILE_NAME),
  avatarId: z.string().min(1).max(40),
  createdAt: z.string().min(1),
});

const multiPayloadSchema = z.object({
  app: z.literal("investe-facil"),
  version: z.literal(4),
  data: z.object({
    profiles: z.array(profileSchema).max(MAX_PROFILES),
    activeProfileId: z.string().min(1).max(64).nullable(),
    pendingProgress: progressSchema.nullable().optional(),
  }),
});

export type ImportResult = { ok: true } | { ok: false; error: string };
export type ProfileResult = { ok: true; profileId: string } | { ok: false; error: string };

type ProfileValidation =
  { ok: true; name: string; avatarId: string } | { ok: false; error: string };

function validateProfileInput(
  profiles: Profile[],
  name: string,
  avatarId: string,
  ignoreId?: string,
): ProfileValidation {
  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { ok: false, error: "Escolha um nome com pelo menos 2 letras." };
  }

  if (trimmed.length > MAX_PROFILE_NAME) {
    return { ok: false, error: `Use um nome com até ${MAX_PROFILE_NAME} caracteres.` };
  }

  const normalizedName = trimmed.toLocaleLowerCase("pt-BR");
  const duplicate = profiles.some(
    (profile) =>
      profile.id !== ignoreId && profile.name.toLocaleLowerCase("pt-BR") === normalizedName,
  );

  if (duplicate) {
    return { ok: false, error: "Já existe um perfil com esse nome." };
  }

  return { ok: true, name: trimmed, avatarId: getProfileAvatar(avatarId).id };
}

type ProgressStore = ProgressSnapshot & {
  createProfile: (name: string, avatarId: string) => ProfileResult;
  updateProfile: (name: string, avatarId: string) => ProfileResult;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  completeLesson: (slug: string, xp: number) => void;
  recordQuiz: (slug: string, score: number, total: number, xpPerCorrect: number) => void;
  completeMission: (id: string, xp: number) => void;
  resetMission: (id: string) => void;
  resetLesson: (slug: string) => void;
  resetMissions: () => void;
  resetTrail: () => void;
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (raw: string) => ImportResult;
};

export const STORAGE_KEY = "investe-facil:progress";

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...createInitialSnapshot(),

      createProfile: (name, avatarId) => {
        const state = get();

        if (state.profiles.length >= MAX_PROFILES) {
          return {
            ok: false,
            error: `Este navegador já tem ${MAX_PROFILES} perfis. Apague um para criar outro.`,
          };
        }

        const validation = validateProfileInput(state.profiles, name, avatarId);
        if (!validation.ok) return validation;

        const id = createProfileId();
        const profile: Profile = {
          id,
          name: validation.name,
          avatarId: validation.avatarId,
          createdAt: new Date().toISOString(),
          ...(state.pendingProgress ?? createEmptyProgress()),
        };

        set({
          profiles: [...state.profiles, profile],
          activeProfileId: id,
          pendingProgress: null,
        });

        return { ok: true, profileId: id };
      },

      updateProfile: (name, avatarId) => {
        const state = get();
        const active = getActiveProfile(state);

        if (!active) {
          return { ok: false, error: "Crie um perfil antes de editar." };
        }

        const validation = validateProfileInput(state.profiles, name, avatarId, active.id);
        if (!validation.ok) return validation;

        set({
          profiles: state.profiles.map((profile) =>
            profile.id === active.id
              ? { ...profile, name: validation.name, avatarId: validation.avatarId }
              : profile,
          ),
        });

        return { ok: true, profileId: active.id };
      },

      switchProfile: (id) => {
        const state = get();
        if (!state.profiles.some((profile) => profile.id === id)) return;

        set({ activeProfileId: id });
      },

      deleteProfile: (id) => {
        const state = get();
        const index = state.profiles.findIndex((profile) => profile.id === id);
        if (index === -1) return;

        const profiles = state.profiles.filter((profile) => profile.id !== id);
        const activeProfileId =
          state.activeProfileId === id
            ? (profiles[Math.min(index, profiles.length - 1)]?.id ?? null)
            : state.activeProfileId;

        set({ profiles, activeProfileId });
      },

      completeLesson: (slug, xp) => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active || active.lessons[slug]) return state;

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    xp: profile.xp + xp,
                    lessons: {
                      ...profile.lessons,
                      [slug]: { completedAt: new Date().toISOString() },
                    },
                  }
                : profile,
            ),
          };
        });
      },

      recordQuiz: (slug, score, total, xpPerCorrect) => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active) return state;

          const previousBest = active.quizzes[slug]?.bestScore ?? 0;
          const improvement = Math.max(0, score - previousBest);

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    xp: profile.xp + improvement * xpPerCorrect,
                    quizzes: {
                      ...profile.quizzes,
                      [slug]: {
                        bestScore: Math.max(previousBest, score),
                        total,
                      },
                    },
                  }
                : profile,
            ),
          };
        });
      },

      completeMission: (id, xp) => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active || active.missions[id]) return state;

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    xp: profile.xp + xp,
                    missions: {
                      ...profile.missions,
                      [id]: { completedAt: new Date().toISOString() },
                    },
                  }
                : profile,
            ),
          };
        });
      },

      resetMission: (id) => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active || !active.missions[id]) return state;

          const missions = { ...active.missions };
          delete missions[id];

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    missions,
                    xp: xpFromProgress({
                      lessons: profile.lessons,
                      quizzes: profile.quizzes,
                      missions,
                    }),
                  }
                : profile,
            ),
          };
        });
      },

      resetLesson: (slug) => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active) return state;

          const lessons = { ...active.lessons };
          const quizzes = { ...active.quizzes };
          delete lessons[slug];
          delete quizzes[slug];

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    lessons,
                    quizzes,
                    xp: xpFromProgress({ lessons, quizzes, missions: profile.missions }),
                  }
                : profile,
            ),
          };
        });
      },

      resetMissions: () => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active) return state;

          const missions = {};

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    missions,
                    xp: xpFromProgress({
                      lessons: profile.lessons,
                      quizzes: profile.quizzes,
                      missions,
                    }),
                  }
                : profile,
            ),
          };
        });
      },

      resetTrail: () => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active) return state;

          const lessons = {};
          const quizzes = {};

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id
                ? {
                    ...profile,
                    lessons,
                    quizzes,
                    xp: xpFromProgress({ lessons, quizzes, missions: profile.missions }),
                  }
                : profile,
            ),
          };
        });
      },

      resetProgress: () => {
        set((state) => {
          const active = getActiveProfile(state);
          if (!active) return state;

          return {
            profiles: state.profiles.map((profile) =>
              profile.id === active.id ? { ...profile, ...createEmptyProgress() } : profile,
            ),
          };
        });
      },

      exportProgress: () => {
        const { profiles, activeProfileId, pendingProgress } = get();

        return JSON.stringify(
          {
            app: "investe-facil",
            version: PROGRESS_VERSION,
            exportedAt: new Date().toISOString(),
            data: { profiles, activeProfileId, pendingProgress },
          },
          null,
          2,
        );
      },

      importProgress: (raw) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return { ok: false, error: "O arquivo não é um JSON válido." };
        }

        const header = parsed as { app?: unknown; version?: unknown };
        if (header?.app !== "investe-facil") {
          return {
            ok: false,
            error: "Arquivo inválido: não parece ser um backup do Investe Fácil.",
          };
        }

        if (header.version === 4) {
          const profilesInput = (parsed as { data?: { profiles?: unknown } }).data?.profiles;

          if (Array.isArray(profilesInput) && profilesInput.length > MAX_PROFILES) {
            return {
              ok: false,
              error: `Este backup tem mais de ${MAX_PROFILES} perfis.`,
            };
          }

          const result = multiPayloadSchema.safeParse(parsed);
          if (!result.success) {
            return {
              ok: false,
              error: "Arquivo inválido: não parece ser um backup do Investe Fácil.",
            };
          }

          const { profiles: importedProfiles, activeProfileId, pendingProgress } = result.data.data;
          const ids = new Set(importedProfiles.map((profile) => profile.id));

          if (ids.size !== importedProfiles.length) {
            return { ok: false, error: "Este backup tem perfis com identificadores repetidos." };
          }

          const names = new Set(
            importedProfiles.map((profile) => profile.name.toLocaleLowerCase("pt-BR")),
          );

          if (names.size !== importedProfiles.length) {
            return { ok: false, error: "Este backup tem perfis com nomes repetidos." };
          }

          const profiles = importedProfiles.map(normalizeProfile);

          set({
            profiles,
            activeProfileId:
              activeProfileId && profiles.some((profile) => profile.id === activeProfileId)
                ? activeProfileId
                : (profiles[0]?.id ?? null),
            pendingProgress:
              profiles.length === 0 && pendingProgress ? normalizeProgress(pendingProgress) : null,
          });

          return { ok: true };
        }

        const result = legacyPayloadSchema.safeParse(parsed);
        if (!result.success) {
          return {
            ok: false,
            error: "Arquivo inválido: não parece ser um backup do Investe Fácil.",
          };
        }

        const legacy = result.data.data;
        const progress: ProfileProgress = {
          xp: legacy.xp,
          lessons: legacy.lessons,
          quizzes: legacy.quizzes,
          missions: legacy.missions,
          badges: legacy.badges,
        };

        if (legacy.profile) {
          const id = createProfileId();

          set({
            profiles: [
              {
                id,
                name: legacy.profile.name,
                avatarId: getProfileAvatar(legacy.profile.avatarId).id,
                createdAt: legacy.profile.createdAt,
                ...progress,
              },
            ],
            activeProfileId: id,
            pendingProgress: null,
          });

          return { ok: true };
        }

        const state = get();
        const active = getActiveProfile(state);

        if (active) {
          set({
            profiles: state.profiles.map((profile) =>
              profile.id === active.id ? { ...profile, ...progress } : profile,
            ),
          });
        } else {
          set({ pendingProgress: hasProgress(progress) ? progress : null });
        }

        return { ok: true };
      },
    }),
    {
      name: STORAGE_KEY,
      version: PROGRESS_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        pendingProgress: state.pendingProgress,
      }),
      migrate: migrateProgress,
    },
  ),
);

let hydrationStarted = false;

/** Garante que o localStorage foi lido uma única vez no cliente. */
export function ensureHydrated() {
  if (hydrationStarted) return;
  hydrationStarted = true;
  void useProgressStore.persist.rehydrate();
}

export function useActiveProfile() {
  return useProgressStore((state) => getActiveProfile(state));
}

export function useProfiles() {
  return useProgressStore((state) => state.profiles);
}
