"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

import { ProfileRequiredNotice } from "@/components/learn/profile-required";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/content/quizzes";
import { useActiveProfile, useProgressStore } from "@/lib/store/progress";
import { cn } from "@/lib/utils";
import { XP_PER_CORRECT_ANSWER } from "@/lib/xp";

export function Quiz({ slug, questions }: { slug: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recordQuiz = useProgressStore((state) => state.recordQuiz);
  const profile = useActiveProfile();

  if (questions.length === 0) return null;

  const allAnswered = questions.every((question) => answers[question.id]);
  const percent = Math.round((score / questions.length) * 100);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!allAnswered) {
      setError("Responda todas as perguntas antes de ver o resultado.");
      return;
    }

    if (!profile) {
      setError("Crie seu perfil para registrar o resultado do quiz.");
      return;
    }

    const correct = questions.filter(
      (question) => answers[question.id] === question.correctOptionId,
    ).length;

    setError(null);
    setScore(correct);
    setSubmitted(true);
    recordQuiz(slug, correct, questions.length, XP_PER_CORRECT_ANSWER);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setError(null);
  }

  return (
    <section
      aria-labelledby="quiz-titulo"
      className="border-line mt-14 rounded-3xl border bg-white p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-accent text-xs font-bold tracking-widest uppercase">Quiz</p>
          <h2 id="quiz-titulo" className="font-display text-ink mt-1 text-xl font-bold">
            Fixe o que você aprendeu
          </h2>
        </div>
        <Badge variant="accent">+{XP_PER_CORRECT_ANSWER} XP por acerto</Badge>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = submitted && selected === question.correctOptionId;

          return (
            <fieldset key={question.id} disabled={submitted} className="space-y-3">
              <legend className="text-ink mb-3 flex gap-2 text-[15px] font-semibold">
                <span className="text-muted">{index + 1}.</span>
                {question.prompt}
              </legend>

              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;
                  const isRightOption = submitted && option.id === question.correctOptionId;
                  const isWrongSelection = submitted && isSelected && !isRightOption;

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[15px] transition-colors",
                        "has-[:focus-visible]:outline-brand-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                        isSelected && !submitted && "border-brand-600 bg-brand-50",
                        !isSelected &&
                          !submitted &&
                          "border-line hover:border-brand-600/40 hover:bg-canvas",
                        isRightOption && "border-brand-600 bg-brand-50",
                        isWrongSelection && "border-danger/40 bg-red-50",
                        !isRightOption &&
                          !isWrongSelection &&
                          submitted &&
                          "border-line opacity-70",
                        submitted && "cursor-default",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={isSelected}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [question.id]: option.id }))
                        }
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold",
                          isSelected
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300 text-slate-500",
                          isRightOption && "border-brand-600 bg-brand-600 text-white",
                          isWrongSelection && "border-danger bg-danger text-white",
                        )}
                      >
                        {option.id.toUpperCase()}
                      </span>
                      <span className="flex-1 leading-6 text-slate-700">{option.text}</span>
                      {isRightOption ? (
                        <CheckCircle2
                          className="text-brand-700 mt-0.5 size-5 shrink-0"
                          aria-label="Resposta correta"
                        />
                      ) : null}
                      {isWrongSelection ? (
                        <XCircle
                          className="text-danger mt-0.5 size-5 shrink-0"
                          aria-label="Resposta incorreta"
                        />
                      ) : null}
                    </label>
                  );
                })}
              </div>

              {submitted ? (
                <p
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm leading-6",
                    isCorrect ? "bg-brand-50 text-brand-900" : "bg-warn-soft text-slate-800",
                  )}
                >
                  <strong className="font-semibold">
                    {isCorrect ? "Correto. " : "Não foi essa. "}
                  </strong>
                  {question.explanation}
                </p>
              ) : null}
            </fieldset>
          );
        })}

        {error ? (
          <p role="alert" className="bg-warn-soft text-warn rounded-xl px-4 py-3 text-sm">
            {error}
          </p>
        ) : null}

        {submitted ? (
          <div className="border-line bg-canvas flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5">
            <div>
              <p className="font-display text-ink text-lg font-bold">
                {score} de {questions.length} corretas ({percent}%)
              </p>
              <p className="text-muted mt-1 text-sm">
                {percent === 100
                  ? "Perfeito. Você dominou o conteúdo."
                  : percent >= 60
                    ? "Bom resultado. Revise as explicações acima e tente de novo."
                    : "Vale reler a lição com calma e tentar novamente."}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={handleRetry}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Tentar de novo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <Button type="submit" size="lg" disabled={!profile}>
              Ver resultado
            </Button>
            {!profile ? <ProfileRequiredNotice action="registrar o resultado do quiz" /> : null}
          </div>
        )}
      </form>
    </section>
  );
}
