"use client";

import { useEffect, useSyncExternalStore } from "react";

import { ensureHydrated } from "@/lib/store/progress";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Evita divergência entre o HTML pré-renderizado e o primeiro render no
 * cliente. Só depois da hidratação os dados do localStorage são exibidos.
 */
export function useHydrated() {
  const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    ensureHydrated();
  }, []);

  return hydrated;
}
