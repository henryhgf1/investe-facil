import { describe, expect, it } from "vitest";

import { DEFAULT_AVATAR_ID, getProfileAvatar, PROFILE_AVATARS } from "./profile";

describe("perfil", () => {
  it("tem seis avatares com ids únicos", () => {
    const ids = PROFILE_AVATARS.map((avatar) => avatar.id);

    expect(PROFILE_AVATARS).toHaveLength(6);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("usa o primeiro avatar como padrão", () => {
    expect(DEFAULT_AVATAR_ID).toBe(PROFILE_AVATARS[0].id);
  });

  it("resolve um avatar existente", () => {
    expect(getProfileAvatar("foguete").label).toBe("Foguete");
  });

  it("cai no avatar padrão quando o id é desconhecido ou vazio", () => {
    expect(getProfileAvatar("inexistente").id).toBe(DEFAULT_AVATAR_ID);
    expect(getProfileAvatar(null).id).toBe(DEFAULT_AVATAR_ID);
    expect(getProfileAvatar(undefined).id).toBe(DEFAULT_AVATAR_ID);
  });
});
