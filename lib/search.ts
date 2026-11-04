/**
 * Normaliza texto para busca: remove acentos, caixa e pontuação.
 * "Inflação" e "inflacao" passam a ser a mesma chave.
 */
export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Verifica se todos os termos da busca aparecem em algum dos campos. */
export function matchesSearch(query: string, fields: string[]) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return true;

  const haystack = normalizeSearch(fields.join(" "));
  return normalizedQuery.split(" ").every((word) => haystack.includes(word));
}
