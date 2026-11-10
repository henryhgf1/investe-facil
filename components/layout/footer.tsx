import Link from "next/link";

import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/ui/logo";

const footerLinks = [
  { href: "/trilha/", label: "Trilha" },
  { href: "/carteira/", label: "Carteira" },
  { href: "/simulador/", label: "Simulador" },
  { href: "/missoes/", label: "Missões" },
  { href: "/glossario/", label: "Glossário" },
  { href: "/sobre/", label: "Sobre o projeto" },
  { href: "/perfil/", label: "Perfil" },
];

export function Footer() {
  return (
    <footer className="border-line bg-surface relative mt-20 border-t">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--primary)_45%,transparent),transparent)]"
      />
      <Container className="py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-8" />
              <span className="font-display text-ink text-base font-extrabold">
                Investe<span className="text-brand-700">Fácil</span>
              </span>
            </div>
            <p className="text-muted mt-3 text-sm leading-6">
              Educação financeira para quem está começando: teoria curta, prática sem risco e nenhum
              jargão desnecessário.
            </p>
            <p className="text-muted mt-4 text-xs">
              Feito com Next.js. Conteúdo educacional, sem recomendação de investimento.
            </p>
          </div>

          <nav
            aria-label="Links do rodapé"
            className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body hover:text-brand-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-line text-muted mt-10 border-t pt-6 text-xs leading-6">
          <p>
            <strong className="text-body font-semibold">Aviso:</strong> o Investe Fácil é um projeto
            educacional de portfólio. Nada aqui é recomendação de investimento. Rentabilidades
            passadas não garantem resultados futuros.
          </p>
        </div>
      </Container>
    </footer>
  );
}
