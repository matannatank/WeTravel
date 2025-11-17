"use client";

import { useState } from "react";
import { deleteItinerary } from "@/lib/itineraries";
import { useItineraries } from "@/hooks/useItineraries";

interface Props {
  ownerId: string;
}

export const ItinerariesList = ({ ownerId }: Props) => {
  const { itineraries, loading } = useItineraries(ownerId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את המסלול לצמיתות?")) return;
    setDeletingId(id);
    try {
      await deleteItinerary(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">המסלולים שלי</p>
          <h2 className="text-xl font-bold">
            {itineraries.length ? `יש ${itineraries.length} מסלולים` : "אין מסלולים"}
          </h2>
        </div>
      </header>

      {loading && <p>טוען...</p>}
      {!loading && itineraries.length === 0 && (
        <p className="text-sm text-slate-500">
          עדיין לא יצרתם מסלולים. התחילו בטופס למעלה!
        </p>
      )}

      <div className="mt-4 space-y-4">
        {itineraries.map((itinerary) => (
          <article
            key={itinerary.id}
            className="rounded-2xl border border-slate-100 p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{itinerary.title}</h3>
                <p className="text-sm text-slate-500">{itinerary.primaryDestination}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>עודכן: {new Date(itinerary.updatedAt).toLocaleDateString("he-IL")}</span>
                <span>קטגוריות: {itinerary.categories.join(", ") || "ללא"}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 line-clamp-2">
              {itinerary.summary || "אין תקציר"}
            </p>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                סטטוס: {itinerary.status === "draft" ? "טיוטה" : "מפורסם"}
              </span>
              {itinerary.budget?.totalEstimated && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  תקציב: {itinerary.budget.totalEstimated}{" "}
                  {itinerary.budget.currency}
                </span>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
                disabled
              >
                עריכה בקרוב
              </button>
              <button
                type="button"
                className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(itinerary.id)}
                disabled={deletingId === itinerary.id}
              >
                {deletingId === itinerary.id ? "מוחק..." : "מחיקה"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

