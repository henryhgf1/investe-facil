"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";

export function CompleteLesson({ slug, xp }: { slug: string; xp: number }) {
  const hydrated = useHydrated();
  const completed = useProgressStore((state) => Boolean(state.lessons[slug]));
  const completeLesson = useProgressStore((state) => state.completeLesson);

  if (!hydrated) {
    return <div aria-hidden="true" className="h-12" />;
  }

  if (completed) {
    return (
      <p className="border-brand-600/20 bg-brand-50 text-brand-800 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold">
        <Check className="size-4" aria-hidden="true" />
        Lição concluída
        <span className="text-brand-700 font-normal">· +{xp} XP registrados</span>
      </p>
    );
  }

  return (
    <Button size="lg" onClick={() => completeLesson(slug, xp)}>
      <Check className="size-4" aria-hidden="true" />
      Concluir lição
      <span className="font-normal text-white/70">+{xp} XP</span>
    </Button>
  );
}
