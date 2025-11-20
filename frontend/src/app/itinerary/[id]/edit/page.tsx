"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { getItinerary, updateItinerary } from "@/lib/itineraries";
import type { Itinerary } from "@/types";
import { ItineraryEditor } from "@/components/itinerary/ItineraryEditor";

export default function EditItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

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

  if (authLoading || loading) {
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
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-full bg-indigo-600 px-6 py-3 text-white"
        >
          חזרה ללוח הבקרה
        </button>
      </div>
    );
  }

  if (!user || user.uid !== itinerary.ownerId) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-red-500">
          אין לך הרשאה לערוך מסלול זה. רק הבעלים יכול לערוך.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/itinerary/${id}`)}
          className="mt-4 rounded-full bg-indigo-600 px-6 py-3 text-white"
        >
          צפייה במסלול
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">עריכת מסלול</h1>
          <p className="text-sm text-slate-500">{itinerary.title}</p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/itinerary/${id}`)}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
        >
          ביטול
        </button>
      </header>

      <ItineraryEditor itinerary={itinerary} onSave={() => router.push(`/itinerary/${id}`)} />
    </div>
  );
}

