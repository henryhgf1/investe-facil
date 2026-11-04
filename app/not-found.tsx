import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="text-brand-700 font-mono text-sm font-bold">404</p>
      <h1 className="font-display text-ink mt-3 text-3xl font-extrabold">Essa página não existe</h1>
      <p className="text-muted mt-3 max-w-md text-base leading-7">
        O link pode estar errado ou a lição ainda não foi publicada. Volte para a trilha e escolha
        um conteúdo disponível.
      </p>
      <Link href="/trilha/" className={buttonStyles({ className: "mt-8" })}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar para a trilha
      </Link>
    </Container>
  );
}
