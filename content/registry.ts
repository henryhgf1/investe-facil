import type { ComponentType } from "react";

import Inflacao from "./modules/fundamentos/inflacao.mdx";
import JurosCompostos from "./modules/fundamentos/juros-compostos.mdx";
import PorQueInvestir from "./modules/fundamentos/por-que-investir.mdx";
import RiscoERetorno from "./modules/fundamentos/risco-e-retorno.mdx";
import CdbLciLca from "./modules/renda-fixa/cdb-lci-lca.mdx";
import CdiSelicTesouro from "./modules/renda-fixa/cdi-selic-tesouro.mdx";
import IrIofLiquidez from "./modules/renda-fixa/ir-iof-liquidez.mdx";
import Diversificacao from "./modules/renda-variavel/diversificacao.mdx";
import DividendosFiisEtfs from "./modules/renda-variavel/dividendos-fiis-etfs.mdx";
import Acao from "./modules/renda-variavel/o-que-e-uma-acao.mdx";

/**
 * Registry explícito: o conteúdo é importado em build time, o que mantém o
 * export estático previsível e permite validar todos os links no CI.
 */
export const lessonContent: Record<string, ComponentType> = {
  "por-que-investir": PorQueInvestir,
  "juros-compostos": JurosCompostos,
  inflacao: Inflacao,
  "risco-e-retorno": RiscoERetorno,
  "cdi-selic-tesouro": CdiSelicTesouro,
  "cdb-lci-lca": CdbLciLca,
  "ir-iof-liquidez": IrIofLiquidez,
  "o-que-e-uma-acao": Acao,
  "dividendos-fiis-etfs": DividendosFiisEtfs,
  diversificacao: Diversificacao,
};
