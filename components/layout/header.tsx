import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { ProfileSwitcher } from "@/components/profile/profile-switcher";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/trilha/", label: "Trilha" },
  { href: "/carteira/", label: "Carteira" },
  { href: "/simulador/", label: "Simulador" },
  { href: "/missoes/", label: "Missões" },
  { href: "/glossario/", label: "Glossário" },
  { href: "/sobre/", label: "Sobre" },
];

const mobileLinks = [...navLinks, { href: "/perfil/", label: "Perfil" }];

export function Header() {
  return (
    <header className="border-line/80 bg-canvas/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-ink rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ProfileSwitcher />
          <MobileMenu links={mobileLinks} />
        </div>
      </Container>
    </header>
  );
}
