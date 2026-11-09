import { describe, expect, it } from "vitest";

import { RISK_TYPES, type RiskTone } from "./risk-types";

const TONES: RiskTone[] = ["accent", "warn", "brand", "danger", "neutral"];

describe("tipos de risco", () => {
  it("cobre os cinco riscos da lição, sem repetir ids", () => {
    expect(RISK_TYPES).toHaveLength(5);
    expect(RISK_TYPES.map((risk) => risk.id)).toEqual([
      "mercado",
      "credito",
      "liquidez",
      "inflacao",
      "concentracao",
    ]);
    expect(new Set(RISK_TYPES.map((risk) => risk.name)).size).toBe(RISK_TYPES.length);
  });

  it("tem nome, definição e exemplo em todas as entradas", () => {
    for (const risk of RISK_TYPES) {
      expect(risk.name.trim(), `nome vazio em ${risk.id}`).not.toBe("");
      expect(risk.definition.trim(), `definição vazia em ${risk.id}`).not.toBe("");
      expect(risk.example.trim(), `exemplo vazio em ${risk.id}`).not.toBe("");
    }
  });

  it("usa apenas tons previstos no componente", () => {
    for (const risk of RISK_TYPES) {
      expect(TONES, `tom inválido em ${risk.id}`).toContain(risk.tone);
    }
  });

  it("não usa travessão no texto autoral", () => {
    for (const risk of RISK_TYPES) {
      const text = `${risk.name} ${risk.definition} ${risk.example}`;
      expect(text, `travessão em ${risk.id}`).not.toContain("—");
    }
  });

  it("mantém os exemplos numéricos aprovados na lição", () => {
    const mercado = RISK_TYPES.find((risk) => risk.id === "mercado");
    const inflacao = RISK_TYPES.find((risk) => risk.id === "inflacao");

    expect(mercado?.example).toContain("20%");
    expect(inflacao?.example).toContain("R$ 1.000");
  });
});
