import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const chapterName = process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "HOSA Chapter";

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="tracker-card w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-navy flex items-center justify-center">
            <Logo className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {chapterName}
            </p>
            <h1 className="text-xl font-bold text-brand-navy">
              Service Tracker
            </h1>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
        <p className="text-sm text-slate-600 mb-6">
          Sign in to log events and track your hours.
        </p>

        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>

        <p className="text-sm text-slate-600 mt-6 text-center">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-navy hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
