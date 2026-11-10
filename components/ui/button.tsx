import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-sm hover:bg-primary-hover hover:shadow-md active:translate-y-px",
  secondary:
    "border border-line bg-surface text-ink shadow-sm hover:border-line-strong hover:bg-surface-2",
  ghost: "text-link hover:bg-brand-50",
  outline: "border border-brand-600/40 text-link hover:border-brand-600 hover:bg-brand-50",
  danger: "bg-danger text-on-danger shadow-sm hover:bg-danger-strong",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}
