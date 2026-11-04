export type ModuleId = "fundamentos" | "renda-fixa" | "renda-variavel";

export type Module = {
  id: ModuleId;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  /** Cor de destaque usada nos cards e badges. */
  accent: "brand" | "accent" | "warn";
};

export const modules: Module[] = [
  {
    id: "fundamentos",
    order: 1,
    title: "Fundamentos do dinheiro",
    shortTitle: "Fundamentos",
    description:
      "Antes de escolher qualquer investimento, entenda como o dinheiro cresce, como a inflação corrói e por que risco e retorno andam juntos.",
    accent: "brand",
  },
  {
    id: "renda-fixa",
    order: 2,
    title: "Renda fixa sem mistério",
    shortTitle: "Renda fixa",
    description:
      "Tesouro Direto, CDB, LCI e LCA: o que você está emprestando, para quem, e quanto disso fica com o Imposto de Renda.",
    accent: "accent",
  },
  {
    id: "renda-variavel",
    order: 3,
    title: "Renda variável com consciência",
    shortTitle: "Renda variável",
    description:
      "Ações, dividendos, FIIs e ETFs: como funciona ser sócio de uma empresa e por que diversificar é o único almoço grátis.",
    accent: "warn",
  },
];

export function getModule(id: string) {
  return modules.find((item) => item.id === id);
}
