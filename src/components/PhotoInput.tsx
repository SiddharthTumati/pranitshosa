"use client";

import { useRef } from "react";

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
            className="w-full max-h-72 object-cover rounded-lg border border-slate-200 bg-slate-50"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500 truncate">
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
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 active:scale-[0.98] transition"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 active:scale-[0.98] transition"
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
            className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-slate-600 hover:border-brand-navy hover:text-brand-navy active:scale-[0.98] transition"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
              />
              <circle
                cx="12"
                cy="13"
                r="3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            <span className="text-sm font-semibold">Take photo</span>
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-5 text-slate-600 hover:border-brand-navy hover:text-brand-navy active:scale-[0.98] transition"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16v12H4z M4 15l5-5 4 4 3-3 4 4"
              />
              <circle cx="9" cy="9.5" r="1.4" fill="currentColor" />
            </svg>
            <span className="text-sm font-semibold">Upload</span>
          </button>
        </div>
      )}
    </div>
  );
}
