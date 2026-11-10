"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Button } from "@/components/ui/button";
import { DEFAULT_AVATAR_ID, PROFILE_AVATARS } from "@/content/profile";
import type { Profile } from "@/lib/store/progress";
import { useProgressStore } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export type ProfileFormMode = "create" | "edit";

export function ProfileForm({
  profile = null,
  mode = profile ? "edit" : "create",
  onDone,
  onCancel,
}: {
  profile?: Profile | null;
  mode?: ProfileFormMode;
  onDone: (message: string) => void;
  onCancel?: () => void;
}) {
  const createProfile = useProgressStore((state) => state.createProfile);
  const updateProfile = useProgressStore((state) => state.updateProfile);
  const [name, setName] = useState(mode === "edit" ? (profile?.name ?? "") : "");
  const [avatarId, setAvatarId] = useState(
    mode === "edit" ? (profile?.avatarId ?? DEFAULT_AVATAR_ID) : DEFAULT_AVATAR_ID,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = mode === "edit" ? updateProfile(name, avatarId) : createProfile(name, avatarId);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    onDone("Perfil salvo.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label htmlFor={`profile-name-${mode}`} className="text-ink text-sm font-semibold">
          Nome
        </label>
        <input
          id={`profile-name-${mode}`}
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          maxLength={24}
          autoComplete="nickname"
          required
          aria-describedby={`profile-name-help-${mode}`}
          className="border-line focus:border-brand-600 focus:ring-brand-600/20 bg-surface text-ink mt-1.5 h-11 w-full rounded-xl border px-3 text-[15px] outline-none focus:ring-4"
        />
        <p id={`profile-name-help-${mode}`} className="text-muted mt-1.5 text-xs leading-5">
          De 2 a 24 caracteres. Pode ser um apelido. Nada é enviado para servidor.
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
                  name={`avatar-${mode}`}
                  value={avatar.id}
                  checked={selected}
                  onChange={() => setAvatarId(avatar.id)}
                  className="sr-only"
                />
                <ProfileAvatar avatarId={avatar.id} size="sm" />
                <span className={cn("font-medium", selected ? "text-brand-800" : "text-body")}>
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
          {mode === "edit" ? "Salvar perfil" : "Criar perfil"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <p className="text-muted text-xs leading-5">
          {mode === "edit"
            ? "O perfil e o progresso ficam salvos apenas neste navegador."
            : "O novo perfil começa com o progresso zerado e pode ser trocado depois."}
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
