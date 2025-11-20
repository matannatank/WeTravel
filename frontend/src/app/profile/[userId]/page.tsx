"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { subscribeToOwnerItineraries } from "@/lib/itineraries";
import { useFavorites } from "@/hooks/useFavorites";
import type { Itinerary } from "@/types";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuthContext();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any>(null);

  const userId = params.userId as string;
  const isOwnProfile = currentUser?.uid === userId;
  const { favorites } = useFavorites(userId);

  useEffect(() => {
    if (!userId) return;

    // In a real app, you'd fetch user profile from Firestore
    // For now, we'll use the current user if it's their profile
    if (isOwnProfile && currentUser) {
      setProfileUser({
        id: currentUser.uid,
        name: currentUser.displayName || "משתמש",
        photoURL: currentUser.photoURL,
        email: currentUser.email,
      });
    } else {
      // For other users, you'd fetch from Firestore
      setProfileUser({
        id: userId,
        name: "משתמש",
      });
    }

    setLoading(true);
    const unsubscribe = subscribeToOwnerItineraries(userId, (items) => {
      setItineraries(items);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [userId, isOwnProfile, currentUser]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p>טוען פרופיל...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-red-500">משתמש לא נמצא</p>
      </div>
    );
  }

  const publishedCount = itineraries.filter((i) => i.status === "published").length;
  const draftCount = itineraries.filter((i) => i.status === "draft").length;
  const totalRatings = itineraries.reduce(
    (sum, i) => sum + (i.ratingCount || 0),
    0,
  );
  const avgRating =
    itineraries.length > 0
      ? itineraries.reduce((sum, i) => sum + (i.ratingAverage || 0), 0) /
        itineraries.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {profileUser.photoURL && (
            <img
              src={profileUser.photoURL}
              alt={profileUser.name}
              className="h-24 w-24 rounded-full"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profileUser.name}</h1>
            {profileUser.email && (
              <p className="mt-1 text-slate-500">{profileUser.email}</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-2xl font-bold">{itineraries.length}</p>
                <p className="text-sm text-slate-500">מסלולים</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{favorites.length}</p>
                <p className="text-sm text-slate-500">מועדפים</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRatings}</p>
                <p className="text-sm text-slate-500">דירוגים</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                </p>
                <p className="text-sm text-slate-500">דירוג ממוצע</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">סטטיסטיקות</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">מסלולים מפורסמים</p>
            <p className="mt-2 text-2xl font-bold">{publishedCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">טיוטות</p>
            <p className="mt-2 text-2xl font-bold">{draftCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">סה"כ צפיות</p>
            <p className="mt-2 text-2xl font-bold">
              {itineraries.reduce((sum, i) => sum + (i.shareCount || 0), 0)}
            </p>
          </div>
        </div>
      </section>

      {/* Itineraries */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">מסלולים ({itineraries.length})</h2>
          {isOwnProfile && (
            <Link
              href="/dashboard"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white"
            >
              ניהול מסלולים
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-slate-500">טוען מסלולים...</p>
        ) : itineraries.length === 0 ? (
          <p className="text-slate-500">אין מסלולים עדיין</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
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
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {itinerary.status === "draft" ? "טיוטה" : "מפורסם"}
                  </span>
                  {itinerary.ratingCount && itinerary.ratingCount > 0 && (
                    <span>
                      ⭐ {itinerary.ratingAverage?.toFixed(1)} (
                      {itinerary.ratingCount})
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

