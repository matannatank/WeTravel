"use client";

import { useState } from "react";
import type { PointOfInterest } from "@/types";

interface Props {
  point?: PointOfInterest;
  onSave: (point: PointOfInterest) => void;
  onCancel: () => void;
  saving?: boolean;
}

export const PointEditor = ({
  point,
  onSave,
  onCancel,
  saving = false,
}: Props) => {
  const [form, setForm] = useState({
    name: point?.name || "",
    description: point?.description || "",
    googleMapsUrl: point?.googleMapsUrl || "",
    placeId: point?.placeId || "",
    latitude: point?.latitude?.toString() || "",
    longitude: point?.longitude?.toString() || "",
    area: point?.area || "",
    mustVisit: point?.mustVisit || false,
    warnings: point?.warnings?.join("\n") || "",
    tips: point?.tips?.join("\n") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPoint: PointOfInterest = {
      id: point?.id || `point-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      googleMapsUrl: form.googleMapsUrl.trim() || "",
      placeId: form.placeId.trim() || undefined,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      area: form.area.trim() || undefined,
      mustVisit: form.mustVisit,
      warnings: form.warnings.trim()
        ? form.warnings.split("\n").filter((w) => w.trim())
        : undefined,
      tips: form.tips.trim()
        ? form.tips.split("\n").filter((t) => t.trim())
        : undefined,
      media: point?.media,
    };
    onSave(updatedPoint);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          שם המקום *
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </label>
        <label className="text-sm font-medium">
          אזור
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.area}
            onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
          />
        </label>
      </div>

      <label className="text-sm font-medium">
        תיאור
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
          rows={2}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="תיאור המקום..."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          קישור ל-Google Maps *
          <input
            type="url"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.googleMapsUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, googleMapsUrl: e.target.value }))
            }
            placeholder="https://maps.google.com/..."
            required
          />
        </label>
        <label className="text-sm font-medium">
          Place ID
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.placeId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, placeId: e.target.value }))
            }
            placeholder="ChIJ..."
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          קו רוחב
          <input
            type="number"
            step="any"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.latitude}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, latitude: e.target.value }))
            }
            placeholder="31.7683"
          />
        </label>
        <label className="text-sm font-medium">
          קו אורך
          <input
            type="number"
            step="any"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.longitude}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, longitude: e.target.value }))
            }
            placeholder="35.2137"
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.mustVisit}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, mustVisit: e.target.checked }))
          }
          className="rounded border-slate-300"
        />
        <span className="text-sm font-medium">תחנה חובה</span>
      </label>

      <label className="text-sm font-medium">
        אזהרות (שורה אחת לכל אזהרה)
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
          rows={2}
          value={form.warnings}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, warnings: e.target.value }))
          }
          placeholder="אזהרה 1&#10;אזהרה 2&#10;..."
        />
      </label>

      <label className="text-sm font-medium">
        טיפים (שורה אחת לכל טיפ)
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
          rows={2}
          value={form.tips}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tips: e.target.value }))
          }
          placeholder="טיפ 1&#10;טיפ 2&#10;..."
        />
      </label>

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
          disabled={saving || !form.name.trim() || !form.googleMapsUrl.trim()}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "שומר..." : "שמור"}
        </button>
      </div>
    </form>
  );
};

