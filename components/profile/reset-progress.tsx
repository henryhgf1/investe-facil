"use client";

import { RotateCcw, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { lessons } from "@/content/lessons";
import { missions } from "@/content/missions";
import { modules } from "@/content/modules";
import { useProgressStore } from "@/lib/store/progress";

function ItemResetButton({
  label,
  description,
  onConfirm,
  onDone,
}: {
  label: string;
  description: string;
  onConfirm: () => void;
  onDone: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-danger hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <Undo2 className="size-4" aria-hidden="true" />
        Apagar
      </Button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Confirmar remoção de ${label}`}
      className="border-danger/25 w-full rounded-xl border bg-red-50 p-3"
    >
      <p className="text-sm leading-6 text-slate-800">
        <strong className="font-semibold">Tem certeza?</strong> {description}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => {
            onConfirm();
            setOpen(false);
            onDone("Progresso apagado.");
          }}
        >
          Sim, apagar
        </Button>
      </div>
    </div>
  );
}

function BulkReset({
  id,
  title,
  description,
  confirmWord,
  successMessage,
  onConfirm,
  onDone,
}: {
  id: string;
  title: string;
  description: string;
  confirmWord: string;
  successMessage: string;
  onConfirm: () => void;
  onDone: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const confirmed = word.trim().toUpperCase() === confirmWord;
  const inputId = `reset-${id}`;

  return (
    <div className="border-line rounded-2xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="bg-warn-soft text-warn flex size-9 shrink-0 items-center justify-center rounded-xl">
          <RotateCcw className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-ink text-sm font-semibold">{title}</p>
          <p className="text-muted mt-1 text-xs leading-5">{description}</p>
        </div>
      </div>

      {open ? (
        <div className="border-danger/25 mt-3 rounded-xl border bg-red-50 p-3">
          <label htmlFor={inputId} className="text-sm leading-6 text-slate-800">
            Digite <strong className="font-semibold">{confirmWord}</strong> para confirmar.
          </label>
          <input
            id={inputId}
            type="text"
            value={word}
            onChange={(event) => setWord(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="border-line focus:border-danger focus:ring-danger/20 mt-2 h-10 w-full rounded-xl border bg-white px-3 font-mono text-sm tracking-widest text-slate-800 uppercase outline-none focus:ring-4"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setOpen(false);
                setWord("");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={!confirmed}
              onClick={() => {
                onConfirm();
                setOpen(false);
                setWord("");
                onDone(successMessage);
              }}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Apagar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={() => setOpen(true)}
        >
          {title}
        </Button>
      )}
    </div>
  );
}

export function ResetProgress() {
  const lessonState = useProgressStore((state) => state.lessons);
  const missionState = useProgressStore((state) => state.missions);
  const resetLesson = useProgressStore((state) => state.resetLesson);
  const resetMission = useProgressStore((state) => state.resetMission);
  const resetMissions = useProgressStore((state) => state.resetMissions);
  const resetTrail = useProgressStore((state) => state.resetTrail);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const [feedback, setFeedback] = useState<string | null>(null);

  const completedLessons = lessons.filter((lesson) => Boolean(lessonState[lesson.slug]));
  const lessonGroups = modules
    .map((module) => ({
      module,
      items: completedLessons.filter((lesson) => lesson.module === module.id),
    }))
    .filter((group) => group.items.length > 0);
  const completedMissions = missions.filter((mission) => Boolean(missionState[mission.id]));
  const hasLessons = completedLessons.length > 0;
  const hasMissions = completedMissions.length > 0;
  const hasProgress = hasLessons || hasMissions;

  return (
    <section
      aria-labelledby="recomecar"
      className="border-line overflow-hidden rounded-3xl border bg-white"
    >
      <div className="border-line border-b px-6 py-5 sm:px-8">
        <p className="text-warn text-xs font-bold tracking-widest uppercase">Controle</p>
        <h2 id="recomecar" className="font-display text-ink mt-1 text-xl font-bold">
          Recomeçar
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Apague uma conclusão específica ou reinicie uma parte inteira. Toda ação pede confirmação
          antes de apagar.
        </p>
      </div>

      <div className="space-y-8 px-6 py-6 sm:px-8">
        {feedback ? (
          <p role="status" className="bg-brand-50 text-brand-800 rounded-xl px-4 py-3 text-sm">
            {feedback}
          </p>
        ) : null}

        <div>
          <h3 className="font-display text-ink text-base font-bold">Lições concluídas</h3>
          {lessonGroups.length > 0 ? (
            <div className="mt-3 space-y-5">
              {lessonGroups.map((group) => (
                <div key={group.module.id}>
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                    {group.module.shortTitle}
                  </p>
                  <ul className="divide-line mt-1 divide-y">
                    {group.items.map((lesson) => (
                      <li
                        key={lesson.slug}
                        className="flex flex-wrap items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-ink text-sm font-semibold">{lesson.title}</p>
                          <p className="text-muted mt-0.5 text-xs">
                            Lição {lesson.order} · remove também o resultado do quiz
                          </p>
                        </div>
                        <ItemResetButton
                          label={lesson.title}
                          description="A conclusão desta lição e o resultado do quiz serão apagados."
                          onConfirm={() => resetLesson(lesson.slug)}
                          onDone={setFeedback}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted mt-2 text-sm">Nenhuma lição concluída ainda.</p>
          )}
        </div>

        <div>
          <h3 className="font-display text-ink text-base font-bold">Missões concluídas</h3>
          {hasMissions ? (
            <ul className="divide-line mt-1 divide-y">
              {completedMissions.map((mission) => (
                <li
                  key={mission.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-ink text-sm font-semibold">{mission.title}</p>
                    <p className="text-muted mt-0.5 text-xs">Missão prática</p>
                  </div>
                  <ItemResetButton
                    label={mission.title}
                    description="A conclusão desta missão e o XP dela serão apagados."
                    onConfirm={() => resetMission(mission.id)}
                    onDone={setFeedback}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mt-2 text-sm">Nenhuma missão concluída ainda.</p>
          )}
        </div>

        {hasProgress ? (
          <div>
            <h3 className="font-display text-ink text-base font-bold">Ações em massa</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {hasLessons ? (
                <BulkReset
                  id="trilha"
                  title="Recomeçar a trilha"
                  description="Apaga todas as lições e quizzes. As missões e o perfil continuam."
                  confirmWord="RECOMEÇAR"
                  successMessage="Trilha reiniciada."
                  onConfirm={resetTrail}
                  onDone={setFeedback}
                />
              ) : null}
              {hasMissions ? (
                <BulkReset
                  id="missoes"
                  title="Recomeçar as missões"
                  description="Apaga todas as missões concluídas. A trilha e o perfil continuam."
                  confirmWord="RECOMEÇAR"
                  successMessage="Missões reiniciadas."
                  onConfirm={resetMissions}
                  onDone={setFeedback}
                />
              ) : null}
              <BulkReset
                id="tudo"
                title="Apagar todo o progresso"
                description="Zera XP, lições, quizzes e missões. Seu perfil continua salvo."
                confirmWord="APAGAR"
                successMessage="Todo o progresso foi apagado."
                onConfirm={resetProgress}
                onDone={setFeedback}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
