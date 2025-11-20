"use client";

import { useItineraryRatings } from "@/hooks/useRatings";
import type { Rating } from "@/lib/ratings";

interface Props {
  itineraryId: string;
}

export const RatingsList = ({ itineraryId }: Props) => {
  const { ratings, loading } = useItineraryRatings(itineraryId);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-slate-500">טוען דירוגים...</p>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">אין דירוגים עדיין. היה הראשון לדרג!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">דירוגים ותגובות ({ratings.length})</h3>
      {ratings.map((rating) => (
        <div
          key={rating.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= rating.rating
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  {rating.rating}/5
                </span>
              </div>
              {rating.comment && (
                <p className="text-slate-600">{rating.comment}</p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                {new Date(rating.createdAt).toLocaleDateString("he-IL")}
                {rating.updatedAt && rating.updatedAt !== rating.createdAt && (
                  <span> (עודכן)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

