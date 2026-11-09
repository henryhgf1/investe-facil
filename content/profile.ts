export type ProfileAvatarTone = "brand" | "accent" | "warn" | "danger" | "neutral";

export type ProfileAvatarOption = {
  id: string;
  label: string;
  tone: ProfileAvatarTone;
};

export const PROFILE_AVATARS: readonly ProfileAvatarOption[] = [
  { id: "folha", label: "Folha", tone: "brand" },
  { id: "foguete", label: "Foguete", tone: "accent" },
  { id: "cofrinho", label: "Cofrinho", tone: "warn" },
  { id: "grafico", label: "Gráfico", tone: "brand" },
  { id: "escudo", label: "Escudo", tone: "accent" },
  { id: "bussola", label: "Bússola", tone: "neutral" },
];

export const DEFAULT_AVATAR_ID = PROFILE_AVATARS[0].id;

export function getProfileAvatar(id: string | null | undefined) {
  return PROFILE_AVATARS.find((avatar) => avatar.id === id) ?? PROFILE_AVATARS[0];
}
