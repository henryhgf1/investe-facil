"use client";

import {
  Award,
  Brain,
  Compass,
  Crown,
  Flame,
  Footprints,
  GraduationCap,
  Hammer,
  Lock,
  Medal,
  Star,
  Target,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { badgeStatus, badges, type BadgeStatus } from "@/lib/badges";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useActiveProfile } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

const icons: Record<string, typeof Trophy> = {
  "primeiro-passo": Footprints,
  curioso: Compass,
  "trilha-concluida": GraduationCap,
  "nota-dez": Target,
  "mente-fria": Brain,
  "hora-extra": Flame,
  "mao-na-massa": Hammer,
  praticante: Medal,
  "nivel-4": Star,
  "nivel-6": Award,
  "nivel-maximo": Crown,
  "investidor-completo": Trophy,
};

const accentStyles = {
  brand: {
    card: "border-brand-600/25 bg-brand-50",
    icon: "bg-primary text-on-primary",
  },
  accent: {
    card: "border-accent/20 bg-accent-soft",
    icon: "bg-accent text-on-accent",
  },
  warn: {
    card: "border-warn/25 bg-warn-soft",
    icon: "bg-warn text-on-warn",
  },
} as const;

function BadgeItem({ badge }: { badge: BadgeStatus }) {
  const Icon = icons[badge.id] ?? Trophy;
  const styles = accentStyles[badge.accent];

  return (
    <article
      className={cn(
        "rounded-2xl border p-4",
        badge.earned ? styles.card : "border-line bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            badge.earned ? styles.icon : "bg-surface-2 text-muted",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {badge.earned ? (
          <Badge variant="brand">Conquistada</Badge>
        ) : (
          <span className="text-muted inline-flex items-center gap-1 text-xs font-semibold">
            <Lock className="size-3.5" aria-hidden="true" />
            Bloqueada
          </span>
        )}
      </div>

      <h3
        className={cn(
          "font-display mt-3 text-base font-bold",
          badge.earned ? "text-ink" : "text-muted",
        )}
      >
        {badge.title}
      </h3>
      <p className="text-muted mt-1 text-sm leading-6">
        {badge.earned ? badge.description : badge.hint}
      </p>
    </article>
  );
}

export function BadgeGrid() {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const xp = profile?.xp ?? 0;
  const lessons = profile?.lessons ?? {};
  const quizzes = profile?.quizzes ?? {};
  const missions = profile?.missions ?? {};

  const status = badgeStatus({ xp, lessons, quizzes, missions });
  const earned = status.filter((badge) => badge.earned).length;
  const percent = badges.length > 0 ? (earned / badges.length) * 100 : 0;

  if (!hydrated) {
    return <div aria-hidden="true" className="border-line skeleton h-64 rounded-2xl border" />;
  }

  return (
    <section aria-labelledby="conquistas">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="conquistas" className="font-display text-ink text-xl font-bold">
            Conquistas
          </h2>
          <p className="text-muted mt-1 text-sm">
            As badges aparecem sozinhas conforme você aprende e pratica.
          </p>
        </div>
        <p className="text-muted text-sm">
          <strong className="text-ink font-semibold tabular-nums">{earned}</strong> de{" "}
          {badges.length} conquistadas
        </p>
      </div>

      <Progress
        className="mt-4"
        value={percent}
        label={`${earned} de ${badges.length} conquistas desbloqueadas`}
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {status.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  );
}
