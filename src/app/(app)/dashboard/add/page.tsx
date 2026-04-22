import Link from "next/link";
import { AddEventForm } from "./AddEventForm";

export default function AddEventPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm text-brand-navy dark:text-brand-orange hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="tracker-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-brand-navy dark:text-slate-100">
          Log a new event
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Add what you did. Photo optional. It shows as{" "}
          <span className="font-semibold">pending</span> until an officer
          approves it.
        </p>
        <div className="mt-6">
          <AddEventForm />
        </div>
      </div>
    </div>
  );
}
