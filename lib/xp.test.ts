import { describe, expect, it } from "vitest";

import { levelForXp, totalXpForLessons } from "./xp";

describe("levelForXp", () => {
  it("começa no nível 1 com zero XP", () => {
    const info = levelForXp(0);

    expect(info.level).toBe(1);
    expect(info.progressPercent).toBe(0);
    expect(info.xpToNextLevel).toBe(40);
  });

  it("sobe de nível exatamente no limiar", () => {
    expect(levelForXp(39).level).toBe(1);
    expect(levelForXp(40).level).toBe(2);
    expect(levelForXp(100).level).toBe(3);
  });

  it("nunca passa de 100% de progresso", () => {
    expect(levelForXp(39).progressPercent).toBeLessThanOrEqual(100);
    expect(levelForXp(99).progressPercent).toBeLessThanOrEqual(100);
  });

  it("marca o nível máximo quando o XP passa do último limiar", () => {
    const info = levelForXp(9999);

    expect(info.xpToNextLevel).toBeNull();
    expect(info.progressPercent).toBe(100);
  });

  it("trata XP negativo como zero", () => {
    expect(levelForXp(-50).level).toBe(1);
  });
});

describe("totalXpForLessons", () => {
  it("multiplica o XP por lição", () => {
    expect(totalXpForLessons(3)).toBe(60);
  });
});
