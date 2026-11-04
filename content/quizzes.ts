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
  "risco-e-retorno": [
    {
      id: "q1",
      prompt: "O que o prêmio de risco representa?",
      options: [
        { id: "a", text: "Um bônus garantido pago pelo governo" },
        {
          id: "b",
          text: "A compensação esperada por assumir mais incerteza",
        },
        { id: "c", text: "A taxa que o banco cobra para abrir uma conta" },
      ],
      correctOptionId: "b",
      explanation:
        "O prêmio de risco é o retorno adicional que o mercado oferece para alguém aceitar mais volatilidade, prazo ou falta de liquidez. Ele é esperado, não garantido.",
    },
    {
      id: "q2",
      prompt: "Qual risco é maior na poupança?",
      options: [
        { id: "a", text: "Risco de crédito do governo federal" },
        { id: "b", text: "Risco de liquidez, porque o dinheiro fica preso por anos" },
        {
          id: "c",
          text: "Risco de inflação, porque o rendimento pode não repor a perda de poder de compra",
        },
      ],
      correctOptionId: "c",
      explanation:
        "A poupança tem liquidez diária e risco de crédito baixo, mas costuma render pouco. Em vários períodos, o ganho mal repõe a inflação.",
    },
    {
      id: "q3",
      prompt: "Uma ação caiu 30%. O que isso significa?",
      options: [
        { id: "a", text: "Que a perda é definitiva e você deve vender" },
        {
          id: "b",
          text: "Que o preço oscilou; a perda só se realiza se você vender ou se a empresa quebrar",
        },
        { id: "c", text: "Que o risco da empresa necessariamente aumentou na mesma proporção" },
      ],
      correctOptionId: "b",
      explanation:
        "Volatilidade é a variação de preço no caminho. A perda vira definitiva no momento da venda — ou se o negócio realmente deixar de gerar valor.",
    },
  ],
  "cdi-selic-tesouro": [
    {
      id: "q1",
      prompt: "O que é o CDI?",
      options: [
        { id: "a", text: "Um título público vendido pelo Tesouro Direto" },
        {
          id: "b",
          text: "Uma taxa de referência do mercado interbancário, usada para comparar produtos",
        },
        { id: "c", text: "Um imposto cobrado sobre investimentos de curto prazo" },
      ],
      correctOptionId: "b",
      explanation:
        "O CDI é a taxa que os bancos usam para emprestar dinheiro entre si. Ele serve de régua: quando um CDB promete 100% do CDI, está prometendo acompanhar essa taxa.",
    },
    {
      id: "q2",
      prompt: "Para que o Tesouro Selic costuma ser mais indicado?",
      options: [
        { id: "a", text: "Reserva de emergência, por ter liquidez diária e baixa oscilação" },
        { id: "b", text: "Aposentadoria em 30 anos, por travar uma taxa alta" },
        { id: "c", text: "Especulação de curto prazo com alta volatilidade" },
      ],
      correctOptionId: "a",
      explanation:
        "O Tesouro Selic acompanha a taxa básica, tem liquidez diária e o preço quase não oscila. É a escolha típica para a reserva de emergência.",
    },
    {
      id: "q3",
      prompt: "Com Selic acima de 8,5% ao ano, a poupança rende:",
      options: [
        { id: "a", text: "100% da Selic" },
        { id: "b", text: "70% da Selic" },
        { id: "c", text: "0,5% ao mês mais a TR" },
      ],
      correctOptionId: "c",
      explanation:
        "Acima de 8,5%, a poupança fica em 0,5% ao mês + TR. Abaixo disso, passa a render 70% da Selic + TR.",
    },
  ],
  "cdb-lci-lca": [
    {
      id: "q1",
      prompt: "Se o banco emissor de um CDB quebrar, o que o FGC cobre?",
      options: [
        { id: "a", text: "Todo o valor, sem limite" },
        { id: "b", text: "Até R$ 250 mil por CPF e por instituição" },
        { id: "c", text: "Apenas o rendimento, nunca o principal" },
      ],
      correctOptionId: "b",
      explanation:
        "O FGC garante até R$ 250 mil por CPF e instituição, com limite global de R$ 1 milhão a cada quatro anos. Acima disso, existe risco de crédito.",
    },
    {
      id: "q2",
      prompt: "Uma LCI isenta de IR sempre rende mais que um CDB tributado?",
      options: [
        { id: "a", text: "Sim, porque não paga imposto" },
        {
          id: "b",
          text: "Não: depende da taxa oferecida e do prazo, que define a alíquota do CDB",
        },
        { id: "c", text: "Sim, desde que o prazo seja menor que 30 dias" },
      ],
      correctOptionId: "b",
      explanation:
        "A isenção é uma vantagem, mas a LCI costuma pagar um percentual menor do CDI e ter carência. É preciso comparar o valor líquido no mesmo prazo.",
    },
    {
      id: "q3",
      prompt: "Com IR de 17,5%, um CDB de 100% do CDI equivale a uma LCI de aproximadamente:",
      options: [
        { id: "a", text: "82,5% do CDI" },
        { id: "b", text: "100% do CDI" },
        { id: "c", text: "117,5% do CDI" },
      ],
      correctOptionId: "a",
      explanation:
        "100% × (1 − 0,175) = 82,5%. Se a LCI pagar mais que isso, ela vence a comparação; se pagar menos, o CDB vence.",
    },
  ],
  "ir-iof-liquidez": [
    {
      id: "q1",
      prompt: "A partir de quando o IOF deixa de incidir sobre o rendimento?",
      options: [
        { id: "a", text: "No 15º dia" },
        { id: "b", text: "No 30º dia" },
        { id: "c", text: "Somente após 180 dias" },
      ],
      correctOptionId: "b",
      explanation:
        "O IOF é regressivo do 1º ao 29º dia e zera no 30º dia corrido. Depois disso, só o IR continua incidindo.",
    },
    {
      id: "q2",
      prompt: "Um resgate com 730 dias de aplicação paga qual alíquota de IR?",
      options: [
        { id: "a", text: "22,5%" },
        { id: "b", text: "17,5%" },
        { id: "c", text: "15%" },
      ],
      correctOptionId: "c",
      explanation:
        "Acima de 720 dias, a alíquota cai para 15%. É a faixa mais baixa da tabela regressiva.",
    },
    {
      id: "q3",
      prompt: "Qual é a ordem correta do cálculo no resgate?",
      options: [
        { id: "a", text: "IR sobre o rendimento bruto e depois IOF sobre o que sobrou" },
        { id: "b", text: "IOF sobre o rendimento bruto e depois IR sobre o que sobrou" },
        { id: "c", text: "IOF e IR incidem sobre o valor principal aplicado" },
      ],
      correctOptionId: "b",
      explanation:
        "Primeiro o IOF reduz o rendimento; depois o IR incide sobre o valor restante. Nenhum dos dois incide sobre o principal.",
    },
  ],
  "o-que-e-uma-acao": [
    {
      id: "q1",
      prompt: "Comprar uma ação significa:",
      options: [
        { id: "a", text: "Emprestar dinheiro para uma empresa, com direito a receber juros" },
        { id: "b", text: "Virar sócio de uma fração da empresa" },
        { id: "c", text: "Comprar um produto vendido pela empresa" },
      ],
      correctOptionId: "b",
      explanation:
        "Ação é fração do capital social. O acionista é dono de uma parte do negócio — e participa dos lucros e dos riscos, sem garantia de receber nada.",
    },
    {
      id: "q2",
      prompt: "No curto prazo, o preço de uma ação é determinado principalmente por:",
      options: [
        { id: "a", text: "O valor contábil registrado no balanço" },
        { id: "b", text: "O encontro entre oferta e demanda e as expectativas do mercado" },
        { id: "c", text: "Uma tabela fixa definida pela bolsa" },
      ],
      correctOptionId: "b",
      explanation:
        "No curto prazo, preço é o que compradores e vendedores aceitam naquele instante. O valor do negócio importa mais no longo prazo.",
    },
    {
      id: "q3",
      prompt: "Quando você compra uma ação de outro investidor na bolsa, o dinheiro vai para:",
      options: [
        { id: "a", text: "O caixa da empresa, que usa para crescer" },
        { id: "b", text: "O governo, na forma de impostos" },
        { id: "c", text: "O investidor que vendeu a ação" },
      ],
      correctOptionId: "c",
      explanation:
        "Isso é o mercado secundário. A empresa só recebe dinheiro quando emite ações novas, no mercado primário.",
    },
  ],
  "dividendos-fiis-etfs": [
    {
      id: "q1",
      prompt: "O dividend yield mede:",
      options: [
        { id: "a", text: "Os proventos pagos nos últimos 12 meses divididos pelo preço da ação" },
        { id: "b", text: "O lucro total da empresa no ano" },
        { id: "c", text: "A valorização da ação desde o IPO" },
      ],
      correctOptionId: "a",
      explanation:
        "DY é provento por ação dividido pelo preço. É uma foto do passado e não garante o pagamento futuro.",
    },
    {
      id: "q2",
      prompt:
        "Um FII distribuiu 10% ao ano, mas a cota caiu 15% no mesmo período. O retorno total foi:",
      options: [
        { id: "a", text: "Positivo em 10%" },
        { id: "b", text: "Neutro, porque a renda compensa a queda" },
        { id: "c", text: "Negativo, porque a queda superou a renda recebida" },
      ],
      correctOptionId: "c",
      explanation:
        "Retorno total = valorização + proventos. 10% de renda menos 15% de queda resulta em cerca de −5%.",
    },
    {
      id: "q3",
      prompt: "Qual é a principal vantagem de um ETF para um iniciante?",
      options: [
        { id: "a", text: "Garantir retorno acima do índice" },
        { id: "b", text: "Oferecer diversificação imediata com uma única cota e custo baixo" },
        { id: "c", text: "Não oscilar de preço" },
      ],
      correctOptionId: "b",
      explanation:
        "Um ETF replica um índice e já entrega uma cesta diversificada. Ele não garante retorno acima do mercado e continua oscilando.",
    },
  ],
  diversificacao: [
    {
      id: "q1",
      prompt: "O que a diversificação reduz de fato?",
      options: [
        { id: "a", text: "O risco sistemático de mercado" },
        { id: "b", text: "O risco específico de cada empresa ou setor" },
        { id: "c", text: "A inflação e os impostos" },
      ],
      correctOptionId: "b",
      explanation:
        "Ela dilui o risco específico. O risco sistemático, que afeta todo o mercado, continua existindo.",
    },
    {
      id: "q2",
      prompt: "Por que 10 ações de bancos não formam uma carteira bem diversificada?",
      options: [
        { id: "a", text: "Porque têm alta correlação e tendem a cair juntas" },
        { id: "b", text: "Porque bancos não pagam dividendos" },
        { id: "c", text: "Porque a bolsa limita o número de ações do mesmo setor" },
      ],
      correctOptionId: "a",
      explanation:
        "Ativos do mesmo setor reagem de forma parecida aos mesmos eventos. Diversificar é juntar coisas com comportamentos diferentes.",
    },
    {
      id: "q3",
      prompt: "O risco sistemático pode ser eliminado com diversificação?",
      options: [
        { id: "a", text: "Sim, a partir de 30 ativos" },
        { id: "b", text: "Sim, se a correlação for negativa" },
        {
          id: "c",
          text: "Não: ele afeta o mercado inteiro e só pode ser administrado com prazo e paciência",
        },
      ],
      correctOptionId: "c",
      explanation:
        "A curva de diversificação achata em um piso que depende da correlação. O risco de mercado permanece.",
    },
  ],
};

export function getQuiz(slug: string) {
  return quizzes[slug] ?? [];
}
