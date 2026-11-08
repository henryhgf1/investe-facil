import type { ModuleId } from "./modules";
import { XP_PER_MISSION } from "@/lib/xp";

export type MissionCheckOption = {
  id: string;
  label: string;
};

export type MissionCheck = {
  prompt: string;
  options: MissionCheckOption[];
  answerId: string;
  explanation: string;
};

export type Mission = {
  id: string;
  title: string;
  summary: string;
  /** Passos práticos que o aluno pode cumprir sem abrir conta em corretora. */
  steps: string[];
  /** Pergunta de verificação respondida antes de liberar o XP. */
  check: MissionCheck;
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
    check: {
      prompt: "Depois de separar essenciais, desejos e dívidas, qual valor você deve investir?",
      options: [
        { id: "a", label: "O que sobra sem comprometer os gastos essenciais e a reserva." },
        { id: "b", label: "Todo o salário, para acelerar o resultado." },
        { id: "c", label: "O limite do cartão, desde que a fatura caiba no mês seguinte." },
      ],
      answerId: "a",
      explanation:
        "Investir começa pelo que sobra com segurança. O mapa do dinheiro mostra esse valor antes de escolher qualquer produto.",
    },
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
    check: {
      prompt: "Com o mesmo aporte, por que 30 anos rendem bem mais que 10?",
      options: [
        { id: "a", label: "Porque os juros compostos incidem sobre os rendimentos acumulados." },
        { id: "b", label: "Porque a taxa de juros é sempre maior em prazos longos." },
        { id: "c", label: "Porque o governo paga um bônus para quem investe por mais tempo." },
      ],
      answerId: "a",
      explanation:
        "O tempo aumenta a base sobre a qual os juros incidem. É o efeito bola de neve que o simulador mostra.",
    },
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
    check: {
      prompt: "Se sua cesta subiu 30% em cinco anos e o IPCA acumulou 35%, o que aconteceu?",
      options: [
        { id: "a", label: "A cesta subiu abaixo da inflação." },
        { id: "b", label: "A cesta subiu acima da inflação." },
        { id: "c", label: "A inflação não afeta a comparação da cesta." },
      ],
      answerId: "a",
      explanation:
        "Comparar com o IPCA mostra se o aumento foi real ou apenas repasse da inflação. Nesse caso, a cesta perdeu poder de compra.",
    },
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
    check: {
      prompt: "Qual frase descreve melhor o risco de um investimento?",
      options: [
        { id: "a", label: "É a possibilidade de o resultado ser diferente do esperado." },
        { id: "b", label: "É a certeza de perder dinheiro em qualquer cenário." },
        { id: "c", label: "É a taxa de administração cobrada pelo fundo." },
      ],
      answerId: "a",
      explanation:
        "Risco é incerteza sobre o resultado, não apenas perda. Por isso ele combina com prazo, diversificação e o seu estômago.",
    },
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
    check: {
      prompt: "O que muda entre o Tesouro Selic e um CDB de banco?",
      options: [
        {
          id: "a",
          label:
            "O emissor e a garantia: o Tesouro é federal e o CDB conta com o FGC dentro do limite.",
        },
        { id: "b", label: "Nada, os dois têm exatamente a mesma garantia." },
        { id: "c", label: "O CDB é sempre isento de Imposto de Renda." },
      ],
      answerId: "a",
      explanation:
        "Emissor, garantia, liquidez e imposto mudam a comparação. A taxa sozinha não conta a história completa.",
    },
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
    check: {
      prompt: "Por que resgatar em 20 dias costuma custar mais caro?",
      options: [
        { id: "a", label: "Porque o IOF incide nos primeiros 30 dias e a alíquota de IR é maior." },
        { id: "b", label: "Porque o banco cobra uma multa fixa em qualquer resgate." },
        { id: "c", label: "Porque o rendimento é sempre maior no começo do investimento." },
      ],
      answerId: "a",
      explanation:
        "IOF regressivo e IR regressivo punem o resgate cedo. A reserva de emergência existe para evitar esse custo.",
    },
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
    check: {
      prompt: "Comprar uma ação significa...",
      options: [
        {
          id: "a",
          label: "Virar sócio de uma empresa, com direito a parte dos lucros e dos riscos.",
        },
        { id: "b", label: "Emprestar dinheiro para uma empresa com taxa fixa." },
        { id: "c", label: "Comprar um título do governo com data de vencimento." },
      ],
      answerId: "a",
      explanation:
        "Ação é participação societária. O retorno vem do lucro e da valorização, mas não é garantido.",
    },
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
    check: {
      prompt: "Para que serve diversificar entre renda fixa, ações e liquidez?",
      options: [
        {
          id: "a",
          label:
            "Para reduzir o impacto de uma classe ruim sem abrir mão de todo o retorno esperado.",
        },
        { id: "b", label: "Para garantir que nenhuma classe perca dinheiro." },
        { id: "c", label: "Para pagar menos imposto automaticamente." },
      ],
      answerId: "a",
      explanation:
        "Diversificação espalha o risco. Ela não elimina perdas, mas evita depender de uma única aposta.",
    },
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
