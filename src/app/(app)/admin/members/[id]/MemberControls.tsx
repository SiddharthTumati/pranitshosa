"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/app/actions/events";
import type { Profile } from "@/lib/types";

export function MemberControls({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(profile.full_name);
  const [grade, setGrade] = useState<string>(String(profile.grade ?? ""));
  const [role, setRole] = useState(profile.role);
  const [isAdmin, setIsAdmin] = useState(profile.is_admin);
  const [yearLabel, setYearLabel] = useState(profile.year_label);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateProfileAction(profile.id, {
          full_name: name,
          grade: grade ? parseInt(grade, 10) : null,
          role,
          is_admin: isAdmin,
          year_label: yearLabel,
        });
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  return (
    <div className="tracker-card p-4 sm:p-5">
      <h2 className="font-semibold text-slate-800 mb-3">Member details</h2>
      <div className="grid sm:grid-cols-5 gap-3">
        <label className="block sm:col-span-2">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            Full name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            Grade
          </span>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="form-input"
          >
            <option value="">—</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            Role
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "member" | "officer")}
            className="form-input"
          >
            <option value="member">Member</option>
            <option value="officer">Officer</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            Year
          </span>
          <input
            value={yearLabel}
            onChange={(e) => setYearLabel(e.target.value)}
            className="form-input"
            placeholder="2025-2026"
          />
        </label>
      </div>
      <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Admin (can approve events, manage members)</span>
        </label>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          {saved && <span className="text-sm text-emerald-700">Saved ✓</span>}
          <button
            onClick={save}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-dark disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
