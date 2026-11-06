import { describe, expect, it } from "vitest";

import { lessons } from "./lessons";
import { getMission, missions, missionsForLesson, totalMissionXp } from "./missions";
import { modules } from "./modules";

const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
const moduleIds = new Set(modules.map((module) => module.id));

describe("missões práticas", () => {
  it("tem oito missões com identificadores únicos", () => {
    expect(missions).toHaveLength(8);

    const ids = missions.map((mission) => mission.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("dá 15 XP por missão e soma 120 XP no total", () => {
    for (const mission of missions) {
      expect(mission.xp).toBe(15);
    }

    expect(totalMissionXp).toBe(120);
  });

  it("aponta para lições e módulos existentes", () => {
    for (const mission of missions) {
      expect(lessonSlugs.has(mission.lessonSlug), `${mission.id} usa lição inexistente`).toBe(true);
      expect(moduleIds.has(mission.module), `${mission.id} usa módulo inexistente`).toBe(true);
    }
  });

  it("tem pelo menos três passos práticos por missão", () => {
    for (const mission of missions) {
      expect(mission.steps.length, `${mission.id} tem poucos passos`).toBeGreaterThanOrEqual(3);
      expect(mission.summary.length).toBeGreaterThan(20);
    }
  });

  it("encontra missões por id e por lição", () => {
    expect(getMission("mapa-do-dinheiro")?.title).toBe("Monte o mapa do seu dinheiro");
    expect(getMission("inexistente")).toBeUndefined();
    expect(missionsForLesson("juros-compostos").map((mission) => mission.id)).toEqual([
      "teste-do-tempo",
    ]);
  });
});
