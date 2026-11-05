export type GlossaryCategory =
  "fundamentos" | "renda-fixa" | "renda-variavel" | "impostos" | "risco";

export type GlossaryTerm = {
  slug: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  /** Sinônimos e siglas que também devem encontrar o termo na busca. */
  aliases?: string[];
  seeAlso?: string[];
};

export const glossaryCategories: {
  id: GlossaryCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "fundamentos",
    label: "Fundamentos",
    description: "As ideias que sustentam qualquer decisão: juros, inflação e liquidez.",
  },
  {
    id: "renda-fixa",
    label: "Renda fixa",
    description: "Quem paga, com qual garantia e em que prazo.",
  },
  {
    id: "renda-variavel",
    label: "Renda variável",
    description: "Ações, fundos imobiliários e ETFs explicados sem jargão.",
  },
  {
    id: "impostos",
    label: "Impostos e custos",
    description: "O que sai do seu rendimento antes de chegar ao bolso.",
  },
  {
    id: "risco",
    label: "Risco e diversificação",
    description: "Os nomes certos para os riscos que você aceita correr.",
  },
];

export const glossary: GlossaryTerm[] = [
  {
    slug: "juros-compostos",
    term: "Juros compostos",
    category: "fundamentos",
    aliases: ["juros sobre juros"],
    definition:
      "Juros que incidem sobre o valor aplicado e também sobre os juros já acumulados. É o efeito bola de neve: cada período rende sobre um saldo maior, e o crescimento deixa de ser linear.",
    seeAlso: ["juros-simples", "aporte"],
  },
  {
    slug: "juros-simples",
    term: "Juros simples",
    category: "fundamentos",
    definition:
      "Juros calculados sempre sobre o valor inicial, sem incorporar os rendimentos anteriores. Crescem em linha reta, enquanto os juros compostos crescem em curva.",
    seeAlso: ["juros-compostos"],
  },
  {
    slug: "inflacao",
    term: "Inflação",
    category: "fundamentos",
    aliases: ["corrosão do poder de compra"],
    definition:
      "Aumento generalizado e contínuo dos preços. Na prática, é a perda de poder de compra do dinheiro: a mesma quantia compra menos com o passar do tempo.",
    seeAlso: ["ipca", "poder-de-compra"],
  },
  {
    slug: "ipca",
    term: "IPCA",
    category: "fundamentos",
    aliases: ["Índice Nacional de Preços ao Consumidor Amplo", "índice oficial de inflação"],
    definition:
      "Índice oficial de inflação do Brasil, calculado pelo IBGE. É a referência usada pelo Tesouro IPCA+ e por boa parte dos contratos que prometem repor a inflação.",
    seeAlso: ["inflacao", "tesouro-ipca-mais"],
  },
  {
    slug: "selic",
    term: "Selic",
    category: "fundamentos",
    aliases: ["taxa Selic", "taxa básica de juros"],
    definition:
      "A taxa básica de juros da economia brasileira, definida pelo Copom a cada 45 dias. Funciona como piso para o custo do dinheiro e influencia o rendimento de quase toda a renda fixa.",
    seeAlso: ["cdi", "tesouro-selic"],
  },
  {
    slug: "cdi",
    term: "CDI",
    category: "fundamentos",
    aliases: ["Certificado de Depósito Interbancário"],
    definition:
      "Taxa do mercado interbancário que os bancos usam para emprestar dinheiro entre si por um dia. Anda próxima da Selic e serve de régua para comparar produtos como CDBs e LCIs.",
    seeAlso: ["selic", "cdb"],
  },
  {
    slug: "aporte",
    term: "Aporte",
    category: "fundamentos",
    aliases: ["investimento mensal", "contribuição"],
    definition:
      "Cada quantia que você coloca em um investimento. Aportes regulares reduzem o risco de entrar com tudo no pior momento e transformam o hábito em patrimônio.",
    seeAlso: ["juros-compostos"],
  },
  {
    slug: "liquidez",
    term: "Liquidez",
    category: "fundamentos",
    definition:
      "A facilidade e a rapidez de transformar um investimento em dinheiro sem perder valor. Liquidez diária significa poder resgatar a qualquer momento; imóveis têm liquidez baixa.",
    seeAlso: ["reserva-de-emergencia", "risco-de-liquidez"],
  },
  {
    slug: "reserva-de-emergencia",
    term: "Reserva de emergência",
    category: "fundamentos",
    definition:
      "Dinheiro separado para imprevistos: de três a seis meses de despesas, em algo seguro e com liquidez diária. É o primeiro passo antes de qualquer investimento de risco.",
    seeAlso: ["liquidez", "tesouro-selic"],
  },
  {
    slug: "poder-de-compra",
    term: "Poder de compra",
    category: "fundamentos",
    definition:
      "Quanto você consegue comprar com determinada quantia. A inflação reduz o poder de compra; o ganho real de um investimento mede se ele conseguiu repor essa perda.",
    seeAlso: ["inflacao", "ipca"],
  },
  {
    slug: "renda-fixa",
    term: "Renda fixa",
    category: "renda-fixa",
    definition:
      "Investimentos em que a forma de remuneração é conhecida no momento da aplicação: taxa prefixada, pós-fixada (como o CDI) ou híbrida (inflação + taxa). Não significa retorno garantido em todo resgate.",
    seeAlso: ["renda-variavel", "marcacao-a-mercado"],
  },
  {
    slug: "tesouro-direto",
    term: "Tesouro Direto",
    category: "renda-fixa",
    aliases: ["títulos públicos", "título público"],
    definition:
      "Programa que permite comprar títulos públicos federais pela internet, a partir de cerca de R$ 30. Ao comprar, você empresta dinheiro ao governo em troca de remuneração.",
    seeAlso: ["tesouro-selic", "tesouro-ipca-mais", "tesouro-prefixado"],
  },
  {
    slug: "tesouro-selic",
    term: "Tesouro Selic",
    category: "renda-fixa",
    aliases: ["LFT", "Tesouro Selic 2029"],
    definition:
      "Título público pós-fixado que acompanha a taxa Selic. Tem liquidez diária e baixa oscilação de preço, sendo a escolha típica para a reserva de emergência.",
    seeAlso: ["selic", "reserva-de-emergencia"],
  },
  {
    slug: "tesouro-ipca-mais",
    term: "Tesouro IPCA+",
    category: "renda-fixa",
    aliases: ["NTN-B", "Tesouro IPCA+ com juros semestrais"],
    definition:
      "Título público que paga a inflação medida pelo IPCA mais uma taxa fixa. Protege o poder de compra, mas o preço oscila se você vender antes do vencimento.",
    seeAlso: ["ipca", "marcacao-a-mercado"],
  },
  {
    slug: "tesouro-prefixado",
    term: "Tesouro Prefixado",
    category: "renda-fixa",
    aliases: ["LTN", "Tesouro Prefixado com juros semestrais"],
    definition:
      "Título público com taxa fixa combinada na compra. Você sabe exatamente quanto recebe se levar até o vencimento, mas o preço cai no mercado se os juros subirem.",
    seeAlso: ["marcacao-a-mercado", "tesouro-direto"],
  },
  {
    slug: "cdb",
    term: "CDB",
    category: "renda-fixa",
    aliases: ["Certificado de Depósito Bancário"],
    definition:
      "Título emitido por bancos para captar dinheiro. Pode ser pós-fixado (percentual do CDI), prefixado ou híbrido, e conta com a garantia do FGC até o limite por CPF e instituição.",
    seeAlso: ["cdi", "fgc", "lci"],
  },
  {
    slug: "lci",
    term: "LCI",
    category: "renda-fixa",
    aliases: ["Letra de Crédito Imobiliário"],
    definition:
      "Título de renda fixa emitido por bancos para financiar o setor imobiliário. É isento de Imposto de Renda para pessoa física, mas costuma pagar menos e ter carência.",
    seeAlso: ["lca", "cdb", "tabela-regressiva"],
  },
  {
    slug: "lca",
    term: "LCA",
    category: "renda-fixa",
    aliases: ["Letra de Crédito do Agronegócio"],
    definition:
      "Título de renda fixa emitido por bancos para financiar o agronegócio. Assim como a LCI, é isento de Imposto de Renda para pessoa física e normalmente tem prazo de carência.",
    seeAlso: ["lci", "cdb"],
  },
  {
    slug: "debenture",
    term: "Debênture",
    category: "renda-fixa",
    aliases: ["debêntures incentivadas"],
    definition:
      "Título de dívida emitido por empresas, e não por bancos. Paga juros em troca de crédito e tem risco de crédito da própria companhia, sem a garantia do FGC.",
    seeAlso: ["risco-de-credito", "fgc"],
  },
  {
    slug: "fgc",
    term: "FGC",
    category: "renda-fixa",
    aliases: ["Fundo Garantidor de Créditos"],
    definition:
      "Fundo que garante depósitos e títulos como CDB, LCI e LCA até R$ 250 mil por CPF e por instituição, com limite global de R$ 1 milhão a cada quatro anos. Não cobre ações, FIIs nem debêntures.",
    seeAlso: ["cdb", "lci", "risco-de-credito"],
  },
  {
    slug: "renda-variavel",
    term: "Renda variável",
    category: "renda-variavel",
    definition:
      "Investimentos cujo retorno não é conhecido no momento da aplicação, como ações, FIIs e ETFs. O preço oscila com o mercado, e o resultado depende do desempenho do ativo e do momento da venda.",
    seeAlso: ["acao", "fii", "etf", "volatilidade"],
  },
  {
    slug: "acao",
    term: "Ação",
    category: "renda-variavel",
    definition:
      "A menor fração do capital social de uma empresa. Quem compra uma ação vira sócio: participa dos lucros, dos prejuízos e da valorização, sem garantia de retorno.",
    seeAlso: ["acao-on", "acao-pn", "dividendos", "bolsa-de-valores"],
  },
  {
    slug: "acao-on",
    term: "Ação ON",
    category: "renda-variavel",
    aliases: ["ação ordinária", "sufixo 3"],
    definition:
      "Ação ordinária, geralmente identificada pelo sufixo 3 no código. O principal direito é o voto em assembleias, o que dá ao acionista participação nas decisões da empresa.",
    seeAlso: ["acao", "acao-pn"],
  },
  {
    slug: "acao-pn",
    term: "Ação PN",
    category: "renda-variavel",
    aliases: ["ação preferencial", "sufixo 4"],
    definition:
      "Ação preferencial, geralmente com sufixo 4. Costuma ter prioridade no recebimento de dividendos, mas normalmente não concede direito a voto.",
    seeAlso: ["acao", "acao-on", "dividendos"],
  },
  {
    slug: "dividendos",
    term: "Dividendos",
    category: "renda-variavel",
    definition:
      "Parcela do lucro que uma empresa distribui aos acionistas em dinheiro. Não são garantidos: dependem do resultado, do caixa e da decisão da companhia.",
    seeAlso: ["jcp", "dividend-yield", "acao"],
  },
  {
    slug: "jcp",
    term: "JCP",
    category: "renda-variavel",
    aliases: ["Juros sobre Capital Próprio"],
    definition:
      "Outra forma de distribuir lucro aos acionistas, com tratamento tributário próprio. Costuma chegar ao investidor já descontado o imposto na fonte.",
    seeAlso: ["dividendos", "imposto-de-renda"],
  },
  {
    slug: "dividend-yield",
    term: "Dividend yield",
    category: "renda-variavel",
    aliases: ["DY"],
    definition:
      "Proventos pagos por ação nos últimos 12 meses divididos pelo preço atual. Mede a renda gerada em relação ao valor investido, mas olha para o passado e não garante o futuro.",
    seeAlso: ["dividendos", "jcp"],
  },
  {
    slug: "fii",
    term: "FII",
    category: "renda-variavel",
    aliases: ["Fundo de Investimento Imobiliário", "fundo imobiliário"],
    definition:
      "Fundo negociado em bolsa que reúne dinheiro de vários investidores para aplicar em imóveis ou títulos do setor. Costuma distribuir renda mensal, mas a cota oscila e não há FGC.",
    seeAlso: ["cota", "dividendos", "etf"],
  },
  {
    slug: "etf",
    term: "ETF",
    category: "renda-variavel",
    aliases: ["Exchange Traded Fund", "fundo de índice"],
    definition:
      "Fundo negociado em bolsa que replica um índice, como o Ibovespa. Entrega diversificação imediata em uma única cota, com taxa de administração geralmente baixa.",
    seeAlso: ["cota", "diversificacao", "fii"],
  },
  {
    slug: "ipo",
    term: "IPO",
    category: "renda-variavel",
    aliases: ["abertura de capital", "oferta pública inicial"],
    definition:
      "Oferta pública inicial: o momento em que uma empresa abre o capital e vende ações novas ao mercado pela primeira vez, captando dinheiro para o próprio negócio.",
    seeAlso: ["acao", "bolsa-de-valores"],
  },
  {
    slug: "valor-de-mercado",
    term: "Valor de mercado",
    category: "renda-variavel",
    aliases: ["market cap", "capitalização de mercado"],
    definition:
      "Preço da ação multiplicado pelo total de ações emitidas. Mostra quanto o mercado está pagando pela empresa inteira naquele momento. Não confundir com o valor do negócio.",
    seeAlso: ["acao", "ipo"],
  },
  {
    slug: "bolsa-de-valores",
    term: "Bolsa de valores",
    category: "renda-variavel",
    aliases: ["B3", "mercado secundário"],
    definition:
      "Ambiente organizado onde ações, fundos e outros ativos são negociados entre investidores. No Brasil, a principal é a B3. É o mercado secundário: a empresa não recebe o dinheiro dessas trocas.",
    seeAlso: ["acao", "ipo"],
  },
  {
    slug: "cota",
    term: "Cota",
    category: "renda-variavel",
    definition:
      "Fração de um fundo de investimento, como um FII ou um ETF. Ao comprar cotas, você participa do resultado do fundo proporcionalmente ao número que possui.",
    seeAlso: ["fii", "etf"],
  },
  {
    slug: "imposto-de-renda",
    term: "Imposto de Renda",
    category: "impostos",
    aliases: ["IR", "IRRF"],
    definition:
      "Imposto sobre o rendimento de investimentos. Na renda fixa tributada, incide apenas sobre o lucro, com alíquota que diminui conforme o prazo, e é retido na fonte.",
    seeAlso: ["tabela-regressiva", "iof", "come-cotas"],
  },
  {
    slug: "tabela-regressiva",
    term: "Tabela regressiva",
    category: "impostos",
    definition:
      "Regra de IR da renda fixa em que a alíquota cai com o prazo: 22,5% até 180 dias, 20% de 181 a 360, 17,5% de 361 a 720 e 15% acima de 720 dias.",
    seeAlso: ["imposto-de-renda", "iof"],
  },
  {
    slug: "iof",
    term: "IOF",
    category: "impostos",
    aliases: ["Imposto sobre Operações Financeiras"],
    definition:
      "Imposto que incide sobre o rendimento de resgates nos primeiros 29 dias. Começa em 96% no primeiro dia e zera a partir do 30º dia corrido.",
    seeAlso: ["imposto-de-renda", "liquidez"],
  },
  {
    slug: "come-cotas",
    term: "Come-cotas",
    category: "impostos",
    definition:
      "Antecipação semestral de Imposto de Renda em alguns fundos, feita em maio e novembro. Reduz automaticamente o número de cotas do investidor. ETFs de renda variável não têm come-cotas.",
    seeAlso: ["imposto-de-renda", "etf", "cota"],
  },
  {
    slug: "taxa-de-administracao",
    term: "Taxa de administração",
    category: "impostos",
    aliases: ["taxa do fundo"],
    definition:
      "Percentual anual cobrado pelo gestor de um fundo, já descontado da rentabilidade. Parece pequena, mas 2% ao ano pode consumir boa parte do retorno no longo prazo.",
    seeAlso: ["etf", "fii", "taxa-de-custodia"],
  },
  {
    slug: "taxa-de-custodia",
    term: "Taxa de custódia",
    category: "impostos",
    definition:
      "Valor cobrado para guardar e registrar seus ativos. No Tesouro Direto, a B3 cobra 0,2% ao ano sobre o saldo, com isenção para quem tem até R$ 10 mil em títulos.",
    seeAlso: ["tesouro-direto", "taxa-de-administracao"],
  },
  {
    slug: "corretagem",
    term: "Corretagem",
    category: "impostos",
    definition:
      "Taxa cobrada por uma corretora para executar uma ordem de compra ou venda. Muitas corretoras zeraram a corretagem, mas outros custos operacionais podem existir.",
    seeAlso: ["emolumentos", "bolsa-de-valores"],
  },
  {
    slug: "emolumentos",
    term: "Emolumentos",
    category: "impostos",
    definition:
      "Taxa da bolsa cobrada em cada negociação para manter a infraestrutura do mercado. É pequena por operação, mas pesa para quem compra e vende com muita frequência.",
    seeAlso: ["corretagem", "bolsa-de-valores"],
  },
  {
    slug: "risco",
    term: "Risco",
    category: "risco",
    definition:
      "A chance de o resultado de um investimento ser diferente do esperado. Não é só a possibilidade de perder: inclui a incerteza sobre o retorno e sobre o momento de resgatar.",
    seeAlso: ["volatilidade", "premio-de-risco", "risco-de-mercado"],
  },
  {
    slug: "volatilidade",
    term: "Volatilidade",
    category: "risco",
    definition:
      "A intensidade com que o preço de um ativo oscila ao longo do tempo. Alta volatilidade significa variações grandes, para cima e para baixo. Não é sinônimo de perda definitiva.",
    seeAlso: ["risco", "risco-de-mercado"],
  },
  {
    slug: "risco-de-credito",
    term: "Risco de crédito",
    category: "risco",
    aliases: ["risco de calote"],
    definition:
      "A chance de quem tomou o dinheiro emprestado não pagar. Aparece em CDBs, debêntures e títulos privados; no Tesouro Direto, é o risco de o governo não honrar a dívida.",
    seeAlso: ["fgc", "debenture", "cdb"],
  },
  {
    slug: "risco-de-liquidez",
    term: "Risco de liquidez",
    category: "risco",
    definition:
      "A chance de você precisar do dinheiro e não conseguir resgatar ou vender sem perda. Aparece em imóveis, fundos com carência e títulos com poucos compradores.",
    seeAlso: ["liquidez", "fii"],
  },
  {
    slug: "risco-de-mercado",
    term: "Risco de mercado",
    category: "risco",
    aliases: ["risco sistemático"],
    definition:
      "O risco que afeta todo o mercado ao mesmo tempo: crise global, alta de juros, pandemia. Não desaparece com diversificação; só pode ser administrado com prazo e paciência.",
    seeAlso: ["risco-sistematico", "volatilidade"],
  },
  {
    slug: "risco-sistematico",
    term: "Risco sistemático",
    category: "risco",
    definition:
      "Outro nome para o risco de mercado. É a parcela de incerteza comum a todos os ativos e que nenhuma carteira consegue eliminar por completo.",
    seeAlso: ["risco-de-mercado", "risco-especifico"],
  },
  {
    slug: "risco-especifico",
    term: "Risco específico",
    category: "risco",
    aliases: ["risco não sistemático", "risco diversificável"],
    definition:
      "O risco ligado a uma empresa ou setor, como um escândalo contábil ou um produto que fracassa. É justamente o que a diversificação consegue reduzir.",
    seeAlso: ["diversificacao", "risco-sistematico"],
  },
  {
    slug: "correlacao",
    term: "Correlação",
    category: "risco",
    definition:
      "Medida de quanto dois ativos se movem juntos. Correlação alta significa que caem e sobem na mesma hora; correlação baixa ou negativa é o que faz a diversificação funcionar de verdade.",
    seeAlso: ["diversificacao", "risco-especifico"],
  },
  {
    slug: "diversificacao",
    term: "Diversificação",
    category: "risco",
    definition:
      "Espalhar o dinheiro entre ativos, setores e classes diferentes para reduzir o risco específico. Não elimina o risco de mercado e não é colecionar códigos parecidos.",
    seeAlso: ["correlacao", "risco-especifico", "etf"],
  },
  {
    slug: "premio-de-risco",
    term: "Prêmio de risco",
    category: "risco",
    definition:
      "Retorno adicional esperado por assumir mais incerteza, acima da taxa livre de risco. É o pagamento que o mercado oferece para alguém aceitar volatilidade, prazo ou falta de liquidez.",
    seeAlso: ["risco", "selic"],
  },
  {
    slug: "marcacao-a-mercado",
    term: "Marcação a mercado",
    category: "risco",
    definition:
      "Atualização diária do preço de um título conforme as condições do mercado. É por isso que um Tesouro IPCA+ pode valer menos do que você pagou se vender antes do vencimento.",
    seeAlso: ["tesouro-ipca-mais", "renda-fixa"],
  },
  {
    slug: "perfil-de-investidor",
    term: "Perfil de investidor",
    category: "risco",
    aliases: ["suitability", "conservador moderado arrojado"],
    definition:
      "Classificação que combina capacidade e tolerância a risco: normalmente conservador, moderado ou arrojado. Serve para alinhar a carteira ao quanto você aguenta ver o patrimônio oscilar.",
    seeAlso: ["risco", "diversificacao"],
  },
];

export function getGlossaryTerm(slug: string) {
  return glossary.find((item) => item.slug === slug);
}

export function glossaryByCategory(category: GlossaryCategory) {
  return glossary
    .filter((item) => item.category === category)
    .sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
}
