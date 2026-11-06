import type { ModuleId } from "./modules";
import { XP_PER_MISSION } from "@/lib/xp";

export type Mission = {
  id: string;
  title: string;
  summary: string;
  /** Passos práticos que o aluno pode cumprir sem abrir conta em corretora. */
  steps: string[];
  /** Lição recomendada antes da missão. A missão não fica bloqueada por ela. */
  lessonSlug: string;
  module: ModuleId;
  xp: number;
  durationMin: number;
};

export const missions: Mission[] = [
  {
    id: "mapa-do-dinheiro",
    title: "Monte o mapa do seu dinheiro",
    summary:
      "Antes de investir, descubra para onde o dinheiro vai. Uma lista simples já muda a decisão do mês.",
    steps: [
      "Anote quanto entra e quanto sai por mês nos últimos três meses.",
      "Separe os gastos em essenciais, desejos e dívidas.",
      "Escolha um valor que caiba no orçamento para investir todo mês.",
    ],
    lessonSlug: "por-que-investir",
    module: "fundamentos",
    xp: XP_PER_MISSION,
    durationMin: 10,
  },
  {
    id: "teste-do-tempo",
    title: "Teste o poder do tempo",
    summary:
      "A mesma taxa muda de resultado quando o prazo muda. Veja isso acontecer com os seus números.",
    steps: [
      "Abra o simulador de juros compostos com R$ 200 por mês.",
      "Compare o resultado em 10 anos e em 30 anos.",
      "Anote quanto os últimos 10 anos acrescentam ao saldo final.",
    ],
    lessonSlug: "juros-compostos",
    module: "fundamentos",
    xp: XP_PER_MISSION,
    durationMin: 8,
  },
  {
    id: "cesta-de-precos",
    title: "Reveja a cesta de preços",
    summary:
      "A inflação fica abstrata até você comparar o preço de algo que compra sempre. Aí ela vira número.",
    steps: [
      "Escolha três produtos ou serviços que você consome com frequência.",
      "Procure o preço deles há cinco anos e compare com o preço de hoje.",
      "Calcule a variação média e compare com o IPCA do período.",
    ],
    lessonSlug: "inflacao",
    module: "fundamentos",
    xp: XP_PER_MISSION,
    durationMin: 12,
  },
  {
    id: "termometro-de-risco",
    title: "Monte seu termômetro de risco",
    summary:
      "Risco não é só perder dinheiro: é não saber o que vai acontecer. Classifique antes de escolher.",
    steps: [
      "Liste três investimentos que você já ouviu falar.",
      "Classifique cada um como baixo, médio ou alto risco e justifique.",
      "Marque qual deles você aceitaria manter por cinco anos sem resgatar.",
    ],
    lessonSlug: "risco-e-retorno",
    module: "fundamentos",
    xp: XP_PER_MISSION,
    durationMin: 10,
  },
  {
    id: "comparar-renda-fixa",
    title: "Compare dois produtos de renda fixa",
    summary:
      "Tesouro Selic e CDB parecem a mesma coisa no anúncio. Liquidez, risco e imposto mudam a conta.",
    steps: [
      "Escolha um título do Tesouro Direto e um CDB de banco ou corretora.",
      "Compare a taxa, a liquidez e a garantia de cada um.",
      "Simule R$ 1.000 por dois anos e veja quanto sobra depois do IR.",
    ],
    lessonSlug: "cdi-selic-tesouro",
    module: "renda-fixa",
    xp: XP_PER_MISSION,
    durationMin: 12,
  },
  {
    id: "resgate-antes-do-tempo",
    title: "Calcule o custo de resgatar cedo",
    summary:
      "O prazo mexe no Imposto de Renda e o IOF morde os primeiros dias. Simule antes de precisar do dinheiro.",
    steps: [
      "Use a calculadora de IR e IOF com R$ 5.000.",
      "Simule um resgate em 20 dias e outro em dois anos.",
      "Anote a diferença de imposto e o que ela ensina sobre reserva de emergência.",
    ],
    lessonSlug: "ir-iof-liquidez",
    module: "renda-fixa",
    xp: XP_PER_MISSION,
    durationMin: 10,
  },
  {
    id: "socio-por-um-dia",
    title: "Seja sócio por um dia",
    summary:
      "Comprar ação é comprar um pedaço de uma empresa. Escolha uma e descubra como ela ganha dinheiro.",
    steps: [
      "Escolha uma empresa da bolsa que você conhece como cliente.",
      "Leia a descrição do negócio e as três principais fontes de receita.",
      "Escreva em uma frase por que ela pode continuar lucrando nos próximos anos.",
    ],
    lessonSlug: "o-que-e-uma-acao",
    module: "renda-variavel",
    xp: XP_PER_MISSION,
    durationMin: 15,
  },
  {
    id: "carteira-de-tres-classes",
    title: "Desenhe uma carteira de três classes",
    summary:
      "Diversificar é espalhar o risco sem perder o rumo. Comece com uma carteira simples e explicável.",
    steps: [
      "Defina uma porcentagem para renda fixa, ações e uma reserva de liquidez.",
      "Escolha um produto ou fundo para representar cada classe.",
      "Simule a carteira em uma queda de 20% na bolsa e revise se você dormiria tranquilo.",
    ],
    lessonSlug: "diversificacao",
    module: "renda-variavel",
    xp: XP_PER_MISSION,
    durationMin: 15,
  },
];

export function getMission(id: string) {
  return missions.find((mission) => mission.id === id);
}

export function missionsForLesson(slug: string) {
  return missions.filter((mission) => mission.lessonSlug === slug);
}

export const totalMissionXp = missions.reduce((total, mission) => total + mission.xp, 0);
