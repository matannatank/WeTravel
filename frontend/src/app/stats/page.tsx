"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { subscribeToPublicItineraries } from "@/lib/itineraries";
import type { Itinerary } from "@/types";

export default function StatsPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublicItineraries((items) => {
      setItineraries(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const topRated = useMemo(() => {
    return [...itineraries]
      .filter((i) => i.ratingCount && i.ratingCount > 0)
      .sort((a, b) => {
        const ratingA = a.ratingAverage || 0;
        const ratingB = b.ratingAverage || 0;
        if (ratingA !== ratingB) return ratingB - ratingA;
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      })
      .slice(0, 10);
  }, [itineraries]);

  const mostFavorited = useMemo(() => {
    return [...itineraries]
      .filter((i) => i.favoritesCount && i.favoritesCount > 0)
      .sort((a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0))
      .slice(0, 10);
  }, [itineraries]);

  const topDestinations = useMemo(() => {
    const destinations = new Map<string, number>();
    itineraries.forEach((it) => {
      const dest = it.primaryDestination;
      destinations.set(dest, (destinations.get(dest) || 0) + 1);
    });

    return Array.from(destinations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([destination, count]) => ({ destination, count }));
  }, [itineraries]);

  const recentItineraries = useMemo(() => {
    return [...itineraries]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [itineraries]);

  const totalStats = useMemo(() => {
    return {
      totalItineraries: itineraries.length,
      totalRatings: itineraries.reduce((sum, i) => sum + (i.ratingCount || 0), 0),
      totalFavorites: itineraries.reduce((sum, i) => sum + (i.favoritesCount || 0), 0),
      totalDestinations: new Set(itineraries.map((i) => i.primaryDestination)).size,
    };
  }, [itineraries]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p>טוען סטטיסטיקות...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">סטטיסטיקות כלליות</h1>
        <p className="mt-2 text-sm text-slate-500">
          סקירה כללית של הפעילות בפלטפורמה
        </p>
      </header>

      {/* Total Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">סה"כ מסלולים</p>
          <p className="mt-2 text-3xl font-bold">{totalStats.totalItineraries}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">סה"כ דירוגים</p>
          <p className="mt-2 text-3xl font-bold">{totalStats.totalRatings}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">סה"כ מועדפים</p>
          <p className="mt-2 text-3xl font-bold">{totalStats.totalFavorites}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">יעדים שונים</p>
          <p className="mt-2 text-3xl font-bold">{totalStats.totalDestinations}</p>
        </div>
      </section>

      {/* Top Rated */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">מסלולים מדורגים ביותר</h2>
        {topRated.length === 0 ? (
          <p className="text-slate-500">אין מסלולים מדורגים עדיין</p>
        ) : (
          <div className="space-y-3">
            {topRated.map((itinerary, index) => (
              <Link
                key={itinerary.id}
                href={`/itinerary/${itinerary.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{itinerary.title}</h3>
                    <p className="text-sm text-slate-500">
                      {itinerary.primaryDestination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-semibold">
                    {itinerary.ratingAverage?.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({itinerary.ratingCount})
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Most Favorited */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">מסלולים אהובים ביותר</h2>
        {mostFavorited.length === 0 ? (
          <p className="text-slate-500">אין מסלולים במועדפים עדיין</p>
        ) : (
          <div className="space-y-3">
            {mostFavorited.map((itinerary, index) => (
              <Link
                key={itinerary.id}
                href={`/itinerary/${itinerary.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{itinerary.title}</h3>
                    <p className="text-sm text-slate-500">
                      {itinerary.primaryDestination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-500">❤️</span>
                  <span className="font-semibold">
                    {itinerary.favoritesCount}
                  </span>
                  <span className="text-sm text-slate-500">מועדפים</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Top Destinations */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">יעדים פופולריים</h2>
        {topDestinations.length === 0 ? (
          <p className="text-slate-500">אין יעדים עדיין</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {topDestinations.map((item, index) => (
              <div
                key={item.destination}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                    {index + 1}
                  </span>
                  <span className="font-semibold">{item.destination}</span>
                </div>
                <span className="text-sm text-slate-500">{item.count} מסלולים</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Itineraries */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">מסלולים חדשים</h2>
        {recentItineraries.length === 0 ? (
          <p className="text-slate-500">אין מסלולים עדיין</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentItineraries.map((itinerary) => (
              <Link
                key={itinerary.id}
                href={`/itinerary/${itinerary.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold group-hover:text-indigo-600">
                  {itinerary.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {itinerary.primaryDestination}
                </p>
                {itinerary.summary && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {itinerary.summary}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(itinerary.createdAt).toLocaleDateString("he-IL")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

