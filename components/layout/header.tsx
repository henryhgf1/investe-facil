import { DesktopNav, type NavLink } from "@/components/layout/desktop-nav";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProfileSwitcher } from "@/components/profile/profile-switcher";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const navLinks: NavLink[] = [
  { href: "/trilha/", label: "Trilha" },
  { href: "/carteira/", label: "Carteira" },
  { href: "/simulador/", label: "Simulador" },
  { href: "/missoes/", label: "Missões" },
  { href: "/glossario/", label: "Glossário" },
  { href: "/sobre/", label: "Sobre" },
];

const mobileLinks: NavLink[] = [...navLinks, { href: "/perfil/", label: "Perfil" }];

export function Header() {
  return (
    <header className="border-line/70 bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        <DesktopNav links={navLinks} />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <ProfileSwitcher />
          <MobileMenu links={mobileLinks} />
        </div>
      </Container>
    </header>
  );
}
