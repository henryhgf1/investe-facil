"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type RevealVariant = "up" | "fade" | "scale";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Atraso em milissegundos, útil para escalonar cards. */
  delay?: number;
  /** Elemento renderizado; o padrão é `div`. */
  as?: ElementType;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/**
 * Revela o conteúdo quando ele entra na viewport. O estado inicial escondido
 * depende da classe `.js` no <html>, então sem JavaScript o conteúdo aparece.
 * Com `prefers-reduced-motion`, a revelação é imediata e sem transição.
 */
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as = "div",
  ...props
}: RevealProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // O CSS de prefers-reduced-motion já deixa o conteúdo visível.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const style = delay > 0 ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      data-revealed={revealed ? "true" : undefined}
      style={style}
      className={cn("reveal", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
