"use client";

import { Check, Lock } from "lucide-react";

import { ProfileRequiredNotice } from "@/components/learn/profile-required";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useActiveProfile, useProgressStore } from "@/lib/store/progress";

export function CompleteLesson({
  slug,
  xp,
  quizRequired = false,
}: {
  slug: string;
  xp: number;
  quizRequired?: boolean;
}) {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const completed = Boolean(profile?.lessons[slug]);
  const quizDone = Boolean(profile?.quizzes[slug]);
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

  if (!profile) {
    return (
      <div className="flex flex-col items-start gap-2">
        <Button size="lg" disabled>
          <Lock className="size-4" aria-hidden="true" />
          Concluir lição
          <span className="text-on-primary/70 font-normal">+{xp} XP</span>
        </Button>
        <ProfileRequiredNotice action="registrar a conclusão das lições" />
      </div>
    );
  }

  if (quizRequired && !quizDone) {
    const helperId = `quiz-${slug}-status`;

    return (
      <div className="flex flex-col items-start gap-2">
        <Button size="lg" disabled aria-describedby={helperId}>
          <Lock className="size-4" aria-hidden="true" />
          Concluir lição
          <span className="text-on-primary/70 font-normal">+{xp} XP</span>
        </Button>
        <p id={helperId} className="text-muted text-xs leading-5">
          Responda ao quiz acima para liberar a conclusão.
        </p>
      </div>
    );
  }

  return (
    <Button size="lg" onClick={() => completeLesson(slug, xp)}>
      <Check className="size-4" aria-hidden="true" />
      Concluir lição
      <span className="text-on-primary/70 font-normal">+{xp} XP</span>
    </Button>
  );
}
