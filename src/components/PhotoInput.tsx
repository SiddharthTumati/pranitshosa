"use client";

import { useRef } from "react";
import { Camera, ImageUp } from "lucide-react";

type Props = {
  onChange: (file: File | null) => void;
  preview?: string | null;
  fileName?: string;
  sizeBytes?: number;
};

function formatBytes(n?: number): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function PhotoInput({ onChange, preview, fileName, sizeBytes }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onChange(f);
  }

  return (
    <div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={pick}
        className="hidden"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={pick}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-72 object-cover rounded-[var(--radius-sm)] border border-[var(--border-1)] bg-[var(--surface-2)]"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-[color:var(--muted-2)] dark:text-slate-400 truncate">
              {fileName}
              {sizeBytes ? ` · ${formatBytes(sizeBytes)}` : ""}
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs font-semibold text-red-600 hover:underline shrink-0"
            >
              Remove
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border-1)] bg-[var(--surface-2)] text-[color:var(--color-brand-ink)] dark:text-slate-200 text-sm font-medium hover:border-brand-navy/40 hover:bg-brand-orange-soft/60 dark:hover:bg-brand-navy/30 active:scale-[0.98] transition"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border-1)] bg-[var(--surface-2)] text-[color:var(--color-brand-ink)] dark:text-slate-200 text-sm font-medium hover:border-brand-navy/40 hover:bg-brand-orange-soft/60 dark:hover:bg-brand-navy/30 active:scale-[0.98] transition"
            >
              Pick another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--border-1)] bg-[var(--surface-2)] px-3 py-5 text-[color:var(--muted)] hover:border-brand-navy hover:bg-brand-orange-soft/50 dark:hover:bg-brand-navy/25 hover:text-brand-navy dark:hover:text-brand-orange active:scale-[0.98] transition"
          >
            <Camera className="w-7 h-7" aria-hidden />
            <span className="text-sm font-semibold">Take photo</span>
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--border-1)] bg-[var(--surface-2)] px-3 py-5 text-[color:var(--muted)] hover:border-brand-navy hover:bg-brand-orange-soft/50 dark:hover:bg-brand-navy/25 hover:text-brand-navy dark:hover:text-brand-orange active:scale-[0.98] transition"
          >
            <ImageUp className="w-7 h-7" aria-hidden />
            <span className="text-sm font-semibold">Upload</span>
          </button>
        </div>
      )}
    </div>
  );
}
