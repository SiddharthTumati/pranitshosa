"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState<string>("10");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Try to update profile with grade + name immediately if session already active
    if (data.session) {
      await supabase
        .from("profiles")
        .update({ full_name: fullName, grade: parseInt(grade, 10) })
        .eq("id", data.user!.id);

      router.push("/dashboard");
      router.refresh();
      return;
    }

    // Otherwise email-confirmation flow
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 text-sm">
        <p className="font-semibold">Check your email.</p>
        <p className="mt-1">
          We sent a confirmation link to <strong>{email}</strong>. Click it,
          then come back and sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Full name
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy focus:ring-0"
          autoComplete="name"
          placeholder="Jane Student"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Grade
        </label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy focus:ring-0 bg-white"
        >
          <option value="9">9th Grade</option>
          <option value="10">10th Grade</option>
          <option value="11">11th Grade</option>
          <option value="12">12th Grade</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy focus:ring-0"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy focus:ring-0"
          autoComplete="new-password"
        />
        <p className="text-xs text-slate-500 mt-1">
          Minimum 6 characters.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-navy text-white font-bold py-3 shadow-md border-b-4 border-brand-orange hover:bg-brand-navy-dark active:translate-y-px active:border-b-2 transition-all disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
