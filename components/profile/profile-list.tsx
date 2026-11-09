"use client";

import { Check, Trash2 } from "lucide-react";
import { useState } from "react";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MAX_PROFILES } from "@/lib/store/progress";
import type { Profile } from "@/lib/store/progress";
import { useActiveProfile, useProfiles, useProgressStore } from "@/lib/store/progress";
import { levelForXp } from "@/lib/xp";

export function ProfileList({ onMessage }: { onMessage: (message: string) => void }) {
  const profiles = useProfiles();
  const active = useActiveProfile();
  const switchProfile = useProgressStore((state) => state.switchProfile);
  const deleteProfile = useProgressStore((state) => state.deleteProfile);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [word, setWord] = useState("");

  function handleSwitch(profile: Profile) {
    switchProfile(profile.id);
    onMessage(`Agora você está usando o perfil ${profile.name}.`);
  }

  function startDelete(id: string) {
    setDeletingId(id);
    setWord("");
  }

  function cancelDelete() {
    setDeletingId(null);
    setWord("");
  }

  function confirmDelete(profile: Profile) {
    const index = profiles.findIndex((item) => item.id === profile.id);
    const remaining = profiles.filter((item) => item.id !== profile.id);
    const next = remaining[Math.min(index, remaining.length - 1)];

    deleteProfile(profile.id);
    setDeletingId(null);
    setWord("");

    if (remaining.length === 0) {
      onMessage("Perfil apagado. Crie um novo perfil para voltar a registrar progresso.");
    } else if (profile.id === active?.id) {
      onMessage(`Perfil apagado. Agora o perfil ${next?.name ?? remaining[0].name} está ativo.`);
    } else {
      onMessage(`Perfil ${profile.name} apagado.`);
    }
  }

  if (profiles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="lista-perfis"
      className="border-line mt-6 overflow-hidden rounded-3xl border bg-white"
    >
      <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 sm:px-8">
        <div>
          <p className="text-brand-700 text-xs font-semibold tracking-widest uppercase">Perfis</p>
          <h2 id="lista-perfis" className="font-display text-ink mt-1 text-xl font-bold">
            Neste navegador
          </h2>
          <p className="text-muted mt-1 text-sm leading-6">
            Cada perfil tem XP, lições, quizzes, missões e badges próprios. Você pode manter até{" "}
            {MAX_PROFILES} perfis.
          </p>
        </div>
        <p className="text-muted text-sm tabular-nums">
          <strong className="text-ink font-semibold">{profiles.length}</strong> de {MAX_PROFILES}
        </p>
      </div>

      <ul className="divide-line divide-y px-6 sm:px-8">
        {profiles.map((profile) => {
          const isActive = profile.id === active?.id;
          const info = levelForXp(profile.xp);
          const deleting = deletingId === profile.id;
          const confirmed = word.trim().toUpperCase() === "APAGAR";

          return (
            <li key={profile.id} className="py-4">
              <div className="flex flex-wrap items-center gap-3">
                <ProfileAvatar avatarId={profile.avatarId} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-ink font-display truncate text-base font-bold">
                      {profile.name}
                    </p>
                    {isActive ? (
                      <Badge variant="brand">
                        <Check className="size-3" aria-hidden="true" />
                        Ativo
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-muted mt-0.5 text-xs">
                    Nível {info.level} · {profile.xp} XP
                  </p>
                </div>

                {!isActive ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSwitch(profile)}
                  >
                    Usar este perfil
                  </Button>
                ) : null}

                {!deleting ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:bg-red-50"
                    onClick={() => startDelete(profile.id)}
                  >
                    Apagar perfil
                  </Button>
                ) : null}
              </div>

              {deleting ? (
                <div
                  role="group"
                  aria-label={`Confirmar exclusão do perfil ${profile.name}`}
                  className="border-danger/25 mt-3 rounded-xl border bg-red-50 p-3"
                >
                  <label
                    htmlFor={`delete-${profile.id}`}
                    className="text-sm leading-6 text-slate-800"
                  >
                    Digite <strong className="font-semibold">APAGAR</strong> para remover o perfil{" "}
                    <strong className="font-semibold">{profile.name}</strong>. Todo o progresso dele
                    será perdido.
                  </label>
                  <input
                    id={`delete-${profile.id}`}
                    type="text"
                    value={word}
                    onChange={(event) => setWord(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    className="border-line focus:border-danger focus:ring-danger/20 mt-2 h-10 w-full rounded-xl border bg-white px-3 font-mono text-sm tracking-widest text-slate-800 uppercase outline-none focus:ring-4"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={cancelDelete}>
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={!confirmed}
                      onClick={() => confirmDelete(profile)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Apagar perfil
                    </Button>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
