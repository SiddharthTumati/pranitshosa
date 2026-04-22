"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORIES,
  DURATION_MINUTE_CHOICES,
  formatDurationChoiceLabel,
  minutesToDbHours,
  type Category,
  type Semester,
} from "@/lib/types";
import { compressImage } from "@/lib/compressImage";
import { PhotoInput } from "@/components/PhotoInput";
import { Field } from "@/components/forms/Field";

function guessSemester(dateStr: string): Semester {
  if (!dateStr) return "fall";
  const d = new Date(dateStr + "T00:00:00");
  const m = d.getMonth();
  // Aug (7) - Dec (11) = fall ; Jan (0) - July (6) = spring
  return m >= 7 ? "fall" : "spring";
}

export function AddEventForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [semester, setSemester] = useState<Semester>("fall");
  const [semesterAuto, setSemesterAuto] = useState(true);
  const [minutes, setMinutes] = useState("30");
  const [category, setCategory] = useState<Category>("Community");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleDateChange(v: string) {
    setDate(v);
    if (semesterAuto && v) setSemester(guessSemester(v));
  }

  function handlePhotoChange(f: File | null) {
    setPhoto(f);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(f ? URL.createObjectURL(f) : null);
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

    let photoUrl: string | null = null;
    let photoPath: string | null = null;

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

    const { error: insErr } = await supabase.from("events").insert({
      user_id: user.id,
      name: name.trim(),
      event_date: date,
      semester,
      hours: hoursNum,
      category,
      notes: notes.trim() || null,
      photo_url: photoUrl,
      photo_path: photoPath,
      status: "pending",
    });

    if (insErr) {
      setError(insErr.message);
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
          placeholder="e.g. Blood Drive Volunteering"
          className="form-input"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Date" required>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
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
            className="form-input"
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
            onChange={(e) => {
              setSemester(e.target.value as Semester);
              setSemesterAuto(false);
            }}
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

      <Field
        label="Photo"
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
          placeholder="Anything officers should know about this event…"
          className="form-input resize-y"
        />
      </Field>

      {error && (
        <div className="rounded-[var(--radius-sm)] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-[var(--radius-sm)] border border-brand-navy-dark bg-brand-navy text-white font-semibold py-2.5 hover:bg-brand-navy-dark disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit for approval"}
        </button>
      </div>
    </form>
  );
}
