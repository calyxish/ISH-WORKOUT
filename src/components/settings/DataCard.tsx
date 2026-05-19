"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import {
  clearAll,
  defaultExportFilename,
  downloadJson,
  exportAll,
  importAll,
  type ImportResult,
} from "@/lib/export";

type Message =
  | { kind: "ok"; text: string }
  | { kind: "error"; text: string }
  | null;

export function DataCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<Message>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);

  function onExport() {
    try {
      const json = exportAll();
      downloadJson(defaultExportFilename(), json);
      setMsg({ kind: "ok", text: "Export downloaded." });
    } catch (err) {
      setMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "Export failed.",
      });
    }
  }

  function onImportClick() {
    fileRef.current?.click();
  }

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const result: ImportResult = importAll(text);
      setMsg({
        kind: "ok",
        text: `Imported ${result.imported.length} section${
          result.imported.length === 1 ? "" : "s"
        }. Reloading…`,
      });
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      setMsg({
        kind: "error",
        text:
          err instanceof Error
            ? `Import failed: ${err.message}`
            : "Import failed.",
      });
    }
  }

  function doClear() {
    clearAll();
    setConfirmingClear(false);
    setMsg({ kind: "ok", text: "All data cleared. Reloading…" });
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <Card>
      <CardTitle>Data</CardTitle>
      <p className="mt-2 text-sm text-text-muted">
        Everything lives in your browser. Export to back up or move to another
        device.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onExport}>Export JSON</Button>
        <Button variant="ghost" onClick={onImportClick}>
          Import JSON
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onImportFile}
          aria-label="Import JSON file"
          aria-hidden
        />
        {confirmingClear ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Erase everything?</span>
            <Button variant="danger" onClick={doClear}>
              Yes, clear
            </Button>
            <Button variant="ghost" onClick={() => setConfirmingClear(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmingClear(true)}>
            Clear all data
          </Button>
        )}
      </div>

      {msg && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            msg.kind === "error" ? "text-danger" : "text-success"
          }`}
        >
          {msg.text}
        </p>
      )}
    </Card>
  );
}
