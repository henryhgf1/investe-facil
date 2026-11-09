import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export { TimeComparison } from "./time-comparison";

type CalloutVariant = "info" | "warn" | "success";

const calloutStyles: Record<CalloutVariant, { wrapper: string; icon: ReactNode }> = {
  info: {
    wrapper: "border-accent/20 bg-accent-soft/70 text-slate-800",
    icon: <Info className="text-accent size-5 shrink-0" aria-hidden="true" />,
  },
  warn: {
    wrapper: "border-warn/25 bg-warn-soft text-slate-800",
    icon: <AlertTriangle className="text-warn size-5 shrink-0" aria-hidden="true" />,
  },
  success: {
    wrapper: "border-brand-600/20 bg-brand-50 text-slate-800",
    icon: <CheckCircle2 className="text-brand-700 size-5 shrink-0" aria-hidden="true" />,
  },
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const styles = calloutStyles[variant];

  return (
    <aside className={cn("my-8 flex gap-3 rounded-2xl border p-5", styles.wrapper)}>
      {styles.icon}
      <div className="space-y-1 text-[15px] leading-6">
        {title ? <p className="text-ink font-semibold">{title}</p> : null}
        <div className="[&>p]:m-0">{children}</div>
      </div>
    </aside>
  );
}

export function KeyIdea({ children }: { children: ReactNode }) {
  return (
    <div className="border-brand-600/15 from-brand-50 my-10 rounded-2xl border bg-linear-to-br to-white p-6">
      <p className="font-display text-brand-700 mb-2 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
        <Lightbulb className="size-4" aria-hidden="true" />
        Ideia-chave
      </p>
      <div className="font-display text-ink text-lg leading-7 [&>p]:m-0">{children}</div>
    </div>
  );
}

export function Formula({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <figure className="border-line my-8 overflow-hidden rounded-2xl border bg-white">
      <div className="text-ink overflow-x-auto px-6 py-7 text-center font-mono text-lg">
        {children}
      </div>
      {label ? (
        <figcaption className="border-line bg-canvas text-muted border-t px-6 py-3 text-center text-sm">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
