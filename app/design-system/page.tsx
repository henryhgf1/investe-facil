import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Container, SectionHeading } from "@/components/ui/container";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens, componentes e padrões visuais do Investe Fácil.",
  robots: { index: false, follow: false },
};

const palette = [
  { name: "brand-600", hex: "#0f6b4f", className: "bg-brand-600", note: "primária" },
  { name: "brand-700", hex: "#0b5740", className: "bg-brand-700", note: "hover" },
  { name: "brand-50", hex: "#ecfdf5", className: "bg-brand-50", note: "fundo suave" },
  { name: "accent", hex: "#1d4ed8", className: "bg-accent", note: "dados" },
  { name: "warn", hex: "#b45309", className: "bg-warn", note: "atenção" },
  { name: "danger", hex: "#b91c1c", className: "bg-danger", note: "erro" },
  { name: "ink", hex: "#0b1220", className: "bg-ink", note: "texto" },
  { name: "muted", hex: "#55677a", className: "bg-muted", note: "texto secundário" },
  { name: "line", hex: "#e2e9e4", className: "bg-line", note: "bordas" },
  { name: "canvas", hex: "#f7faf8", className: "bg-canvas border border-line", note: "fundo" },
];

const typeScale = [
  { label: "Display / 48", className: "font-display text-5xl font-extrabold" },
  { label: "H1 / 36", className: "font-display text-4xl font-extrabold" },
  { label: "H2 / 30", className: "font-display text-3xl font-bold" },
  { label: "H3 / 20", className: "font-display text-xl font-bold" },
  { label: "Corpo / 17", className: "text-[17px] leading-8 text-slate-700" },
  { label: "Apoio / 14", className: "text-sm text-muted" },
];

export default function DesignSystemPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow="Documentação interna"
        title="Design system"
        description="Tokens e componentes usados em todo o produto. Esta página existe para manter consistência visual e servir como referência rápida."
      />

      <section className="mt-12" aria-labelledby="cores">
        <h2 id="cores" className="font-display text-ink text-xl font-bold">
          Cores
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((color) => (
            <li key={color.name} className="border-line overflow-hidden rounded-xl border bg-white">
              <div className={`h-16 w-full ${color.className}`} />
              <div className="p-3">
                <p className="text-ink font-mono text-xs font-semibold">{color.name}</p>
                <p className="text-muted font-mono text-[11px] uppercase">{color.hex}</p>
                <p className="text-muted mt-1 text-[11px]">{color.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="tipografia">
        <h2 id="tipografia" className="font-display text-ink text-xl font-bold">
          Tipografia
        </h2>
        <div className="border-line mt-4 space-y-3 rounded-2xl border bg-white p-6">
          {typeScale.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline gap-4">
              <span className="text-muted w-24 shrink-0 font-mono text-[11px]">{item.label}</span>
              <span className={`${item.className} text-ink`}>Investir fica fácil</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="botoes">
        <h2 id="botoes" className="font-display text-ink text-xl font-bold">
          Botões
        </h2>
        <div className="border-line mt-4 flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-6">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button disabled>Desabilitado</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="lg">Grande</Button>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="badges">
        <h2 id="badges" className="font-display text-ink text-xl font-bold">
          Badges e progresso
        </h2>
        <div className="border-line mt-4 space-y-6 rounded-2xl border bg-white p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="brand">Concluída</Badge>
            <Badge variant="accent">Novo</Badge>
            <Badge variant="warn">Atenção</Badge>
            <Badge variant="neutral">Neutro</Badge>
            <Badge variant="outline">Em breve</Badge>
          </div>
          <div className="space-y-3">
            <Progress value={32} label="Exemplo de progresso em 32%" />
            <Progress value={78} label="Exemplo de progresso em 78%" size="sm" />
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="cards">
        <h2 id="cards" className="font-display text-ink text-xl font-bold">
          Cards
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <CardTitle>Título do card</CardTitle>
            <CardDescription className="mt-2">
              Descrição de apoio com no máximo duas linhas para manter o ritmo de leitura.
            </CardDescription>
          </Card>
          <Card className="bg-brand-800 p-6 text-white">
            <CardTitle className="text-white">Card de destaque</CardTitle>
            <p className="text-brand-50 mt-2 text-sm leading-6">
              Usado em chamadas para ação e blocos de encerramento.
            </p>
          </Card>
        </div>
      </section>
    </Container>
  );
}
