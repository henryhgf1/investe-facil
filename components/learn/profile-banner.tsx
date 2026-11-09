"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { buttonStyles } from "@/components/ui/button";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useProgressStore } from "@/lib/store/progress";

export function ProfileBanner() {
  const hydrated = useHydrated();
  const profile = useProgressStore((state) => state.profile);

  if (!hydrated || profile) return null;

  return (
    <section
      aria-labelledby="perfil-banner"
      className="border-brand-600/20 bg-brand-50 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <ProfileAvatar avatarId={null} size="md" />
        <div>
          <h2 id="perfil-banner" className="font-display text-ink text-base font-bold">
            Crie seu perfil para guardar o progresso
          </h2>
          <p className="text-muted mt-1 text-sm leading-6">
            Nome e avatar, nada mais. Sem cadastro, sem senha e sem enviar dados para servidor.
          </p>
        </div>
      </div>
      <Link href="/perfil/" className={buttonStyles({ className: "shrink-0" })}>
        Criar perfil
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
