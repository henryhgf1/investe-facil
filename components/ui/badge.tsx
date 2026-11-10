import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "brand" | "accent" | "warn" | "neutral" | "outline";

const variants: Record<BadgeVariant, string> = {
  brand: "bg-brand-50 text-brand-800 border-brand-600/20",
  accent: "bg-accent-soft text-accent border-accent/20",
  warn: "bg-warn-soft text-warn border-warn/25",
  neutral: "bg-surface-2 text-body border-line",
  outline: "bg-transparent text-muted border-line-strong",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
