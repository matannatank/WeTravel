"use client";

import { useState } from "react";
import { addRating, removeRating } from "@/lib/ratings";
import type { Rating } from "@/lib/ratings";

interface Props {
  userId: string;
  itineraryId: string;
  existingRating?: Rating | null;
  onSaved?: () => void;
}

export const RatingForm = ({
  userId,
  itineraryId,
  existingRating,
  onSaved,
}: Props) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("יש לבחור דירוג בין 1 ל-5");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await addRating(userId, itineraryId, rating, comment.trim() || undefined);
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בשמירת הדירוג");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("להסיר את הדירוג?")) return;

    try {
      setSaving(true);
      setError(null);
      await removeRating(userId, itineraryId);
      setRating(0);
      setComment("");
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בהסרת הדירוג");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <label className="text-sm font-medium">דירוג</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-slate-300"
              } hover:text-yellow-400`}
            >
              ⭐
            </button>
          ))}
          {rating > 0 && (
            <span className="mr-2 text-sm text-slate-600">{rating}/5</span>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">
          תגובה (אופציונלי)
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="שתף את החוויה שלך..."
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || rating < 1}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "שומר..." : existingRating ? "עדכן דירוג" : "שמור דירוג"}
        </button>
        {existingRating && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={saving}
            className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 disabled:cursor-not-allowed"
          >
            הסר דירוג
          </button>
        )}
      </div>
    </form>
  );
};

