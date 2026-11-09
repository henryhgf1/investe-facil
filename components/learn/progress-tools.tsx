"use client";

import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/lib/store/progress";

type Message = { type: "success" | "error"; text: string } | null;

export function ProgressTools() {
  const exportProgress = useProgressStore((state) => state.exportProgress);
  const importProgress = useProgressStore((state) => state.importProgress);
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message>(null);

  function handleExport() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `investe-facil-progresso-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Backup baixado." });
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    const result = importProgress(text);

    setMessage(
      result.ok
        ? { type: "success", text: "Progresso importado com sucesso." }
        : { type: "error", text: result.error },
    );

    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <details className="group border-line rounded-2xl border bg-white">
      <summary className="text-ink cursor-pointer list-none px-5 py-4 text-sm font-semibold marker:hidden">
        <span className="inline-flex items-center gap-2">
          Gerenciar progresso
          <span className="text-muted text-xs font-normal group-open:hidden">
            (backup e importação)
          </span>
        </span>
      </summary>

      <div className="border-line space-y-4 border-t px-5 py-4">
        <p className="text-muted text-sm leading-6">
          Seu progresso e seu perfil ficam salvos apenas neste navegador. Exporte um backup para
          levar para outro dispositivo.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="size-4" aria-hidden="true" />
            Exportar
          </Button>

          <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
            <Upload className="size-4" aria-hidden="true" />
            Importar
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="sr-only"
            aria-label="Arquivo de backup do progresso"
            onChange={(event) => void handleImport(event.target.files?.[0])}
          />
        </div>

        {message ? (
          <p
            role="status"
            className={
              message.type === "success"
                ? "bg-brand-50 text-brand-800 rounded-lg px-3 py-2 text-sm"
                : "bg-warn-soft text-warn rounded-lg px-3 py-2 text-sm"
            }
          >
            {message.text}
          </p>
        ) : null}
      </div>
    </details>
  );
}
