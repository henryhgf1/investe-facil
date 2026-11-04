"use client";

import { useEffect } from "react";

import { ensureHydrated } from "@/lib/store/progress";

/** Rede de segurança: hidrata o progresso uma vez por carregamento. */
export function ProgressHydrator() {
  useEffect(() => {
    ensureHydrated();
  }, []);

  return null;
}
