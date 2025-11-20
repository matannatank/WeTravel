"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { subscribeToPublicItineraries } from "@/lib/itineraries";
import type { Itinerary, TravelCategory } from "@/types";
import { CATEGORY_OPTIONS } from "@/types";

const featureCards = [
  {
    title: "ייבוא רשימות מגוגל מפות",
    description:
      "העלו רשימה שמורה, סדרו לימים ואזנו את התוכן בעזרת Gemini כדי לקבל מסלול מאושר ומדויק.",
  },
  {
    title: "AI + דיבור לטקסט",
    description:
      "ספרו בקול או כתבו ביומן חופשי – הבינה המלאכותית תזהה מקומות, תוודא אותם מול Google Maps ותציע השלמות.",
  },
  {
    title: "קהילה פתוחה",
    description:
      "מסלולים גלויים, דירוגים, המלצות והעתקת מסלולים בלחיצה. הכל בעברית, לכולם.",
  },
];

export default function Home() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory | "all">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublicItineraries((items) => {
      setItineraries(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItineraries = useMemo(() => {
    return itineraries.filter((itinerary) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          itinerary.title.toLowerCase().includes(query) ||
          itinerary.summary?.toLowerCase().includes(query) ||
          itinerary.primaryDestination.toLowerCase().includes(query) ||
          itinerary.regions?.some((r) => r.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all") {
        if (!itinerary.categories.includes(selectedCategory)) return false;
      }

      // Rating filter
      if (minRating > 0) {
        const rating = itinerary.ratingAverage || 0;
        if (rating < minRating) return false;
      }

      // Budget filter
      if (maxBudget) {
        const budget = Number(maxBudget);
        const totalBudget = itinerary.budget?.totalEstimated;
        if (totalBudget && totalBudget > budget) return false;
      }

      return true;
    });
  }, [itineraries, searchQuery, selectedCategory, minRating, maxBudget]);

  const featuredItineraries = useMemo(() => {
    return filteredItineraries
      .sort((a, b) => {
        // Sort by rating first, then by favorites count
        const ratingA = a.ratingAverage || 0;
        const ratingB = b.ratingAverage || 0;
        if (ratingA !== ratingB) return ratingB - ratingA;
        return (b.favoritesCount || 0) - (a.favoritesCount || 0);
      })
      .slice(0, 6);
  }, [filteredItineraries]);

  const recentItineraries = useMemo(() => {
    return filteredItineraries
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [filteredItineraries]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section id="vision" className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase text-indigo-500">
          מסע חדש למטיילים
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-[1.4] text-slate-900 md:text-4xl">
          WE Trip – פלטפורמה קהילתית ליצירה ושיתוף מסלולי טיול עשירים בעברית
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          האפליקציה מאחדת טיולים אישיים, רשימות Google Maps ותובנות בינה מלאכותית
          למסלול אחיד, מאושר ונגיש לכלל הקהילה. המטרה: לצמצם בלגן בקבצים,
          לאפשר ניווט נוח בין ימים ואזורים, ולהציג עלויות משוערות לכל חלק בטיול.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-600">
            רספונסיבי מלא
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
            קהילתי וחינמי
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">
            תמיכה בדיבור לטקסט
          </span>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">חיפוש וסינון מסלולים</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              חיפוש
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
                placeholder="חפש לפי שם, יעד, אזור..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium">
              קטגוריה
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as TravelCategory | "all")
                }
              >
                <option value="all">הכל</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              דירוג מינימלי
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>הכל</option>
                <option value={4}>4 כוכבים ומעלה</option>
                <option value={3}>3 כוכבים ומעלה</option>
                <option value={2}>2 כוכבים ומעלה</option>
                <option value={1}>1 כוכב ומעלה</option>
              </select>
            </label>

            <label className="text-sm font-medium">
              תקציב מקסימלי
              <input
                type="number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
                placeholder="למשל: 5000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </label>
          </div>

          <div className="text-sm text-slate-500">
            נמצאו {filteredItineraries.length} מסלולים
          </div>
        </div>
      </section>

      {/* Featured Itineraries */}
      {featuredItineraries.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">מסלולים מומלצים</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredItineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Itineraries */}
      {recentItineraries.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">מסלולים חדשים</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentItineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        </section>
      )}

      {/* All Itineraries */}
      {filteredItineraries.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">כל המסלולים</h2>
          {loading ? (
            <p className="text-slate-500">טוען מסלולים...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>
          )}
        </section>
      )}

      {!loading && filteredItineraries.length === 0 && (
        <section className="rounded-3xl bg-white p-8 shadow-sm text-center">
          <p className="text-slate-500">לא נמצאו מסלולים התואמים לחיפוש שלך.</p>
        </section>
      )}

      {/* Features */}
      <section
        id="features"
        className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10"
      >
        {featureCards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {card.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  return (
    <Link
      href={`/itinerary/${itinerary.id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold group-hover:text-indigo-600">
            {itinerary.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {itinerary.primaryDestination}
          </p>
        </div>
        {itinerary.ratingAverage && itinerary.ratingAverage > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <span>⭐</span>
            <span>{itinerary.ratingAverage.toFixed(1)}</span>
          </div>
        )}
      </div>

      {itinerary.summary && (
        <p className="mb-3 line-clamp-2 text-sm text-slate-600">
          {itinerary.summary}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {itinerary.categories.slice(0, 3).map((category) => (
          <span
            key={category}
            className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          עודכן: {new Date(itinerary.updatedAt).toLocaleDateString("he-IL")}
        </span>
        {itinerary.budget?.totalEstimated && (
          <span>
            {itinerary.budget.totalEstimated} {itinerary.budget.currency}
          </span>
        )}
      </div>
    </Link>
  );
}
