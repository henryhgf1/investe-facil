export type RiskTone = "accent" | "warn" | "brand" | "danger" | "neutral";

export type RiskType = {
  id: string;
  name: string;
  /** O que o risco significa em uma frase curta. */
  definition: string;
  /** Situação concreta que ajuda o iniciante a reconhecer o risco. */
  example: string;
  tone: RiskTone;
};

/**
 * Os cinco riscos apresentados na lição de risco e retorno.
 * A ordem segue a leitura da lição: do mais visível ao mais silencioso.
 */
export const RISK_TYPES: readonly RiskType[] = [
  {
    id: "mercado",
    name: "Mercado",
    definition: "Preço oscila por humor e juros",
    example: "Ação cai 20% num mês sem a empresa piorar",
    tone: "accent",
  },
  {
    id: "credito",
    name: "Crédito",
    definition: "Quem deve não paga",
    example: "Banco ou empresa entra em dificuldade",
    tone: "warn",
  },
  {
    id: "liquidez",
    name: "Liquidez",
    definition: "Você não consegue vender na hora",
    example: "Imóvel demora meses para vender",
    tone: "brand",
  },
  {
    id: "inflacao",
    name: "Inflação",
    definition: "O dinheiro perde poder de compra",
    example: "R$ 1.000 parados compram menos a cada ano",
    tone: "danger",
  },
  {
    id: "concentracao",
    name: "Concentração",
    definition: "Tudo depende de um único ativo",
    example: "Salário e investimento na mesma empresa",
    tone: "neutral",
  },
];
