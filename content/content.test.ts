import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { glossary, glossaryCategories } from "./glossary";
import { lessons, readyLessons } from "./lessons";
import { modules } from "./modules";
import { quizzes } from "./quizzes";

const root = process.cwd();
const registrySource = readFileSync(path.join(root, "content", "registry.ts"), "utf8");

function hasRegistryEntry(slug: string) {
  return new RegExp(`["']?${slug}["']?\\s*:`).test(registrySource);
}

describe("integridade do conteúdo", () => {
  it("tem todos os módulos referenciados pelas lições", () => {
    const moduleIds = new Set(modules.map((module) => module.id));

    for (const lesson of lessons) {
      expect(moduleIds.has(lesson.module), `${lesson.slug} usa módulo inexistente`).toBe(true);
    }
  });

  it("não repete slug nem ordem dentro do mesmo módulo", () => {
    const slugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const mod of modules) {
      const orders = lessons
        .filter((lesson) => lesson.module === mod.id)
        .map((lesson) => lesson.order);
      expect(new Set(orders).size, `ordem duplicada em ${mod.id}`).toBe(orders.length);
    }
  });

  it("só aponta pré-requisitos existentes e já publicados", () => {
    for (const lesson of lessons) {
      if (!lesson.requires) continue;

      const required = lessons.find((item) => item.slug === lesson.requires);
      expect(required, `${lesson.slug} exige ${lesson.requires}, que não existe`).toBeDefined();
      expect(required?.status, `${lesson.slug} exige uma lição ainda não publicada`).toBe("ready");
    }
  });

  it("tem arquivo MDX e entrada no registry para cada lição publicada", () => {
    for (const lesson of readyLessons) {
      const file = path.join(root, "content", "modules", lesson.module, `${lesson.slug}.mdx`);

      expect(existsSync(file), `MDX ausente: ${file}`).toBe(true);
      expect(hasRegistryEntry(lesson.slug), `registry sem ${lesson.slug}`).toBe(true);
    }
  });

  it("não publica lição sem quiz", () => {
    for (const lesson of readyLessons) {
      const questions = quizzes[lesson.slug] ?? [];

      expect(questions.length, `${lesson.slug} está sem quiz`).toBeGreaterThanOrEqual(3);
    }
  });

  it("tem quizzes válidos e sem alternativas duplicadas", () => {
    for (const [slug, questions] of Object.entries(quizzes)) {
      expect(
        lessons.some((lesson) => lesson.slug === slug),
        `quiz órfão: ${slug}`,
      ).toBe(true);

      const ids = questions.map((question) => question.id);
      expect(new Set(ids).size, `id de pergunta duplicado em ${slug}`).toBe(ids.length);

      for (const question of questions) {
        const optionIds = question.options.map((option) => option.id);

        expect(new Set(optionIds).size, `alternativa duplicada em ${slug}/${question.id}`).toBe(
          optionIds.length,
        );
        expect(
          optionIds.includes(question.correctOptionId),
          `${slug}/${question.id} aponta para alternativa inexistente`,
        ).toBe(true);
        expect(
          question.explanation.length,
          `${slug}/${question.id} sem explicação`,
        ).toBeGreaterThan(20);
      }
    }
  });
});

describe("integridade do glossário", () => {
  it("tem slugs únicos e categorias válidas", () => {
    const slugs = glossary.map((term) => term.slug);
    const categories = new Set(glossaryCategories.map((category) => category.id));

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const term of glossary) {
      expect(categories.has(term.category), `${term.slug} tem categoria inválida`).toBe(true);
    }
  });

  it("só referencia termos que existem em 'ver também'", () => {
    const slugs = new Set(glossary.map((term) => term.slug));

    for (const term of glossary) {
      for (const related of term.seeAlso ?? []) {
        expect(slugs.has(related), `${term.slug} aponta para ${related}, que não existe`).toBe(
          true,
        );
      }
    }
  });

  it("tem pelo menos 45 verbetes distribuídos em todas as categorias", () => {
    expect(glossary.length).toBeGreaterThanOrEqual(45);

    for (const category of glossaryCategories) {
      const count = glossary.filter((term) => term.category === category.id).length;
      expect(count, `categoria ${category.id} está vazia`).toBeGreaterThan(0);
    }
  });

  it("escreve definições curtas, sem parágrafos gigantes", () => {
    for (const term of glossary) {
      expect(term.definition.length, `${term.slug} tem definição curta demais`).toBeGreaterThan(40);
      expect(term.definition.length, `${term.slug} tem definição longa demais`).toBeLessThan(320);
    }
  });
});
