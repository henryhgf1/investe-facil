import type { Metadata } from "next";

import { ProfilePage } from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "Seu perfil",
  description:
    "Crie até três perfis locais com nome e avatar, troque de perfil e acompanhe o progresso separado de cada um.",
};

export default function PerfilRoute() {
  return <ProfilePage />;
}
