import Link from "next/link";

import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-line mt-20 border-t bg-white">
      <Container className="py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-7" />
              <span className="font-display text-ink text-base font-extrabold">
                Investe<span className="text-brand-700">Fácil</span>
              </span>
            </div>
            <p className="text-muted mt-3 text-sm leading-6">
              Educação financeira para quem está começando: teoria curta, prática sem risco e nenhum
              jargão desnecessário.
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/trilha/" className="hover:text-brand-700 text-slate-600">
              Trilha
            </Link>
            <Link href="/simulador/" className="hover:text-brand-700 text-slate-600">
              Simulador
            </Link>
            <Link href="/missoes/" className="hover:text-brand-700 text-slate-600">
              Missões
            </Link>
            <Link href="/glossario/" className="hover:text-brand-700 text-slate-600">
              Glossário
            </Link>
            <Link href="/sobre/" className="hover:text-brand-700 text-slate-600">
              Sobre o projeto
            </Link>
          </nav>
        </div>

        <div className="border-line text-muted mt-8 border-t pt-6 text-xs leading-6">
          <p>
            <strong className="font-semibold text-slate-700">Aviso:</strong> o Investe Fácil é um
            projeto educacional de portfólio. Nada aqui é recomendação de investimento.
            Rentabilidades passadas não garantem resultados futuros.
          </p>
        </div>
      </Container>
    </footer>
  );
}
