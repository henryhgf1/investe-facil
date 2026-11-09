"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Button } from "@/components/ui/button";
import { DEFAULT_AVATAR_ID, PROFILE_AVATARS } from "@/content/profile";
import type { Profile } from "@/lib/store/progress";
import { useProgressStore } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export function ProfileForm({
  profile,
  onSaved,
}: {
  profile: Profile | null;
  onSaved: () => void;
}) {
  const saveProfile = useProgressStore((state) => state.saveProfile);
  const [name, setName] = useState(profile?.name ?? "");
  const [avatarId, setAvatarId] = useState(profile?.avatarId ?? DEFAULT_AVATAR_ID);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Escolha um nome com pelo menos 2 letras.");
      return;
    }

    saveProfile(trimmed, avatarId);
    setError(null);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label htmlFor="profile-name" className="text-ink text-sm font-semibold">
          Nome
        </label>
        <input
          id="profile-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          maxLength={24}
          autoComplete="nickname"
          required
          aria-describedby="profile-name-help"
          className="border-line focus:border-brand-600 focus:ring-brand-600/20 mt-1.5 h-11 w-full rounded-xl border bg-white px-3 text-[15px] text-slate-800 outline-none focus:ring-4"
        />
        <p id="profile-name-help" className="text-muted mt-1.5 text-xs leading-5">
          Pode ser um apelido. Nada é enviado para servidor.
        </p>
      </div>

      <fieldset>
        <legend className="text-ink text-sm font-semibold">Avatar</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROFILE_AVATARS.map((avatar) => {
            const selected = avatarId === avatar.id;

            return (
              <label
                key={avatar.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  "has-[:focus-visible]:outline-brand-600 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                  selected
                    ? "border-brand-600 bg-brand-50"
                    : "border-line hover:border-brand-600/40 hover:bg-canvas",
                )}
              >
                <input
                  type="radio"
                  name="avatar"
                  value={avatar.id}
                  checked={selected}
                  onChange={() => setAvatarId(avatar.id)}
                  className="sr-only"
                />
                <ProfileAvatar avatarId={avatar.id} size="sm" />
                <span className={cn("font-medium", selected ? "text-brand-800" : "text-slate-700")}>
                  {avatar.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">
          <Save className="size-4" aria-hidden="true" />
          {profile ? "Salvar perfil" : "Criar perfil"}
        </Button>
        <p className="text-muted text-xs leading-5">
          O perfil fica salvo apenas neste navegador, junto com o progresso.
        </p>
      </div>

      {error ? (
        <p role="alert" className="bg-warn-soft text-warn rounded-xl px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
