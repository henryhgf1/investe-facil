"use client";

import { ArrowRight, Clock3 } from "lucide-react";
import Link from "next/link";

import { CompleteMission } from "@/components/learn/complete-mission";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLessonBySlug, lessonPath } from "@/content/lessons";
import { missions, type Mission } from "@/content/missions";
import { modules } from "@/content/modules";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const badgeVariant = {
  brand: "brand",
  accent: "accent",
  warn: "warn",
} as const;

function MissionItem({ mission, completed }: { mission: Mission; completed: boolean }) {
  const lesson = getLessonBySlug(mission.lessonSlug);
  const missionModule = modules.find((item) => item.id === mission.module);

  return (
    <article
      id={mission.id}
      className={cn(
        "border-line scroll-mt-24 rounded-2xl border bg-white p-5 transition-colors sm:p-6",
        completed && "border-brand-600/30 bg-brand-50/40",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant={missionModule ? badgeVariant[missionModule.accent] : "neutral"}>
          {missionModule?.shortTitle ?? "Missão"}
        </Badge>
        <span className="text-muted inline-flex items-center gap-1.5 text-xs">
          <Clock3 className="size-3.5" aria-hidden="true" />
          {mission.durationMin} min
        </span>
      </div>

      <h3 className="font-display text-ink mt-3 text-lg font-bold">{mission.title}</h3>
      <p className="text-muted mt-2 text-sm leading-6">{mission.summary}</p>

      <ol className="mt-4 space-y-2">
        {mission.steps.map((step, index) => (
          <li key={step} className="flex gap-2.5 text-sm leading-6 text-slate-700">
            <span
              aria-hidden="true"
              className="bg-brand-50 text-brand-700 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            >
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="border-line mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <CompleteMission mission={mission} />
        {lesson ? (
          <Link
            href={lessonPath(lesson)}
            className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            Ver a lição
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function MissionList() {
  const hydrated = useHydrated();
  const completedMissions = useProgressStore((state) => state.missions);
  const completed = Object.keys(completedMissions).length;
  const percent = missions.length > 0 ? (completed / missions.length) * 100 : 0;

  if (!hydrated) {
    return (
      <div aria-hidden="true" className="space-y-4">
        <div className="border-line h-24 animate-pulse rounded-2xl border bg-white" />
        <div className="border-line h-64 animate-pulse rounded-2xl border bg-white" />
      </div>
    );
  }

  return (
    <section aria-labelledby="lista-missoes">
      <div className="border-line rounded-2xl border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="lista-missoes" className="font-display text-ink text-xl font-bold">
            Missões práticas
          </h2>
          <p className="text-muted text-sm">
            <strong className="text-ink font-semibold tabular-nums">{completed}</strong> de{" "}
            {missions.length} concluídas
          </p>
        </div>
        <Progress
          className="mt-4"
          value={percent}
          label={`${completed} de ${missions.length} missões concluídas`}
        />
        <p className="text-muted mt-2 text-sm leading-6">
          Cada missão vale 15 XP e pode ser feita no seu ritmo. A lição recomendada ajuda, mas não
          bloqueia a prática.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        {modules.map((module) => {
          const list = missions.filter((mission) => mission.module === module.id);
          if (list.length === 0) return null;

          return (
            <div key={module.id}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-ink text-xl font-bold">{module.title}</h2>
                <p className="text-muted text-sm">{list.length} missões</p>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {list.map((mission) => (
                  <MissionItem
                    key={mission.id}
                    mission={mission}
                    completed={Boolean(completedMissions[mission.id])}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
