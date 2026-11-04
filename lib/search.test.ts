import { describe, expect, it } from "vitest";

import { matchesSearch, normalizeSearch } from "./search";

describe("normalizeSearch", () => {
  it("remove acentos e caixa", () => {
    expect(normalizeSearch("Inflação")).toBe("inflacao");
    expect(normalizeSearch("AÇÃO")).toBe("acao");
  });

  it("remove pontuação e normaliza espaços", () => {
    expect(normalizeSearch("  Tesouro   IPCA+  ")).toBe("tesouro ipca");
  });
});

describe("matchesSearch", () => {
  it("encontra termo sem acento em texto acentuado", () => {
    expect(matchesSearch("inflacao", ["Inflação: o ladrão silencioso"])).toBe(true);
  });

  it("encontra em campos alternativos, sem depender de acento", () => {
    expect(matchesSearch("deposito", ["Certificado de Depósito Interbancário"])).toBe(true);
  });

  it("exige que todas as palavras apareçam", () => {
    expect(matchesSearch("renda fixa", ["Renda fixa sem mistério"])).toBe(true);
    expect(matchesSearch("renda variavel", ["Renda fixa sem mistério"])).toBe(false);
  });

  it("trata busca vazia como ausência de filtro", () => {
    expect(matchesSearch("   ", ["qualquer coisa"])).toBe(true);
  });
});
