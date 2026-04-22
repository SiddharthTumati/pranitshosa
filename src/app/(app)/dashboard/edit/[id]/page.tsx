import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventFormPageShell } from "@/components/forms/EventFormPageShell";
import { chapterBrandKicker } from "@/lib/chapterConfig";
import { canEdit, type EventRow } from "@/lib/types";
import { EditEventForm } from "./EditEventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: evt } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single<EventRow>();

  if (!evt) notFound();
  if (evt.user_id !== user.id) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10 tracker-card border-l-[3px] border-l-brand-navy">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
          {chapterBrandKicker()}
        </p>
        <h2 className="mt-2 font-semibold text-lg text-[color:var(--color-brand-ink)] dark:text-white">
          Not your event
        </h2>
        <p className="text-sm text-[color:var(--muted)] dark:text-slate-300 mt-1">
          You can only edit events you submitted.
        </p>
      </div>
    );
  }

  if (!canEdit(evt)) {
    return (
      <div className="max-w-lg mx-auto p-6 mt-10 tracker-card border-l-[3px] border-l-brand-orange">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy dark:text-brand-orange">
          {chapterBrandKicker()}
        </p>
        <h2 className="mt-2 font-semibold text-lg text-[color:var(--color-brand-ink)] dark:text-white">
          This event is locked
        </h2>
        <p className="text-sm text-[color:var(--muted)] dark:text-slate-300 mt-2">
          Students can only edit events within 24 hours of submission, and only
          while they&apos;re still pending. If this needs a correction, please
          contact an officer.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-5 px-4 py-2 rounded-[var(--radius-sm)] border border-brand-navy-dark bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-dark"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

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
        title="Edit event"
        subtitle={
          <>
            Make any corrections below. You can only edit while the event is
            pending and within{" "}
            <span className="font-semibold text-brand-navy dark:text-brand-orange">
              24 hours
            </span>{" "}
            of first submission.
          </>
        }
      >
        <EditEventForm event={evt} />
      </EventFormPageShell>
    </div>
  );
}
