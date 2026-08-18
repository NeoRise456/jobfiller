"use client";

import { useRef, useState } from "react";

export default function Dropzone({
  onText,
}: {
  onText: (text: string, filename: string) => void;
}) {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/parse-resume", { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Parse failed");
      onText(data.text, data.filename);
      setName(data.filename);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume file"
        className={`dropzone bx p-6 text-center ${over ? "over" : ""} ${busy ? "opacity-50" : ""}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files[0];
          if (f) void send(f);
        }}
      >
        {busy ? (
          <p className="font-display text-xl">PARSING<span className="blink">_</span></p>
        ) : name ? (
          <p className="font-display text-xl break-all">{name}</p>
        ) : (
          <p className="font-display text-xl">DROP RESUME HERE</p>
        )}
        <p className="mt-2 text-xs text-dim">PDF / DOCX / TXT — OR CLICK</p>
      </div>
      {error && <p className="mt-2 text-sm text-accent">ERR: {error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void send(f);
        }}
      />
    </div>
  );
}
