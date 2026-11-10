"use client";

import { Check, ChevronDown, Settings2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useActiveProfile, useProfiles, useProgressStore } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export function ProfileSwitcher() {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const profiles = useProfiles();
  const switchProfile = useProgressStore((state) => state.switchProfile);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!open) return;
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || !open) return;

      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!hydrated) {
    return <div aria-hidden="true" className="size-11" />;
  }

  if (!profile) {
    return (
      <Link
        href="/perfil/"
        className="border-line text-ink hover:border-brand-600/40 hover:bg-brand-50 bg-surface flex h-11 items-center gap-2 rounded-xl border px-2.5 transition-colors"
        aria-label="Criar perfil"
      >
        <ProfileAvatar avatarId={null} size="sm" />
        <span className="hidden text-sm font-semibold lg:inline">Criar perfil</span>
      </Link>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="seletor-perfis"
        aria-label={`Trocar de perfil. Perfil ativo: ${profile.name}`}
        className="border-line text-ink hover:border-brand-600/40 hover:bg-brand-50 bg-surface flex h-11 items-center gap-2 rounded-xl border px-2.5 transition-colors"
      >
        <ProfileAvatar avatarId={profile.avatarId} size="sm" />
        <span className="hidden max-w-28 truncate text-sm font-semibold lg:inline">
          {profile.name}
        </span>
        <ChevronDown
          className={cn("text-muted size-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id="seletor-perfis"
          role="menu"
          aria-label="Trocar de perfil"
          className="border-line bg-surface absolute right-0 z-50 mt-2 w-64 rounded-2xl border p-2 shadow-xl"
        >
          <p className="text-muted px-3 py-2 text-xs font-semibold tracking-wide uppercase">
            Trocar de perfil
          </p>
          <ul className="space-y-1">
            {profiles.map((item) => {
              const isActive = item.id === profile.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => {
                      switchProfile(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "hover:bg-canvas flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors",
                      isActive && "bg-brand-50",
                    )}
                  >
                    <ProfileAvatar avatarId={item.avatarId} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="text-ink block truncate text-sm font-semibold">
                        {item.name}
                      </span>
                      <span className="text-muted block text-xs">{item.xp} XP</span>
                    </span>
                    {isActive ? (
                      <Check className="text-brand-700 size-4 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-line mt-2 border-t pt-2">
            <Link
              href="/perfil/"
              onClick={() => setOpen(false)}
              className="hover:bg-canvas text-brand-700 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
            >
              <Settings2 className="size-4" aria-hidden="true" />
              Gerenciar perfis
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
