"use client";

import { ArrowRight, Target, Trophy } from "lucide-react";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { missions } from "@/content/missions";
import { badges, earnedBadgeCount, nextBadge } from "@/lib/badges";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";

export function MissionsSummary() {
  const hydrated = useHydrated();
  const xp = useProgressStore((state) => state.xp);
  const lessons = useProgressStore((state) => state.lessons);
  const quizzes = useProgressStore((state) => state.quizzes);
  const missionState = useProgressStore((state) => state.missions);

  if (!hydrated) {
    return (
      <div
        aria-hidden="true"
        className="border-line h-[124px] animate-pulse rounded-2xl border bg-white"
      />
    );
  }

  const completedMissions = Object.keys(missionState).length;
  const missionPercent = missions.length > 0 ? (completedMissions / missions.length) * 100 : 0;
  const earned = earnedBadgeCount({ xp, lessons, quizzes, missions: missionState });
  const next = nextBadge({ xp, lessons, quizzes, missions: missionState });

  return (
    <section
      aria-labelledby="missoes-resumo"
      className="border-line rounded-2xl border bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-warn-soft text-warn flex size-11 items-center justify-center rounded-xl">
            <Target className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">
              Missões e conquistas
            </p>
            <p className="font-display text-ink text-lg font-bold">
              {completedMissions} de {missions.length} missões
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="text-muted inline-flex items-center gap-1.5">
            <Trophy className="text-brand-600 size-4" aria-hidden="true" />
            <strong className="text-ink font-semibold tabular-nums">{earned}</strong> de{" "}
            {badges.length} badges
          </span>
          <Link
            href="/missoes/"
            className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
          >
            Ver missões
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Progress
          value={missionPercent}
          label={`${completedMissions} de ${missions.length} missões concluídas`}
        />
        <p className="text-muted text-xs">
          {next
            ? `Próxima conquista: ${next.title}. ${next.hint}`
            : "Todas as conquistas foram desbloqueadas. Parabéns!"}
        </p>
      </div>
    </section>
  );
}
