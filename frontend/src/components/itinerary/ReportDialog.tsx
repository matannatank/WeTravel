"use client";

import { useState } from "react";
import { createReport, type ReportReason } from "@/lib/reports";

interface Props {
  itineraryId: string;
  userId: string;
  onClose: () => void;
  onReported?: () => void;
}

const REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: "offensive", label: "תוכן פוגעני" },
  { value: "spam", label: "ספאם" },
  { value: "copyright", label: "הפרת זכויות יוצרים" },
  { value: "other", label: "אחר" },
];

export const ReportDialog = ({
  itineraryId,
  userId,
  onClose,
  onReported,
}: Props) => {
  const [reason, setReason] = useState<ReportReason>("offensive");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      await createReport(itineraryId, userId, reason, notes.trim() || undefined);
      if (onReported) {
        onReported();
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "אירעה שגיאה בשליחת הדיווח");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">דיווח על מסלול</h2>
        <p className="mb-4 text-sm text-slate-600">
          אנא בחר סיבת הדיווח ופרט אם יש צורך
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">סיבת הדיווח</label>
            <div className="mt-2 space-y-2">
              {REASON_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option.value}
                    checked={reason === option.value}
                    onChange={(e) => setReason(e.target.value as ReportReason)}
                    className="text-indigo-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              פרטים נוספים (אופציונלי)
              <textarea
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="פרט את הסיבה לדיווח..."
              />
            </label>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "שולח..." : "שלח דיווח"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

