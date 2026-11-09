import type { Page } from "@playwright/test";

export const STORAGE_KEY = "investe-facil:progress";

/** Cria um perfil local direto no localStorage e recarrega a página. */
export async function seedProfile(page: Page, name = "Perfil E2E", avatarId = "folha") {
  await page.evaluate(
    ({ key, profileName, profileAvatar }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          state: {
            xp: 0,
            lessons: {},
            quizzes: {},
            missions: {},
            badges: [],
            profile: {
              name: profileName,
              avatarId: profileAvatar,
              createdAt: new Date().toISOString(),
            },
          },
          version: 3,
        }),
      );
    },
    { key: STORAGE_KEY, profileName: name, profileAvatar: avatarId },
  );

  await page.reload();
}
