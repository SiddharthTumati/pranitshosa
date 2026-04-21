import Link from "next/link";
import { Suspense } from "react";
import { MrhsAuthShell } from "@/components/auth/MrhsAuthShell";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <MrhsAuthShell
      title="Sign in"
      description="Sign in with your email to log service events and track your hours."
    >
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>

      <p className="text-sm text-slate-600 dark:text-slate-400 mt-6 text-center">
        Need an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-orange hover:text-brand-navy hover:underline"
        >
          Sign up
        </Link>
      </p>
    </MrhsAuthShell>
  );
}
