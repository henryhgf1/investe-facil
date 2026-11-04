import type { ComponentType } from "react";

import Inflacao from "./modules/fundamentos/inflacao.mdx";
import JurosCompostos from "./modules/fundamentos/juros-compostos.mdx";
import PorQueInvestir from "./modules/fundamentos/por-que-investir.mdx";

/**
 * Registry explícito: o conteúdo é importado em build time, o que mantém o
 * export estático previsível e permite validar todos os links no CI.
 */
export const lessonContent: Record<string, ComponentType> = {
  "por-que-investir": PorQueInvestir,
  "juros-compostos": JurosCompostos,
  inflacao: Inflacao,
};
