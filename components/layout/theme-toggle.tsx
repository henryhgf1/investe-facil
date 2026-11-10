"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useHydrated } from "@/lib/hooks/use-hydrated";
import { setTheme, useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

export function ThemeToggle() {
  const hydrated = useHydrated();
  const { theme } = useTheme();
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

  const current = options.find((option) => option.value === theme) ?? options[2];
  const CurrentIcon = current.icon;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="seletor-tema"
        aria-label={`Tema: ${current.label}. Trocar tema`}
        className="border-line text-ink hover:border-brand-600/40 hover:bg-brand-50 bg-surface flex size-11 items-center justify-center rounded-xl border transition-colors"
      >
        <CurrentIcon className="size-[18px]" aria-hidden="true" />
      </button>

      {open ? (
        <div
          id="seletor-tema"
          role="menu"
          aria-label="Escolher tema"
          className="border-line bg-surface absolute right-0 z-50 mt-2 w-48 rounded-2xl border p-2 shadow-xl"
        >
          <p className="text-muted px-3 py-2 text-xs font-semibold tracking-wide uppercase">Tema</p>
          <ul className="space-y-1">
            {options.map((option) => {
              const Icon = option.icon;
              const active = option.value === theme;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setTheme(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "hover:bg-canvas flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors",
                      active && "bg-brand-50",
                    )}
                  >
                    <span className="bg-surface-2 text-brand-700 flex size-8 items-center justify-center rounded-lg">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="text-ink flex-1 text-sm font-semibold">{option.label}</span>
                    {active ? (
                      <Check className="text-brand-700 size-4 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
