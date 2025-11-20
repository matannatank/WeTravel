"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { getItinerary } from "@/lib/itineraries";
import type { Itinerary } from "@/types";

interface Props {
  userId: string;
}

export const FavoritesList = ({ userId }: Props) => {
  const { favorites, loading: favoritesLoading } = useFavorites(userId);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favorites.length) {
      setItineraries([]);
      setLoading(false);
      return;
    }

    const loadItineraries = async () => {
      try {
        setLoading(true);
        const loaded = await Promise.all(
          favorites.map((fav) => getItinerary(fav.itineraryId)),
        );
        setItineraries(loaded.filter((it) => it !== null) as Itinerary[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadItineraries();
  }, [favorites]);

  if (favoritesLoading || loading) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-slate-500">טוען מועדפים...</p>
      </section>
    );
  }

  if (favorites.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <header className="mb-4">
          <p className="text-sm text-slate-500">מועדפים</p>
          <h2 className="text-xl font-bold">אין מועדפים</h2>
        </header>
        <p className="text-sm text-slate-500">
          שמור מסלולים למועדפים כדי לגשת אליהם בקלות.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="mb-4">
        <p className="text-sm text-slate-500">מועדפים</p>
        <h2 className="text-xl font-bold">
          יש {favorites.length} מסלולים במועדפים
        </h2>
      </header>

      <div className="mt-4 space-y-4">
        {itineraries.map((itinerary) => (
          <article
            key={itinerary.id}
            className="rounded-2xl border border-slate-100 p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{itinerary.title}</h3>
                <p className="text-sm text-slate-500">
                  {itinerary.primaryDestination}
                </p>
                {itinerary.summary && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {itinerary.summary}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {itinerary.ratingCount && itinerary.ratingCount > 0 && (
                  <span>
                    ⭐ {itinerary.ratingAverage?.toFixed(1)} (
                    {itinerary.ratingCount})
                  </span>
                )}
                <span>
                  עודכן:{" "}
                  {new Date(itinerary.updatedAt).toLocaleDateString("he-IL")}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {itinerary.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href={`/itinerary/${itinerary.id}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                צפייה במסלול
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

