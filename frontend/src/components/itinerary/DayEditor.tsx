"use client";

import { useState, useEffect } from "react";
import type { DaySegment, CostCategoryBreakdown } from "@/types";

interface Props {
  day: DaySegment;
  onSave: (day: DaySegment) => void;
  onCancel: () => void;
  saving?: boolean;
}

export const DayEditor = ({ day, onSave, onCancel, saving = false }: Props) => {
  const [form, setForm] = useState({
    title: day.title || "",
    dateLabel: day.dateLabel || "",
    area: day.area || "",
    summary: day.summary || "",
    tips: day.tips?.join("\n") || "",
    costs: day.costs || {
      food: undefined,
      lodging: undefined,
      transport: undefined,
      attractions: undefined,
      other: undefined,
    } as CostCategoryBreakdown,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDay: DaySegment = {
      ...day,
      title: form.title.trim(),
      dateLabel: form.dateLabel.trim() || undefined,
      area: form.area.trim() || undefined,
      summary: form.summary.trim() || undefined,
      tips: form.tips.trim()
        ? form.tips.split("\n").filter((t) => t.trim())
        : undefined,
      costs: Object.values(form.costs).some((v) => v !== undefined)
        ? form.costs
        : undefined,
      points: day.points || [],
    };
    onSave(updatedDay);
  };

  const handleCostChange = (
    key: keyof CostCategoryBreakdown,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      costs: {
        ...prev.costs,
        [key]: value ? Number(value) : undefined,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          כותרת היום
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm font-medium">
          תאריך/תווית
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.dateLabel}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dateLabel: e.target.value }))
            }
            placeholder="למשל: יום 1, 15.3.2024"
          />
        </label>
      </div>

      <label className="text-sm font-medium">
        אזור
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
          value={form.area}
          onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
          placeholder="למשל: תל אביב, פריז"
        />
      </label>

      <label className="text-sm font-medium">
        סיכום/תיאור
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
          rows={3}
          value={form.summary}
          onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
          placeholder="תיאור קצר של היום..."
        />
      </label>

      <label className="text-sm font-medium">
        טיפים (שורה אחת לכל טיפ)
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
          rows={3}
          value={form.tips}
          onChange={(e) => setForm((prev) => ({ ...prev, tips: e.target.value }))}
          placeholder="טיפ 1&#10;טיפ 2&#10;..."
        />
      </label>

      <div>
        <p className="text-sm font-medium">עלויות (אופציונלי)</p>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          <label className="text-xs">
            אוכל
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.costs.food || ""}
              onChange={(e) => handleCostChange("food", e.target.value)}
            />
          </label>
          <label className="text-xs">
            לינה
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.costs.lodging || ""}
              onChange={(e) => handleCostChange("lodging", e.target.value)}
            />
          </label>
          <label className="text-xs">
            תחבורה
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.costs.transport || ""}
              onChange={(e) => handleCostChange("transport", e.target.value)}
            />
          </label>
          <label className="text-xs">
            אטרקציות
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.costs.attractions || ""}
              onChange={(e) => handleCostChange("attractions", e.target.value)}
            />
          </label>
          <label className="text-xs">
            אחר
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={form.costs.other || ""}
              onChange={(e) => handleCostChange("other", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
        >
          ביטול
        </button>
        <button
          type="submit"
          disabled={saving || !form.title.trim()}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "שומר..." : "שמור"}
        </button>
      </div>
    </form>
  );
};

