"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";

export type LessonRecord = {
  completedAt: string;
};

export type QuizRecord = {
  bestScore: number;
  total: number;
};

export type ProgressSnapshot = {
  xp: number;
  lessons: Record<string, LessonRecord>;
  quizzes: Record<string, QuizRecord>;
  badges: string[];
};

export function createInitialSnapshot(): ProgressSnapshot {
  return { xp: 0, lessons: {}, quizzes: {}, badges: [] };
}

const payloadSchema = z.object({
  app: z.literal("investe-facil"),
  version: z.literal(1),
  data: z.object({
    xp: z.number().int().min(0).max(1_000_000),
    lessons: z.record(z.string(), z.object({ completedAt: z.string().min(1) })),
    quizzes: z.record(
      z.string(),
      z.object({
        bestScore: z.number().int().min(0),
        total: z.number().int().min(0),
      }),
    ),
    badges: z.array(z.string()),
  }),
});

export type ImportResult = { ok: true } | { ok: false; error: string };

type ProgressStore = ProgressSnapshot & {
  completeLesson: (slug: string, xp: number) => void;
  recordQuiz: (slug: string, score: number, total: number, xpPerCorrect: number) => void;
  reset: () => void;
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
        if (state.lessons[slug]) return;

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

      reset: () => set(createInitialSnapshot()),

      exportProgress: () => {
        const { xp, lessons, quizzes, badges } = get();
        return JSON.stringify(
          {
            app: "investe-facil",
            version: 1,
            exportedAt: new Date().toISOString(),
            data: { xp, lessons, quizzes, badges },
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

        set({ ...result.data.data });
        return { ok: true };
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        xp: state.xp,
        lessons: state.lessons,
        quizzes: state.quizzes,
        badges: state.badges,
      }),
      migrate: (persisted) => persisted as ProgressSnapshot,
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
