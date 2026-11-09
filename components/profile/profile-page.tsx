"use client";

import { BookOpen, Sparkles, Target, Trophy, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { ProgressTools } from "@/components/learn/progress-tools";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { ResetProgress } from "@/components/profile/reset-progress";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Progress } from "@/components/ui/progress";
import { readyLessons } from "@/content/lessons";
import { missions } from "@/content/missions";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";
import { levelForXp } from "@/lib/xp";

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border-line rounded-2xl border bg-white p-4">
      <span className="bg-brand-50 text-brand-700 flex size-9 items-center justify-center rounded-xl">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <dt className="text-muted mt-3 text-xs font-semibold tracking-wide uppercase">{label}</dt>
      <dd className="font-display text-ink mt-1 text-lg font-extrabold tabular-nums">{value}</dd>
    </div>
  );
}

export function ProfilePage() {
  const hydrated = useHydrated();
  const profile = useProgressStore((state) => state.profile);
  const xp = useProgressStore((state) => state.xp);
  const lessonState = useProgressStore((state) => state.lessons);
  const missionState = useProgressStore((state) => state.missions);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <Container className="max-w-4xl py-12 sm:py-16">
        <div aria-hidden="true" className="space-y-4">
          <div className="border-line h-24 animate-pulse rounded-2xl border bg-white" />
          <div className="border-line h-64 animate-pulse rounded-2xl border bg-white" />
        </div>
      </Container>
    );
  }

  const info = levelForXp(xp);
  const completedLessons = Object.keys(lessonState).length;
  const completedMissions = Object.keys(missionState).length;

  return (
    <Container className="max-w-4xl py-12 sm:py-16">
      <div className="max-w-2xl">
        <Badge variant="brand">
          <UserRound className="size-3.5" aria-hidden="true" />
          Seu espaço
        </Badge>
        <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
          Seu perfil
        </h1>
        <p className="text-muted mt-4 text-base leading-7">
          Nome e avatar para identificar seu progresso neste navegador. Nada é enviado para servidor
          e não existe senha.
        </p>
      </div>

      <section
        aria-labelledby="dados-perfil"
        className="border-line mt-8 overflow-hidden rounded-3xl border bg-white"
      >
        <div className="border-line flex items-start gap-4 border-b px-6 py-5 sm:px-8">
          <ProfileAvatar avatarId={profile?.avatarId} size="lg" />
          <div className="min-w-0">
            <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
              {profile ? "Perfil local" : "Comece por aqui"}
            </p>
            <h2 id="dados-perfil" className="font-display text-ink mt-1 text-xl font-bold">
              {profile?.name ?? "Crie seu perfil"}
            </h2>
            <p className="text-muted mt-1 text-sm leading-6">
              {profile
                ? `Nível ${info.level}, ${xp} XP acumulados.`
                : "Só o nome e um avatar. Leva menos de um minuto e libera o registro do progresso."}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 sm:px-8">
          {formMessage ? (
            <p
              role="status"
              className="bg-brand-50 text-brand-800 mt-6 rounded-xl px-4 py-3 text-sm"
            >
              {formMessage}
            </p>
          ) : null}
          <ProfileForm
            key={profile?.createdAt ?? "novo-perfil"}
            profile={profile}
            onSaved={() => setFormMessage("Perfil salvo.")}
          />
        </div>
      </section>

      {profile ? (
        <>
          <section
            aria-labelledby="resumo-perfil"
            className="border-line mt-6 rounded-3xl border bg-white p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
                  Resumo
                </p>
                <h2 id="resumo-perfil" className="font-display text-ink mt-1 text-xl font-bold">
                  Seu progresso
                </h2>
              </div>
              <p className="text-muted text-sm">
                Nível <strong className="text-ink font-semibold">{info.level}</strong> de 8
              </p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat icon={Trophy} label="Nível" value={String(info.level)} />
              <Stat icon={Sparkles} label="Experiência" value={`${xp} XP`} />
              <Stat
                icon={BookOpen}
                label="Lições"
                value={`${completedLessons} de ${readyLessons.length}`}
              />
              <Stat
                icon={Target}
                label="Missões"
                value={`${completedMissions} de ${missions.length}`}
              />
            </dl>

            <div className="mt-5 space-y-1.5">
              <Progress
                value={info.progressPercent}
                label={`Progresso para o nível ${info.level + 1}`}
              />
              <p className="text-muted text-xs">
                {info.xpToNextLevel === null
                  ? "Nível máximo por enquanto."
                  : `Faltam ${info.xpToNextLevel} XP para o nível ${info.level + 1}.`}
              </p>
            </div>
          </section>

          <div className="mt-6">
            <ResetProgress />
          </div>
        </>
      ) : (
        <div className="border-line bg-canvas mt-6 rounded-2xl border p-5">
          <p className="text-ink text-sm font-semibold">Depois de criar o perfil</p>
          <p className="text-muted mt-1 text-sm leading-6">
            Você poderá apagar uma missão ou lição específica, recomeçar a trilha ou zerar todo o
            progresso sem perder o perfil.
          </p>
        </div>
      )}

      <div className="mt-6">
        <ProgressTools />
      </div>
    </Container>
  );
}
