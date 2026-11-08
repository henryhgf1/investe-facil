"use client";

import { Check, CheckCircle2, Lock, Sparkles, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Mission } from "@/content/missions";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export function MissionExercise({
  mission,
  compact = false,
}: {
  mission: Mission;
  compact?: boolean;
}) {
  const hydrated = useHydrated();
  const completed = useProgressStore((state) => Boolean(state.missions[mission.id]));
  const completeMission = useProgressStore((state) => state.completeMission);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const allStepsChecked = checkedSteps.length === mission.steps.length;
  const answerIsCorrect = selectedOption === mission.check.answerId;
  const canComplete = allStepsChecked && answerIsCorrect;
  const statusId = `missao-${mission.id}-status`;

  let helperText = "Acerte a pergunta de verificação para liberar a conclusão.";
  if (canComplete) {
    helperText = "Tudo pronto. Você pode concluir a missão.";
  } else if (!allStepsChecked) {
    helperText = "Marque todos os passos para liberar a conclusão.";
  }

  function toggleStep(index: number) {
    setCheckedSteps((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  }

  function selectOption(optionId: string) {
    setSelectedOption(optionId);
    setShowFeedback(true);
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div>
        <p className="text-ink text-sm font-semibold">Checklist da missão</p>
        <ul className="mt-2 space-y-2">
          {mission.steps.map((step, index) => (
            <li key={step}>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  checked={checkedSteps.includes(index)}
                  onChange={() => toggleStep(index)}
                  className="accent-brand-600 mt-1 size-4 shrink-0"
                />
                <span>{step}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-2 text-xs">
          {checkedSteps.length} de {mission.steps.length} passos marcados
        </p>
      </div>

      <fieldset>
        <legend className="text-ink text-sm font-semibold">{mission.check.prompt}</legend>
        <div className="mt-2 space-y-2">
          {mission.check.options.map((option) => {
            const selected = selectedOption === option.id;
            const isRight = showFeedback && option.id === mission.check.answerId;
            const isWrong = showFeedback && selected && !isRight;

            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  selected && !showFeedback && "border-brand-600 bg-brand-50",
                  !selected &&
                    !showFeedback &&
                    "border-line hover:border-brand-600/40 hover:bg-canvas",
                  isRight && "border-brand-600 bg-brand-50",
                  isWrong && "border-danger/40 bg-red-50",
                  showFeedback && !isRight && !isWrong && "border-line opacity-70",
                )}
              >
                <input
                  type="radio"
                  name={`missao-${mission.id}-check`}
                  value={option.id}
                  checked={selected}
                  onChange={() => selectOption(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                    selected
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-300 text-slate-500",
                    isRight && "border-brand-600 bg-brand-600 text-white",
                    isWrong && "border-danger bg-danger text-white",
                  )}
                >
                  {option.id.toUpperCase()}
                </span>
                <span className="flex-1 leading-6 text-slate-700">{option.label}</span>
                {isRight ? (
                  <CheckCircle2
                    className="text-brand-700 mt-0.5 size-5 shrink-0"
                    aria-label="Resposta correta"
                  />
                ) : null}
                {isWrong ? (
                  <XCircle
                    className="text-danger mt-0.5 size-5 shrink-0"
                    aria-label="Resposta incorreta"
                  />
                ) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      {showFeedback ? (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-6",
            answerIsCorrect ? "bg-brand-50 text-brand-900" : "bg-warn-soft text-slate-800",
          )}
        >
          <strong className="font-semibold">{answerIsCorrect ? "Correto. " : "Ainda não. "}</strong>
          {answerIsCorrect
            ? mission.check.explanation
            : "Releia os passos da missão e tente outra alternativa."}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => completeMission(mission.id, mission.xp)}
          disabled={!canComplete}
          aria-describedby={statusId}
        >
          {canComplete ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Lock className="size-4" aria-hidden="true" />
          )}
          Concluir missão
          <span className="inline-flex items-center gap-1 font-normal text-white/70">
            <Sparkles className="size-3.5" aria-hidden="true" />+{mission.xp} XP
          </span>
        </Button>
        <p id={statusId} className="text-muted text-xs leading-5">
          {helperText}
        </p>
      </div>
    </div>
  );
}
