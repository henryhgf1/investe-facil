import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  label: string;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md";
};

export function Progress({ value, label, className, barClassName, size = "md" }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className={cn(
        "w-full overflow-hidden rounded-full bg-slate-200/80",
        size === "sm" ? "h-1.5" : "h-2.5",
        className,
      )}
    >
      <div
        className={cn(
          "bg-brand-600 h-full rounded-full transition-[width] duration-500",
          barClassName,
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
