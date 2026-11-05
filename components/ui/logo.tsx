import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)} fill="none">
      <rect width="32" height="32" rx="9" fill="#0f6b4f" />
      <path
        d="M7.5 21.5 13.2 15.4l4 3.6 7.3-9"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24.5" cy="10" r="2.1" fill="#6ee7b7" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label="Investe Fácil: página inicial"
    >
      <LogoMark />
      <span className="font-display text-ink text-[17px] font-extrabold tracking-tight">
        Investe<span className="text-brand-700">Fácil</span>
      </span>
    </Link>
  );
}
