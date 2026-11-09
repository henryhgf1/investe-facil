"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";

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

export type Profile = {
  name: string;
  avatarId: string;
  createdAt: string;
};

export type ProgressSnapshot = {
  xp: number;
  lessons: Record<string, LessonRecord>;
  quizzes: Record<string, QuizRecord>;
  missions: Record<string, MissionRecord>;
  badges: string[];
  profile: Profile | null;
};

export const PROGRESS_VERSION = 3;

export function createInitialSnapshot(): ProgressSnapshot {
  return { xp: 0, lessons: {}, quizzes: {}, missions: {}, badges: [], profile: null };
}

/**
 * Converte snapshots antigos para o formato atual.
 * A versão 1 não tinha missões e nenhuma versão anterior tinha perfil.
 */
export function migrateProgress(persisted: unknown, version: number): ProgressSnapshot {
  const data = (persisted ?? {}) as Partial<ProgressSnapshot>;
  const base = createInitialSnapshot();

  return {
    ...base,
    ...data,
    missions: data.missions ?? {},
    badges: Array.isArray(data.badges) ? data.badges : [],
    profile: version < 3 ? null : (data.profile ?? null),
  };
}

const recordSchema = z.object({ completedAt: z.string().min(1) });

const profileSchema = z.object({
  name: z.string().trim().min(1).max(40),
  avatarId: z.string().min(1).max(40),
  createdAt: z.string().min(1),
});

const payloadSchema = z.object({
  app: z.literal("investe-facil"),
  version: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  data: z.object({
    xp: z.number().int().min(0).max(1_000_000),
    lessons: z.record(z.string(), recordSchema),
    quizzes: z.record(
      z.string(),
      z.object({
        bestScore: z.number().int().min(0),
        total: z.number().int().min(0),
      }),
    ),
    missions: z.record(z.string(), recordSchema).default({}),
    badges: z.array(z.string()).default([]),
    profile: profileSchema.nullable().optional(),
  }),
});

export type ImportResult = { ok: true } | { ok: false; error: string };

type ProgressStore = ProgressSnapshot & {
  completeLesson: (slug: string, xp: number) => void;
  recordQuiz: (slug: string, score: number, total: number, xpPerCorrect: number) => void;
  completeMission: (id: string, xp: number) => void;
  saveProfile: (name: string, avatarId: string) => void;
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

      completeLesson: (slug, xp) => {
        const state = get();
        if (!state.profile || state.lessons[slug]) return;

        set({
          xp: state.xp + xp,
          lessons: {
            ...state.lessons,
            [slug]: { completedAt: new Date().toISOString() },
          },
        });
      },

      recordQuiz: (slug, score, total, xpPerCorrect) => {
        const state = get();
        if (!state.profile) return;

        const previousBest = state.quizzes[slug]?.bestScore ?? 0;
        const improvement = Math.max(0, score - previousBest);

        set({
          xp: state.xp + improvement * xpPerCorrect,
          quizzes: {
            ...state.quizzes,
            [slug]: {
              bestScore: Math.max(previousBest, score),
              total,
            },
          },
        });
      },

      completeMission: (id, xp) => {
        const state = get();
        if (!state.profile || state.missions[id]) return;

        set({
          xp: state.xp + xp,
          missions: {
            ...state.missions,
            [id]: { completedAt: new Date().toISOString() },
          },
        });
      },

      saveProfile: (name, avatarId) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const current = get().profile;

        set({
          profile: {
            name: trimmed.slice(0, 40),
            avatarId,
            createdAt: current?.createdAt ?? new Date().toISOString(),
          },
        });
      },

      resetMission: (id) => {
        const state = get();
        if (!state.missions[id]) return;

        const missions = { ...state.missions };
        delete missions[id];

        set({
          missions,
          xp: xpFromProgress({ lessons: state.lessons, quizzes: state.quizzes, missions }),
        });
      },

      resetLesson: (slug) => {
        const state = get();
        const lessons = { ...state.lessons };
        const quizzes = { ...state.quizzes };
        delete lessons[slug];
        delete quizzes[slug];

        set({
          lessons,
          quizzes,
          xp: xpFromProgress({ lessons, quizzes, missions: state.missions }),
        });
      },

      resetMissions: () => {
        const state = get();
        const missions = {};

        set({
          missions,
          xp: xpFromProgress({ lessons: state.lessons, quizzes: state.quizzes, missions }),
        });
      },

      resetTrail: () => {
        const state = get();
        const lessons = {};
        const quizzes = {};

        set({
          lessons,
          quizzes,
          xp: xpFromProgress({ lessons, quizzes, missions: state.missions }),
        });
      },

      resetProgress: () => {
        set({ ...createInitialSnapshot(), profile: get().profile });
      },

      exportProgress: () => {
        const { xp, lessons, quizzes, missions, badges, profile } = get();
        return JSON.stringify(
          {
            app: "investe-facil",
            version: PROGRESS_VERSION,
            exportedAt: new Date().toISOString(),
            data: { xp, lessons, quizzes, missions, badges, profile },
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

        const result = payloadSchema.safeParse(parsed);
        if (!result.success) {
          return {
            ok: false,
            error: "Arquivo inválido: não parece ser um backup do Investe Fácil.",
          };
        }

        const currentProfile = get().profile;
        set({
          ...result.data.data,
          profile: result.data.data.profile ?? currentProfile,
        });
        return { ok: true };
      },
    }),
    {
      name: STORAGE_KEY,
      version: PROGRESS_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        xp: state.xp,
        lessons: state.lessons,
        quizzes: state.quizzes,
        missions: state.missions,
        badges: state.badges,
        profile: state.profile,
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
