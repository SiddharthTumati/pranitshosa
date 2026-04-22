import Link from "next/link";
import { EventFormPageShell } from "@/components/forms/EventFormPageShell";
import { AddEventForm } from "./AddEventForm";

export default function AddEventPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-brand-navy dark:text-brand-orange hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
      <EventFormPageShell
        title="Log a new event"
        subtitle={
          <>
            Add what you did. Photo optional. It shows as{" "}
            <span className="font-semibold text-brand-navy dark:text-brand-orange">
              pending
            </span>{" "}
            until an officer approves it.
          </>
        }
      >
        <AddEventForm />
      </EventFormPageShell>
    </div>
  );
}
