import Link from "next/link";
import { MrhsAuthShell } from "@/components/auth/MrhsAuthShell";
import { chapterSignupDescription } from "@/lib/chapterConfig";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <MrhsAuthShell
      title="Sign up"
      description={chapterSignupDescription()}
    >
      <SignupForm />

      <p className="text-sm text-slate-600 dark:text-slate-400 mt-6 text-center">
        Already signed up?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-orange hover:text-brand-navy hover:underline"
        >
          Sign in
        </Link>
      </p>
    </MrhsAuthShell>
  );
}
