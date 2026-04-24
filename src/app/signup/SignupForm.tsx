"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatSignupError, normalizeSignupEmail } from "@/lib/signupErrors";

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

    const normalizedEmail = normalizeSignupEmail(email);
    if (!normalizedEmail.includes("@")) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(formatSignupError(error.message));
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
      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 px-4 py-3 text-sm">
        <p className="font-semibold">Check your email.</p>
        <p className="mt-1">
          Confirmation link went to <strong>{normalizeSignupEmail(email)}</strong>
          . Open it, then sign in here.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Full name
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 dark:text-slate-100 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy dark:focus:border-brand-orange focus:ring-0"
          autoComplete="name"
          placeholder="First Last"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Grade
        </label>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy dark:focus:border-brand-orange focus:ring-0 bg-white dark:bg-slate-800/80 dark:text-slate-100"
        >
          <option value="9">9th Grade</option>
          <option value="10">10th Grade</option>
          <option value="11">11th Grade</option>
          <option value="12">12th Grade</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 dark:text-slate-100 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy dark:focus:border-brand-orange focus:ring-0"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/80 dark:text-slate-100 px-3 py-2.5 text-sm shadow-sm focus:border-brand-navy dark:focus:border-brand-orange focus:ring-0"
          autoComplete="new-password"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Minimum 8 characters.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 text-sm space-y-2">
          <p>{error}</p>
          {/already have an account/i.test(error) && (
            <p>
              <Link
                href="/login"
                className="font-semibold text-brand-navy dark:text-brand-orange underline"
              >
                Go to sign in
              </Link>
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-navy text-white font-bold py-3 shadow-md hover:bg-brand-navy-dark active:scale-[0.99] transition disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
