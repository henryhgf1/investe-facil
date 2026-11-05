import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/trilha/", label: "Trilha" },
  { href: "/glossario/", label: "Glossário" },
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
              className="hover:text-ink rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
          <span className="border-line ml-2 inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-dashed px-3 py-3 text-sm text-slate-400">
            Simulador
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              em breve
            </span>
          </span>
        </nav>

        <MobileMenu links={navLinks} />
      </Container>
    </header>
  );
}
