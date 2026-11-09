import type { Metadata } from "next";

import { ProfilePage } from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "Seu perfil",
  description:
    "Crie seu perfil local com nome e avatar, acompanhe seu progresso e apague conclusões específicas para recomeçar.",
};

export default function PerfilRoute() {
  return <ProfilePage />;
}
