import { UserRound } from "lucide-react";
import Link from "next/link";

export function ProfileRequiredNotice({ action }: { action: string }) {
  return (
    <p className="border-line bg-canvas text-muted flex items-start gap-2 rounded-xl border px-4 py-3 text-xs leading-5">
      <UserRound className="text-brand-700 mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        Crie seu perfil para {action}.{" "}
        <Link href="/perfil/" className="text-brand-700 hover:text-brand-800 font-semibold">
          Criar perfil
        </Link>
      </span>
    </p>
  );
}
