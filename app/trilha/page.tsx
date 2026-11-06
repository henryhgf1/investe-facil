import type { Metadata } from "next";

import { MissionsSummary } from "@/components/learn/missions-summary";
import { ProgressSummary } from "@/components/learn/progress-summary";
import { ProgressTools } from "@/components/learn/progress-tools";
import { TrilhaList } from "@/components/learn/trilha-list";
import { Container } from "@/components/ui/container";
import { readyLessons } from "@/content/lessons";

export const metadata: Metadata = {
  title: "Trilha de aprendizado",
  description:
    "Do primeiro aporte à carteira diversificada: fundamentos, renda fixa e renda variável em lições curtas com quiz.",
};

export default function TrilhaPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-brand-700 mb-2 text-xs font-bold tracking-widest uppercase">
          Trilha de aprendizado
        </p>
        <h1 className="font-display text-ink text-3xl font-extrabold sm:text-4xl">
          Um caminho, na ordem certa
        </h1>
        <p className="text-muted mt-4 text-base leading-7">
          Comece pelos fundamentos, avance para a renda fixa e só então explore a renda variável.
          São {readyLessons.length} lições no ar, com quiz e progresso salvo no seu navegador.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <ProgressSummary />
        <MissionsSummary />
        <ProgressTools />
      </div>

      <div className="mt-12">
        <TrilhaList />
      </div>
    </Container>
  );
}
