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
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [message, setMessage] = useState<Message>(null);

  function handleExport() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `investe-facil-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Backup baixado." });
  }

  function handleFileSelected(file: File | undefined) {
    if (!file) return;

    setPendingFile(file);
    setMessage(null);

    if (fileInput.current) fileInput.current.value = "";
  }

  async function confirmImport() {
    if (!pendingFile) return;

    const text = await pendingFile.text();
    const result = importProgress(text);

    setPendingFile(null);
    setMessage(
      result.ok
        ? { type: "success", text: "Backup importado com sucesso." }
        : { type: "error", text: result.error },
    );
  }

  return (
    <details className="group border-line bg-surface rounded-2xl border">
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
          Seus perfis e o progresso ficam salvos apenas neste navegador. Exporte um backup para
          levar tudo para outro dispositivo.
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
            onChange={(event) => handleFileSelected(event.target.files?.[0])}
          />
        </div>

        {pendingFile ? (
          <div
            role="group"
            aria-label="Confirmar importação de backup"
            className="border-danger/25 bg-danger-soft rounded-xl border p-3"
          >
            <p className="text-ink text-sm leading-6">
              <strong className="font-semibold">Substituir todos os perfis?</strong> O arquivo{" "}
              <span className="font-semibold">{pendingFile.name}</span> vai trocar os perfis e o
              progresso salvos neste navegador. Essa ação não pode ser desfeita.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPendingFile(null)}
              >
                Cancelar
              </Button>
              <Button type="button" variant="danger" size="sm" onClick={() => void confirmImport()}>
                <Upload className="size-4" aria-hidden="true" />
                Substituir tudo
              </Button>
            </div>
          </div>
        ) : null}

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
