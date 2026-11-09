import type { Page } from "@playwright/test";

export const STORAGE_KEY = "investe-facil:progress";

export type SeedProfileInput = {
  name: string;
  avatarId?: string;
  xp?: number;
  lessons?: string[];
  quizzes?: Record<string, { bestScore: number; total: number }>;
  missions?: string[];
};

function progressFor({ xp = 0, lessons = [], quizzes = {}, missions = [] }: SeedProfileInput) {
  return {
    xp,
    lessons: Object.fromEntries(
      lessons.map((slug) => [slug, { completedAt: "2026-01-01T00:00:00.000Z" }]),
    ),
    quizzes,
    missions: Object.fromEntries(
      missions.map((id) => [id, { completedAt: "2026-01-01T00:00:00.000Z" }]),
    ),
    badges: [],
  };
}

/** Cria perfis locais direto no localStorage e recarrega a página. */
export async function seedProfiles(page: Page, inputs: SeedProfileInput[], activeIndex = 0) {
  await page.evaluate(
    ({ key, profiles, active }) => {
      const createdAt = new Date().toISOString();
      const seeded = profiles.map((profile, index) => ({
        id: `perfil-e2e-${index + 1}`,
        name: profile.name,
        avatarId: profile.avatarId ?? "folha",
        createdAt,
        ...profile.progress,
      }));

      window.localStorage.setItem(
        key,
        JSON.stringify({
          state: {
            profiles: seeded,
            activeProfileId: seeded[active]?.id ?? null,
            pendingProgress: null,
          },
          version: 4,
        }),
      );
    },
    {
      key: STORAGE_KEY,
      active: activeIndex,
      profiles: inputs.map((input) => ({ ...input, progress: progressFor(input) })),
    },
  );

  await page.reload();
}

/** Cria um perfil local direto no localStorage e recarrega a página. */
export async function seedProfile(page: Page, name = "Perfil E2E", avatarId = "folha") {
  await seedProfiles(page, [{ name, avatarId }]);
}
