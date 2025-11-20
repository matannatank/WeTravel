"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { getItinerary, duplicateItinerary } from "@/lib/itineraries";
import { addFavorite, removeFavorite } from "@/lib/favorites";
import { useIsFavorite } from "@/hooks/useFavorites";
import { useUserRating } from "@/hooks/useRatings";
import { RatingForm } from "@/components/itinerary/RatingForm";
import { RatingsList } from "@/components/itinerary/RatingsList";
import { ShareButtons } from "@/components/itinerary/ShareButtons";
import { ReportDialog } from "@/components/itinerary/ReportDialog";
import type { Itinerary } from "@/types";

export default function ItineraryViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  const id = params.id as string;
  const { favorite: isFav, loading: favoriteLoading } = useIsFavorite(
    user?.uid,
    id,
  );
  const { rating: userRating } = useUserRating(user?.uid, id);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadItinerary = async () => {
      try {
        setLoading(true);
        const data = await getItinerary(id);
        if (!data) {
          setError("מסלול לא נמצא");
          return;
        }
        setItinerary(data);
      } catch (err) {
        console.error(err);
        setError("אירעה שגיאה בטעינת המסלול");
      } finally {
        setLoading(false);
      }
    };

    loadItinerary();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p>טוען...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-red-500">{error || "מסלול לא נמצא"}</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 rounded-full bg-indigo-600 px-6 py-3 text-white"
        >
          חזרה לדף הבית
        </button>
      </div>
    );
  }

  const isOwner = user?.uid === itinerary.ownerId;

  const handleDuplicate = async () => {
    if (!user) {
      alert("יש להתחבר כדי להעתיק מסלול");
      return;
    }

    if (!confirm("העתק את המסלול הזה למסלול פרטי שלך?")) {
      return;
    }

    try {
      setDuplicating(true);
      const newId = await duplicateItinerary(id, user.uid);
      router.push(`/itinerary/${newId}/edit`);
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה בהעתקת המסלול");
    } finally {
      setDuplicating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("יש להתחבר כדי לשמור למועדפים");
      return;
    }

    try {
      setFavoriting(true);
      if (isFav) {
        await removeFavorite(user.uid, id);
      } else {
        await addFavorite(user.uid, id);
      }
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה בשמירה למועדפים");
    } finally {
      setFavoriting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{itinerary.primaryDestination}</span>
              {itinerary.regions && itinerary.regions.length > 0 && (
                <>
                  <span>•</span>
                  <span>{itinerary.regions.join(", ")}</span>
                </>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold">{itinerary.title}</h1>
            {itinerary.summary && (
              <p className="mt-3 text-slate-600">{itinerary.summary}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {itinerary.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-600"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              {itinerary.budget?.totalEstimated && (
                <span>
                  תקציב משוער: {itinerary.budget.totalEstimated}{" "}
                  {itinerary.budget.currency}
                </span>
              )}
              <span>
                עודכן: {new Date(itinerary.updatedAt).toLocaleDateString("he-IL")}
              </span>
              {itinerary.ratingCount && itinerary.ratingCount > 0 && (
                <span>
                  ⭐ {itinerary.ratingAverage?.toFixed(1)} ({itinerary.ratingCount})
                </span>
              )}
            </div>
            <div className="mt-4">
              <ShareButtons itineraryId={id} title={itinerary.title} />
            </div>
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <Link
                href={`/itinerary/${id}/edit`}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white"
              >
                עריכה
              </Link>
            ) : (
              <>
                {user && (
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favoriting || favoriteLoading}
                    className={`rounded-full px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300 ${
                      isFav
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-pink-600 hover:bg-pink-500"
                    }`}
                  >
                    {favoriting
                      ? "..."
                      : isFav
                        ? "הסר ממועדפים"
                        : "שמור למועדפים"}
                  </button>
                )}
                {user && (
                  <button
                    type="button"
                    onClick={handleDuplicate}
                    disabled={duplicating}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {duplicating ? "מעתיק..." : "העתק מסלול"}
                  </button>
                )}
                {user && !isOwner && (
                  <button
                    type="button"
                    onClick={() => setShowReportDialog(true)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    דווח
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {showReportDialog && user && (
        <ReportDialog
          itineraryId={id}
          userId={user.uid}
          onClose={() => setShowReportDialog(false)}
          onReported={() => {
            alert("תודה על הדיווח. נבדוק את התוכן בהקדם.");
          }}
        />
      )}

      {/* Days */}
      {itinerary.days && itinerary.days.length > 0 ? (
        <div className="space-y-6">
          {itinerary.days.map((day, dayIndex) => (
            <section
              key={dayIndex}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{day.title}</h2>
                {day.dateLabel && (
                  <p className="text-sm text-slate-500">{day.dateLabel}</p>
                )}
                {day.area && (
                  <p className="text-sm text-slate-500">אזור: {day.area}</p>
                )}
                {day.summary && (
                  <p className="mt-2 text-slate-600">{day.summary}</p>
                )}
              </div>

              {day.tips && day.tips.length > 0 && (
                <div className="mb-4 rounded-xl bg-amber-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-amber-900">
                    טיפים מיוחדים
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
                    {day.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {day.costs && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-emerald-900">
                    עלויות משוערות
                  </h3>
                  <div className="grid gap-2 text-sm text-emerald-800 md:grid-cols-3">
                    {day.costs.food && <span>אוכל: {day.costs.food}</span>}
                    {day.costs.lodging && (
                      <span>לינה: {day.costs.lodging}</span>
                    )}
                    {day.costs.transport && (
                      <span>תחבורה: {day.costs.transport}</span>
                    )}
                    {day.costs.attractions && (
                      <span>אטרקציות: {day.costs.attractions}</span>
                    )}
                    {day.costs.other && <span>אחר: {day.costs.other}</span>}
                  </div>
                </div>
              )}

              {day.points && day.points.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">נקודות עניין</h3>
                  {day.points.map((point, pointIndex) => (
                    <div
                      key={point.id || pointIndex}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold">
                              {point.name}
                            </h4>
                            {point.mustVisit && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                                חובה
                              </span>
                            )}
                          </div>
                          {point.area && (
                            <p className="text-sm text-slate-500">{point.area}</p>
                          )}
                          {point.description && (
                            <p className="mt-2 text-slate-600">
                              {point.description}
                            </p>
                          )}
                          {point.googleMapsUrl && (
                            <a
                              href={point.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-700"
                            >
                              פתח ב-Google Maps →
                            </a>
                          )}
                          {point.tips && point.tips.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-slate-500">
                                טיפים:
                              </p>
                              <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                                {point.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {point.warnings && point.warnings.length > 0 && (
                            <div className="mt-2 rounded-lg bg-red-50 p-2">
                              <p className="text-xs font-medium text-red-700">
                                אזהרות:
                              </p>
                              <ul className="mt-1 list-inside list-disc text-sm text-red-600">
                                {point.warnings.map((warning, warningIndex) => (
                                  <li key={warningIndex}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">אין נקודות ביום זה</p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-sm text-center">
          <p className="text-slate-500">אין ימים במסלול זה עדיין.</p>
          {isOwner && (
            <Link
              href={`/itinerary/${id}/edit`}
              className="mt-4 inline-block rounded-full bg-indigo-600 px-6 py-3 text-white"
            >
              הוסף ימים ונקודות
            </Link>
          )}
        </div>
      )}

      {/* Ratings Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">דירוגים ותגובות</h2>
        
        {user && !isOwner && (
          <div className="mb-6">
            <RatingForm
              userId={user.uid}
              itineraryId={id}
              existingRating={userRating}
              onSaved={() => {
                setRefreshKey((k) => k + 1);
                // Reload itinerary to get updated rating stats
                const loadItinerary = async () => {
                  const data = await getItinerary(id);
                  if (data) {
                    setItinerary(data);
                  }
                };
                loadItinerary();
              }}
            />
          </div>
        )}

        {!user && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              יש להתחבר כדי לדרג ולהשאיר תגובה
            </p>
          </div>
        )}

        <RatingsList key={refreshKey} itineraryId={id} />
      </section>
    </div>
  );
}

