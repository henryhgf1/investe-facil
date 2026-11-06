"use client";

import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Mission } from "@/content/missions";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";

export function CompleteMission({ mission }: { mission: Mission }) {
  const hydrated = useHydrated();
  const completed = useProgressStore((state) => Boolean(state.missions[mission.id]));
  const completeMission = useProgressStore((state) => state.completeMission);

  if (!hydrated) {
    return <div aria-hidden="true" className="h-11" />;
  }

  if (completed) {
    return (
      <p className="border-brand-600/20 bg-brand-50 text-brand-800 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold">
        <Check className="size-4" aria-hidden="true" />
        Missão concluída
        <span className="text-brand-700 font-normal">· +{mission.xp} XP registrados</span>
      </p>
    );
  }

  return (
    <Button onClick={() => completeMission(mission.id, mission.xp)}>
      <Check className="size-4" aria-hidden="true" />
      Concluir missão
      <span className="inline-flex items-center gap-1 font-normal text-white/70">
        <Sparkles className="size-3.5" aria-hidden="true" />+{mission.xp} XP
      </span>
    </Button>
  );
}
