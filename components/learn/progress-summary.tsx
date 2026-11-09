"use client";

import { Flame, Star, Trophy } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { readyLessons } from "@/content/lessons";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useActiveProfile } from "@/lib/store/progress";
import { levelForXp } from "@/lib/xp";

export function ProgressSummary() {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const xp = profile?.xp ?? 0;
  const lessons = profile?.lessons ?? {};
  const quizzes = profile?.quizzes ?? {};

  const info = levelForXp(xp);
  const completed = Object.keys(lessons).length;
  const total = readyLessons.length;
  const quizScores = Object.values(quizzes);
  const totalCorrect = quizScores.reduce((sum, quiz) => sum + quiz.bestScore, 0);
  const totalQuestions = quizScores.reduce((sum, quiz) => sum + quiz.total, 0);

  if (!hydrated) {
    return (
      <div
        aria-hidden="true"
        className="border-line h-[132px] animate-pulse rounded-2xl border bg-white"
      />
    );
  }

  return (
    <section
      aria-label="Resumo do seu progresso"
      className="border-line rounded-2xl border bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-brand-50 text-brand-700 flex size-11 items-center justify-center rounded-xl">
            <Trophy className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">
              Seu progresso
            </p>
            <p className="font-display text-ink text-lg font-bold">Nível {info.level}</p>
          </div>
        </div>

        <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Star className="text-brand-600 size-4" aria-hidden="true" />
            <dt className="sr-only">Experiência</dt>
            <dd className="text-ink font-semibold tabular-nums">{xp} XP</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="text-warn size-4" aria-hidden="true" />
            <dt className="sr-only">Lições concluídas</dt>
            <dd className="text-ink font-semibold tabular-nums">
              {completed} de {total} lições
            </dd>
          </div>
          {totalQuestions > 0 ? (
            <div>
              <dt className="sr-only">Aproveitamento nos quizzes</dt>
              <dd className="text-muted">
                Quizzes:{" "}
                <span className="text-ink font-semibold">
                  {Math.round((totalCorrect / totalQuestions) * 100)}%
                </span>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="mt-4 space-y-1.5">
        <Progress value={info.progressPercent} label={`Progresso para o nível ${info.level + 1}`} />
        <p className="text-muted text-xs">
          {info.xpToNextLevel === null
            ? "Nível máximo por enquanto. Novos módulos chegam em breve."
            : `Faltam ${info.xpToNextLevel} XP para o nível ${info.level + 1}.`}
        </p>
      </div>
    </section>
  );
}
