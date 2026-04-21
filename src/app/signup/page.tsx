import Link from "next/link";
import { MrhsAuthShell } from "@/components/auth/MrhsAuthShell";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <MrhsAuthShell
      title="Create your account"
      description="Use your school email. Chapter officers approve your service hours and photos."
    >
      <SignupForm />

      <p className="text-sm text-slate-600 mt-6 text-center">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-brand-orange hover:text-brand-navy hover:underline"
        >
          Sign in
        </Link>
      </p>
    </MrhsAuthShell>
  );
}
