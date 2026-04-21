import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
      <div className="max-w-md mx-auto p-6 mt-10 tracker-card">
        <h2 className="font-bold">Not your event</h2>
        <p className="text-sm text-slate-600 mt-1">
          You can only edit events you submitted.
        </p>
      </div>
    );
  }

  if (!canEdit(evt)) {
    return (
      <div className="max-w-lg mx-auto p-6 mt-10 tracker-card">
        <h2 className="font-bold text-lg">This event is locked</h2>
        <p className="text-sm text-slate-600 mt-2">
          Students can only edit events within 24 hours of submission, and only
          while they&apos;re still pending. If this needs a correction, please
          contact an officer.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-5 px-4 py-2 rounded-lg bg-brand-navy text-white font-semibold"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm text-brand-navy hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="tracker-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-brand-navy">Edit event</h1>
        <p className="text-sm text-slate-600 mt-1">
          Make any corrections below. You can only edit while the event is
          pending and within 24 hours of first submission.
        </p>
        <div className="mt-6">
          <EditEventForm event={evt} />
        </div>
      </div>
    </div>
  );
}
