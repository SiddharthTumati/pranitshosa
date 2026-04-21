import Link from "next/link";
import { Suspense } from "react";
import { MrhsAuthShell } from "@/components/auth/MrhsAuthShell";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <MrhsAuthShell
      title="Welcome back"
      description="Sign in with your chapter email to log service events and track your hours."
    >
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>

      <p className="text-sm text-slate-600 mt-6 text-center">
        New here?{" "}
        <Link
          href="/signup"
          className="font-bold text-brand-orange hover:text-brand-navy hover:underline"
        >
          Create an account
        </Link>
      </p>
    </MrhsAuthShell>
  );
}
