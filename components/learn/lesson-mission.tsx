import { ArrowRight, Target } from "lucide-react";
import Link from "next/link";

import { MissionExercise } from "@/components/learn/mission-exercise";
import { Badge } from "@/components/ui/badge";
import { missionsForLesson } from "@/content/missions";
import { XP_PER_MISSION } from "@/lib/xp";

export function LessonMission({ lessonSlug }: { lessonSlug: string }) {
  const list = missionsForLesson(lessonSlug);

  if (list.length === 0) return null;

  return (
    <section
      aria-labelledby="missao-pratica"
      className="border-line mt-10 rounded-3xl border bg-white p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-warn text-xs font-bold tracking-widest uppercase">Missão prática</p>
          <h2 id="missao-pratica" className="font-display text-ink mt-1 text-xl font-bold">
            Leve para a vida real
          </h2>
        </div>
        <Badge variant="warn">
          <Target className="size-3.5" aria-hidden="true" />+{XP_PER_MISSION} XP por missão
        </Badge>
      </div>

      <div className="mt-5 space-y-4">
        {list.map((mission) => (
          <div key={mission.id} className="border-line bg-canvas rounded-2xl border p-5">
            <h3 className="font-display text-ink text-base font-bold">{mission.title}</h3>
            <p className="text-muted mt-1.5 text-sm leading-6">{mission.summary}</p>

            <div className="mt-4">
              <MissionExercise mission={mission} compact />
              <Link
                href={`/missoes/#${mission.id}`}
                className="text-brand-700 hover:text-brand-800 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
              >
                Ver todas as missões
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
