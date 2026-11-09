"use client";

import { ArrowRight, Check, Clock, Lock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { lessonsOfModule } from "@/content/lessons";
import { modules } from "@/content/modules";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useActiveProfile } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const accentStyles = {
  brand: { text: "text-brand-700", bg: "bg-brand-50", bar: "bg-brand-600" },
  accent: { text: "text-accent", bg: "bg-accent-soft", bar: "bg-accent" },
  warn: { text: "text-warn", bg: "bg-warn-soft", bar: "bg-warn" },
} as const;

export function TrilhaList() {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const completedLessons = profile?.lessons ?? {};

  return (
    <div className="space-y-10">
      {modules.map((module) => {
        const moduleLessons = lessonsOfModule(module.id);
        const done = moduleLessons.filter((lesson) => completedLessons[lesson.slug]).length;
        const percent = moduleLessons.length > 0 ? (done / moduleLessons.length) * 100 : 0;
        const accent = accentStyles[module.accent];

        return (
          <section key={module.id} aria-labelledby={`modulo-${module.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <span
                  className={cn(
                    "font-display flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold",
                    accent.bg,
                    accent.text,
                  )}
                  aria-hidden="true"
                >
                  {String(module.order).padStart(2, "0")}
                </span>
                <div>
                  <h2
                    id={`modulo-${module.id}`}
                    className="font-display text-ink text-xl font-bold"
                  >
                    {module.title}
                  </h2>
                  <p className="text-muted mt-1 max-w-2xl text-sm leading-6">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-44">
                <p className="text-muted mb-1.5 text-xs tabular-nums">
                  {hydrated
                    ? `${done} de ${moduleLessons.length} lições`
                    : `${moduleLessons.length} lições`}
                </p>
                <Progress
                  value={hydrated ? percent : 0}
                  label={`Progresso do módulo ${module.title}`}
                  size="sm"
                  barClassName={accent.bar}
                />
              </div>
            </div>

            <ol className="mt-5 space-y-2">
              {moduleLessons.map((lesson) => {
                const isDone = hydrated && Boolean(completedLessons[lesson.slug]);
                const isSoon = lesson.status === "soon";

                const content = (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        isDone
                          ? "border-brand-600 bg-brand-600 text-white"
                          : isSoon
                            ? "border-line bg-canvas text-slate-400"
                            : "border-brand-600/30 text-brand-700 bg-white",
                      )}
                    >
                      {isDone ? (
                        <Check className="size-4" />
                      ) : isSoon ? (
                        <Lock className="size-3.5" />
                      ) : (
                        lesson.order
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn("block font-semibold", isSoon ? "text-muted" : "text-ink")}
                      >
                        {lesson.title}
                      </span>
                      <span className="text-muted mt-0.5 block text-sm leading-6">
                        {lesson.summary}
                      </span>
                      <span className="text-muted mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {lesson.durationMin} min
                        </span>
                        <span>+{lesson.status === "ready" ? 20 : 0} XP</span>
                      </span>
                    </span>

                    <span className="ml-auto flex shrink-0 items-center gap-2 self-center">
                      {isSoon ? (
                        <Badge variant="outline">Em breve</Badge>
                      ) : isDone ? (
                        <Badge variant="brand">Concluída</Badge>
                      ) : (
                        <span className="text-brand-700 inline-flex items-center gap-1 text-sm font-semibold">
                          Começar
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                  </>
                );

                return (
                  <li key={lesson.slug}>
                    {isSoon ? (
                      <div className="border-line flex items-start gap-3 rounded-xl border border-dashed bg-white/50 px-4 py-3">
                        {content}
                      </div>
                    ) : (
                      <Link
                        href={`/trilha/${lesson.module}/${lesson.slug}/`}
                        className="border-line hover:border-brand-600/40 hover:bg-brand-50/40 flex items-start gap-3 rounded-xl border bg-white px-4 py-3 transition-colors"
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
