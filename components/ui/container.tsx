import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)} {...props} />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="text-brand-700 mb-2 text-xs font-bold tracking-widest uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-ink text-2xl font-bold sm:text-3xl">{title}</h2>
      {description ? <p className="text-muted mt-3 text-base leading-7">{description}</p> : null}
    </div>
  );
}
