import { ArrowRight, Compass, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BadgeGrid } from "@/components/learn/badge-grid";
import { MissionList } from "@/components/learn/mission-list";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { missions } from "@/content/missions";
import { badges } from "@/lib/badges";
import { MAX_XP } from "@/lib/xp";

export const metadata: Metadata = {
  title: "Missões práticas e conquistas",
  description:
    "Oito missões curtas para levar a educação financeira para a vida real, com XP e badges que acompanham seu progresso.",
};

export default function MissoesPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <Badge variant="warn">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Prática
        </Badge>
        <h1 className="font-display text-ink mt-4 text-3xl font-extrabold sm:text-4xl">
          Aprender fazendo, uma missão por vez
        </h1>
        <p className="text-muted mt-4 text-base leading-7">
          As missões transformam cada lição em uma tarefa curta e concreta. São {missions.length}{" "}
          práticas de 8 a 15 minutos, cada uma valendo 15 XP, mais {badges.length} conquistas que
          aparecem conforme você avança.
        </p>

        <div className="text-muted mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span>{missions.length} missões · 120 XP no total</span>
          <span>{badges.length} conquistas</span>
          <span>Até {MAX_XP} XP na trilha completa</span>
        </div>
      </div>

      <div className="mt-10">
        <MissionList />
      </div>

      <div className="border-line mt-14 border-t pt-10">
        <BadgeGrid />
      </div>

      <div className="border-line bg-canvas mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5">
        <div>
          <p className="font-display text-ink text-base font-bold">Continue praticando</p>
          <p className="text-muted mt-1 text-sm">
            Use os simuladores para testar cenários antes de tomar decisões.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link
            href="/simulador/"
            className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
          >
            <Compass className="size-4" aria-hidden="true" />
            Máquina do tempo
          </Link>
          <Link
            href="/trilha/"
            className="text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 font-semibold"
          >
            Voltar à trilha
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Container>
  );
}
