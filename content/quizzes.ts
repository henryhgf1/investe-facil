export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export const quizzes: Record<string, QuizQuestion[]> = {
  "por-que-investir": [
    {
      id: "q1",
      prompt: "Qual é a principal diferença entre guardar e investir dinheiro?",
      options: [
        { id: "a", text: "Investir sempre rende mais no curto prazo" },
        {
          id: "b",
          text: "Investir coloca o dinheiro para trabalhar, assumindo algum risco",
        },
        { id: "c", text: "Guardar dinheiro nunca faz sentido" },
      ],
      correctOptionId: "b",
      explanation:
        "Guardar dinheiro é a base da reserva de emergência. Investir é fazer esse dinheiro render acima da inflação — e para isso existe risco.",
    },
    {
      id: "q2",
      prompt: "Para que serve a reserva de emergência?",
      options: [
        { id: "a", text: "Cobrir imprevistos sem precisar vender investimentos no pior momento" },
        { id: "b", text: "Aumentar o retorno da carteira no longo prazo" },
        { id: "c", text: "Pagar menos Imposto de Renda" },
      ],
      correctOptionId: "a",
      explanation:
        "A reserva evita que um imprevisto vire dívida cara ou force a venda de investimentos em queda. Por isso ela fica em algo seguro e com liquidez.",
    },
    {
      id: "q3",
      prompt: "Qual afirmação sobre o tempo nos investimentos é correta?",
      options: [
        { id: "a", text: "Quanto maior o prazo, maior o efeito dos juros compostos" },
        { id: "b", text: "O prazo só importa em renda variável" },
        { id: "c", text: "Investir por 2 anos costuma superar 20 anos com folga" },
      ],
      correctOptionId: "a",
      explanation:
        "Os juros compostos crescem de forma exponencial. Cada ano adicional vale mais que o anterior, então o prazo é o ingrediente mais poderoso.",
    },
  ],
  "juros-compostos": [
    {
      id: "q1",
      prompt: "O que diferencia juros compostos de juros simples?",
      options: [
        { id: "a", text: "Nos compostos, os juros também rendem juros" },
        { id: "b", text: "Nos compostos, a taxa é sempre maior" },
        { id: "c", text: "Nos simples, o prazo não influencia o resultado" },
      ],
      correctOptionId: "a",
      explanation:
        "Juros simples incidem sempre sobre o valor inicial. Compostos incidem sobre o saldo acumulado, incluindo os juros já ganhos — é o efeito bola de neve.",
    },
    {
      id: "q2",
      prompt: "R$ 1.000 a 1% ao mês, por 12 meses, viram aproximadamente:",
      options: [
        { id: "a", text: "R$ 1.120,00" },
        { id: "b", text: "R$ 1.126,83" },
        { id: "c", text: "R$ 1.010,00" },
      ],
      correctOptionId: "b",
      explanation:
        "1.000 × (1,01)¹² = 1.126,83. A diferença de R$ 6,83 em relação a 12% simples parece pequena, mas cresce muito com o tempo.",
    },
    {
      id: "q3",
      prompt: "Pela regra dos 72, um investimento a 12% ao ano dobra de valor em cerca de:",
      options: [
        { id: "a", text: "6 anos" },
        { id: "b", text: "12 anos" },
        { id: "c", text: "72 anos" },
      ],
      correctOptionId: "a",
      explanation:
        "72 ÷ 12 = 6. A regra dos 72 é um atalho mental para estimar em quantos anos o dinheiro dobra a uma taxa anual.",
    },
    {
      id: "q4",
      prompt: "No longo prazo, qual fator costuma pesar mais no resultado final?",
      options: [
        { id: "a", text: "O tempo investido" },
        { id: "b", text: "Escolher o melhor dia para comprar" },
        { id: "c", text: "A cor da plataforma da corretora" },
      ],
      correctOptionId: "a",
      explanation:
        "Tempo é o multiplicador do efeito composto. Acertar a taxa ajuda, mas começar antes e permanecer investido costuma valer mais.",
    },
  ],
  inflacao: [
    {
      id: "q1",
      prompt: "O que a inflação representa?",
      options: [
        { id: "a", text: "A queda do preço dos produtos importados" },
        { id: "b", text: "O aumento generalizado e contínuo dos preços" },
        { id: "c", text: "A taxa de juros que o banco cobra no cartão" },
      ],
      correctOptionId: "b",
      explanation:
        "Inflação é o aumento generalizado de preços ao longo do tempo. No Brasil, o IPCA é o índice oficial que acompanha esse movimento.",
    },
    {
      id: "q2",
      prompt:
        "Com inflação de 5% ao ano, quanto valem R$ 1.000 em poder de compra depois de 10 anos?",
      options: [
        { id: "a", text: "Cerca de R$ 950" },
        { id: "b", text: "Cerca de R$ 614" },
        { id: "c", text: "Exatamente R$ 1.000" },
      ],
      correctOptionId: "b",
      explanation:
        "1.000 ÷ (1,05)¹⁰ ≈ 614. Você continua com R$ 1.000 na conta, mas eles compram o que R$ 614 compravam antes.",
    },
    {
      id: "q3",
      prompt:
        "Um investimento rendeu 10% no ano e a inflação foi 5%. Qual foi o ganho real aproximado?",
      options: [
        { id: "a", text: "5%" },
        { id: "b", text: "4,76%" },
        { id: "c", text: "15%" },
      ],
      correctOptionId: "b",
      explanation:
        "(1,10 ÷ 1,05) − 1 = 4,76%. Subtrair 5% de 10% é uma aproximação; a conta correta divide os fatores.",
    },
    {
      id: "q4",
      prompt: "Por que rendimento nominal alto não significa ganho real?",
      options: [
        { id: "a", text: "Porque o Imposto de Renda sempre come todo o lucro" },
        {
          id: "b",
          text: "Porque parte do rendimento apenas repõe a perda de poder de compra",
        },
        { id: "c", text: "Porque a inflação só afeta quem tem dívidas" },
      ],
      correctOptionId: "b",
      explanation:
        "Se o investimento rende 8% e a inflação é 7%, o ganho real é de menos de 1%. O que importa é o que sobra depois da inflação — e do imposto.",
    },
  ],
};

export function getQuiz(slug: string) {
  return quizzes[slug] ?? [];
}
