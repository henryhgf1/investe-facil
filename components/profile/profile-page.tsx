"use client";

import { BookOpen, Plus, Sparkles, Target, Trophy, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { ProgressTools } from "@/components/learn/progress-tools";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileList } from "@/components/profile/profile-list";
import { ResetProgress } from "@/components/profile/reset-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Progress } from "@/components/ui/progress";
import { readyLessons } from "@/content/lessons";
import { missions } from "@/content/missions";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { MAX_PROFILES, useActiveProfile, useProfiles } from "@/lib/store/progress";
import { levelForXp } from "@/lib/xp";

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-4">
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
  const profile = useActiveProfile();
  const profiles = useProfiles();
  const [message, setMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  if (!hydrated) {
    return (
      <Container className="max-w-4xl py-12 sm:py-16">
        <div aria-hidden="true" className="space-y-4">
          <div className="border-line bg-surface h-24 animate-pulse rounded-2xl border" />
          <div className="border-line bg-surface h-64 animate-pulse rounded-2xl border" />
        </div>
      </Container>
    );
  }

  const showCreateForm = !profile || creating;
  const info = levelForXp(profile?.xp ?? 0);
  const completedLessons = Object.keys(profile?.lessons ?? {}).length;
  const completedMissions = Object.keys(profile?.missions ?? {}).length;
  const formKey = showCreateForm ? "novo-perfil" : (profile?.id ?? "novo-perfil");

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
          Até {MAX_PROFILES} perfis por navegador, cada um com o próprio progresso. Nome e avatar
          identificam você. Nada é enviado para servidor e não existe senha.
        </p>
      </div>

      <section
        aria-labelledby="dados-perfil"
        className="border-line bg-surface mt-8 overflow-hidden rounded-3xl border"
      >
        <div className="border-line flex flex-wrap items-start gap-4 border-b px-6 py-5 sm:px-8">
          <ProfileAvatar avatarId={showCreateForm ? null : profile?.avatarId} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
              {showCreateForm ? "Novo perfil" : "Perfil ativo"}
            </p>
            <h2 id="dados-perfil" className="font-display text-ink mt-1 text-xl font-bold">
              {showCreateForm ? "Crie seu perfil" : profile?.name}
            </h2>
            <p className="text-muted mt-1 text-sm leading-6">
              {showCreateForm
                ? "Escolha um nome e um avatar. O novo perfil começa sem progresso e pode ser trocado depois."
                : `Nível ${info.level}, ${profile?.xp ?? 0} XP acumulados neste perfil.`}
            </p>
          </div>

          {!showCreateForm && profiles.length < MAX_PROFILES ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreating(true);
                setMessage(null);
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              Adicionar perfil
            </Button>
          ) : null}
        </div>

        <div className="px-6 pb-6 sm:px-8">
          {message ? (
            <p
              role="status"
              className="bg-brand-50 text-brand-800 mt-6 rounded-xl px-4 py-3 text-sm"
            >
              {message}
            </p>
          ) : null}
          <ProfileForm
            key={formKey}
            profile={showCreateForm ? null : profile}
            mode={showCreateForm ? "create" : "edit"}
            onDone={(text) => {
              setMessage(text);
              setCreating(false);
            }}
            onCancel={showCreateForm && profile ? () => setCreating(false) : undefined}
          />
        </div>
      </section>

      <ProfileList onMessage={setMessage} />

      {profile && !showCreateForm ? (
        <>
          <section
            aria-labelledby="resumo-perfil"
            className="border-line bg-surface mt-6 rounded-3xl border p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">
                  Resumo
                </p>
                <h2 id="resumo-perfil" className="font-display text-ink mt-1 text-xl font-bold">
                  Progresso de {profile.name}
                </h2>
              </div>
              <p className="text-muted text-sm">
                Nível <strong className="text-ink font-semibold">{info.level}</strong> de 8
              </p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat icon={Trophy} label="Nível" value={String(info.level)} />
              <Stat icon={Sparkles} label="Experiência" value={`${profile.xp} XP`} />
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
      ) : null}

      <div className="mt-6">
        <ProgressTools />
      </div>
    </Container>
  );
}
