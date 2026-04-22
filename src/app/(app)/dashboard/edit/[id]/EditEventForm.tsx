"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORIES,
  DURATION_MINUTE_CHOICES,
  formatDurationChoiceLabel,
  minutesToDbHours,
  snapMinutesToChoice,
  type Category,
  type EventRow,
  type Semester,
} from "@/lib/types";
import { compressImage } from "@/lib/compressImage";
import { PhotoInput } from "@/components/PhotoInput";

export function EditEventForm({ event }: { event: EventRow }) {
  const router = useRouter();
  const [name, setName] = useState(event.name);
  const [date, setDate] = useState(event.event_date);
  const [semester, setSemester] = useState<Semester>(event.semester);
  const [minutes, setMinutes] = useState(() =>
    String(snapMinutesToChoice(Math.round(Number(event.hours) * 60)))
  );
  const [category, setCategory] = useState<Category>(event.category);
  const [notes, setNotes] = useState(event.notes ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [keepPhoto, setKeepPhoto] = useState(!!event.photo_url);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handlePhotoChange(f: File | null) {
    setPhoto(f);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(f ? URL.createObjectURL(f) : null);
    if (f) setKeepPhoto(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in.");
      setSubmitting(false);
      return;
    }

    const minutesNum = parseInt(minutes, 10);
    if (
      !Number.isFinite(minutesNum) ||
      !DURATION_MINUTE_CHOICES.includes(minutesNum)
    ) {
      setError("Pick a valid duration (1 min, or 5-minute steps).");
      setSubmitting(false);
      return;
    }
    const hoursNum = minutesToDbHours(minutesNum);

    let photoUrl: string | null = keepPhoto ? event.photo_url : null;
    let photoPath: string | null = keepPhoto ? event.photo_path : null;

    if (photo) {
      const compressed = await compressImage(photo);
      const ext = compressed.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["png", "jpg", "jpeg", "webp", "heic", "gif"].includes(
        ext
      )
        ? ext
        : "jpg";
      photoPath = `${user.id}/${crypto.randomUUID()}.${safeExt}`;
      const { error: upErr } = await supabase.storage
        .from("event-photos")
        .upload(photoPath, compressed, {
          cacheControl: "31536000",
          upsert: false,
          contentType: compressed.type || undefined,
        });
      if (upErr) {
        setError(`Photo upload failed: ${upErr.message}`);
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("event-photos")
        .getPublicUrl(photoPath);
      photoUrl = urlData.publicUrl;
    }

    const { error: updErr } = await supabase
      .from("events")
      .update({
        name: name.trim(),
        event_date: date,
        semester,
        hours: hoursNum,
        category,
        notes: notes.trim() || null,
        photo_url: photoUrl,
        photo_path: photoPath,
      })
      .eq("id", event.id);

    if (updErr) {
      setError(updErr.message);
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Event name" required>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Date" required>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </Field>
        <Field
          label="Time spent"
          required
          hint="1 minute minimum, then 5, 10, 15… up to 8 hours."
        >
          <select
            required
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="form-input bg-white dark:bg-slate-800/80 dark:text-slate-100"
          >
            {DURATION_MINUTE_CHOICES.map((m) => (
              <option key={m} value={String(m)}>
                {formatDurationChoiceLabel(m)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Semester" required>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as Semester)}
            className="form-input"
          >
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
          </select>
        </Field>
        <Field label="Category" required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="form-input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {event.photo_url && keepPhoto && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Current photo
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.photo_url}
            alt="Event"
            className="max-h-48 rounded-lg border border-slate-200 dark:border-slate-600"
          />
          <button
            type="button"
            onClick={() => setKeepPhoto(false)}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            Remove photo
          </button>
        </div>
      )}

      <Field
        label={event.photo_url && keepPhoto ? "Replace photo" : "Photo"}
        hint="Snap a photo at the event or pick one from your camera roll."
      >
        <PhotoInput
          onChange={handlePhotoChange}
          preview={photoPreview}
          fileName={photo?.name}
          sizeBytes={photo?.size}
        />
      </Field>

      <Field label="Notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="form-input resize-y"
        />
      </Field>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-brand-navy text-white font-semibold py-2.5 hover:bg-brand-navy-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
          {hint}
        </span>
      )}
    </label>
  );
}
