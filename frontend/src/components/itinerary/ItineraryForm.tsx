"use client";

import { useMemo, useState } from "react";
import type { AreaCostEstimate, TravelCategory } from "@/types";
import { CATEGORY_OPTIONS } from "@/types";
import { createItinerary, type ItineraryInput } from "@/lib/itineraries";

interface Props {
  ownerId: string;
}

const initialCostRow = (): AreaCostEstimate => ({
  area: "",
  currency: "ILS",
  estimate: 0,
});

export const ItineraryForm = ({ ownerId }: Props) => {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    primaryDestination: "",
    regions: "",
    categories: [] as TravelCategory[],
    currency: "ILS",
    totalEstimated: "",
  });
  const [areaCosts, setAreaCosts] = useState<AreaCostEstimate[]>([
    initialCostRow(),
  ]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(
    () => form.title.trim().length > 2 && form.primaryDestination.length > 2,
    [form.title, form.primaryDestination],
  );

  const handleCategoryToggle = (category: TravelCategory) => {
    setForm((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const handleAreaChange = (
    index: number,
    key: keyof AreaCostEstimate,
    value: string,
  ) => {
    setAreaCosts((prev) =>
      prev.map((row, idx) =>
        idx === index
          ? {
              ...row,
              [key]:
                key === "estimate"
                  ? Number(value) || 0
                  : (value as AreaCostEstimate[typeof key]),
            }
          : row,
      ),
    );
  };

  const addAreaRow = () => {
    setAreaCosts((prev) => [...prev, initialCostRow()]);
  };

  const clearForm = () => {
    setForm({
      title: "",
      summary: "",
      primaryDestination: "",
      regions: "",
      categories: [],
      currency: "ILS",
      totalEstimated: "",
    });
    setAreaCosts([initialCostRow()]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    setStatus("saving");
    setError(null);
    try {
      const payload: ItineraryInput = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        primaryDestination: form.primaryDestination.trim(),
        regions: form.regions
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        categories: form.categories,
        budget: {
          currency: form.currency,
          totalEstimated: Number(form.totalEstimated) || undefined,
          perArea: areaCosts
            .filter((row) => row.area.trim() && row.estimate > 0)
            .map((row) => ({
              ...row,
              area: row.area.trim(),
            })),
        },
      };

      await createItinerary(ownerId, payload);
      setStatus("success");
      clearForm();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("אירעה שגיאה בשמירת המסלול. ודאו שה-env מוגדרים.");
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="mb-6">
        <p className="text-sm text-slate-500">יצירת מסלול חדש</p>
        <h2 className="text-xl font-bold">מפרט בסיסי</h2>
      </header>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">
            שם המסלול
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </label>
          <label className="text-sm font-medium">
            יעד מרכזי
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2"
              value={form.primaryDestination}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, primaryDestination: e.target.value }))
              }
              required
            />
          </label>
        </div>

        <label className="text-sm font-medium">
          תקציר
          <textarea
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2"
            rows={3}
            value={form.summary}
            onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
          />
        </label>

        <label className="text-sm font-medium">
          אזורים / מדינות (מופרדים בפסיק)
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2"
            value={form.regions}
            onChange={(e) => setForm((prev) => ({ ...prev, regions: e.target.value }))}
          />
        </label>

        <div>
          <p className="text-sm font-medium">קטגוריות</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                type="button"
                key={category}
                className={`rounded-full px-4 py-1 text-sm ${
                  form.categories.includes(category)
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium">
            מטבע
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2"
              value={form.currency}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, currency: e.target.value }))
              }
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            תקציב כללי משוער
            <input
              type="number"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2"
              value={form.totalEstimated}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, totalEstimated: e.target.value }))
              }
            />
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">עלויות לפי אזור</p>
            <button
              type="button"
              onClick={addAreaRow}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              הוספת אזור
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {areaCosts.map((row, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-slate-100 p-3 md:grid-cols-3"
              >
                <input
                  placeholder="שם האזור"
                  value={row.area}
                  onChange={(e) => handleAreaChange(index, "area", e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2"
                />
                <input
                  placeholder="מטבע"
                  value={row.currency}
                  onChange={(e) => handleAreaChange(index, "currency", e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="עלות משוערת"
                  value={row.estimate || ""}
                  onChange={(e) => handleAreaChange(index, "estimate", e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {status === "success" && (
          <p className="text-sm text-emerald-600">המסלול נשמר בהצלחה!</p>
        )}

        <button
          type="submit"
          disabled={!isValid || status === "saving"}
          className="rounded-full bg-indigo-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "saving" ? "שומר..." : "שמור מסלול"}
        </button>
      </form>
    </section>
  );
};

