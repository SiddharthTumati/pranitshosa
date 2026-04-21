import Link from "next/link";
import { MrhsAuthShell } from "@/components/auth/MrhsAuthShell";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <MrhsAuthShell
      title="Sign up"
      description="School email is fine. An officer still has to OK your hours (and any photos) before they count."
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
