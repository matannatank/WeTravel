"use client";

import { ItineraryForm } from "@/components/itinerary/ItineraryForm";
import { ItinerariesList } from "@/components/itinerary/ItinerariesList";
import { FavoritesList } from "@/components/itinerary/FavoritesList";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function DashboardPage() {
  const { user, loading, signIn, signOut } = useAuthContext();

  if (loading) {
    return (
      <div className="space-y-4">
        <p>טוען פרטי משתמש...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">ברוכים הבאים ללוח הבקרה</h1>
        <p className="mt-2 text-slate-600">
          כדי לנהל מסלולים, אנא התחברו באמצעות חשבון Google.
        </p>
        <button
          type="button"
          className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500"
          onClick={signIn}
        >
          התחברות עם Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">מחובר כעת</p>
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-slate-300"
          >
            התנתקות
          </button>
        </div>
      </header>

      <ItineraryForm ownerId={user.uid} />
      <ItinerariesList ownerId={user.uid} />
      <FavoritesList userId={user.uid} />
    </div>
  );
}

