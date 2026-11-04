import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/trilha/", label: "Trilha" },
  { href: "/sobre/", label: "Sobre" },
];

export function Header() {
  return (
    <header className="border-line/80 bg-canvas/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-ink rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
          <span className="border-line ml-2 inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-slate-400">
            Simulador
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              em breve
            </span>
          </span>
        </nav>

        <details className="relative sm:hidden">
          <summary className="border-line text-ink flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border bg-white marker:hidden">
            <span className="sr-only">Abrir menu</span>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </summary>
          <div className="border-line absolute right-0 mt-2 w-52 rounded-xl border bg-white p-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:bg-canvas block rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <span className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-400">
              Simulador · em breve
            </span>
          </div>
        </details>
      </Container>
    </header>
  );
}
