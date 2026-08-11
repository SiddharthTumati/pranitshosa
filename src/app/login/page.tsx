import { redirect } from "next/navigation";

/** Sign-in removed — go straight to the dashboard. */
export default function LoginPage() {
  redirect("/dashboard");
}
