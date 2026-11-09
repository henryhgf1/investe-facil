import { Compass, Leaf, LineChart, PiggyBank, Rocket, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getProfileAvatar, type ProfileAvatarTone } from "@/content/profile";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  folha: Leaf,
  foguete: Rocket,
  cofrinho: PiggyBank,
  grafico: LineChart,
  escudo: ShieldCheck,
  bussola: Compass,
};

const tones: Record<ProfileAvatarTone, string> = {
  brand: "bg-brand-50 text-brand-700",
  accent: "bg-accent-soft text-accent",
  warn: "bg-warn-soft text-warn",
  danger: "bg-red-50 text-danger",
  neutral: "bg-slate-100 text-slate-600",
};

const sizeClasses = {
  sm: { wrapper: "size-10 rounded-xl", icon: "size-5" },
  md: { wrapper: "size-12 rounded-2xl", icon: "size-6" },
  lg: { wrapper: "size-16 rounded-2xl", icon: "size-8" },
} as const;

export function ProfileAvatar({
  avatarId,
  size = "md",
  className,
}: {
  avatarId: string | null | undefined;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  const avatar = getProfileAvatar(avatarId);
  const Icon = icons[avatar.id] ?? Leaf;
  const classes = sizeClasses[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center",
        classes.wrapper,
        tones[avatar.tone],
        className,
      )}
    >
      <Icon className={classes.icon} />
    </span>
  );
}
