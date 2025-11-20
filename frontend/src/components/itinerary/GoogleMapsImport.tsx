"use client";

import { useState } from "react";
import { parseGoogleMapsExport } from "@/lib/integrations/googleMapsLists";
import { getPlaceDetails } from "@/lib/integrations/googleMaps";
import type { GoogleMapsListPoint } from "@/lib/integrations/googleMapsLists";
import type { PointOfInterest } from "@/types";

interface Props {
  onImport: (points: PointOfInterest[]) => void;
  onCancel: () => void;
}

export const GoogleMapsImport = ({ onImport, onCancel }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedPoints, setImportedPoints] = useState<GoogleMapsListPoint[]>([]);
  const [enrichedPoints, setEnrichedPoints] = useState<PointOfInterest[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const list = await parseGoogleMapsExport(file);
      setImportedPoints(list.points);

      // Enrich points with Google Maps data
      const enriched = await Promise.all(
        list.points.map(async (point, index) => {
          let placeData = null;
          if (point.placeId) {
            placeData = await getPlaceDetails(point.placeId);
          }

          return {
            id: `imported-${index}-${Date.now()}`,
            name: point.name,
            description: point.notes,
            googleMapsUrl: placeData?.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.name)}`,
            placeId: point.placeId || placeData?.id,
            latitude: point.lat || placeData?.lat,
            longitude: point.lng || placeData?.lng,
            area: point.address,
          } as PointOfInterest;
        }),
      );

      setEnrichedPoints(enriched);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "אירעה שגיאה בייבוא הרשימה");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onImport(enrichedPoints);
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">ייבוא רשימת Google Maps</h3>
      <p className="text-sm text-slate-600">
        ייצא את הרשימה שלך מ-Google Maps כקובץ CSV או JSON והעלה אותו כאן
      </p>

      <div>
        <label className="block text-sm font-medium">
          העלה קובץ
          <input
            type="file"
            accept=".csv,.json,.txt"
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={loading}
          />
        </label>
      </div>

      {loading && (
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-700">מעבד את הקובץ ומעשיר את הנקודות...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {enrichedPoints.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              נמצאו {enrichedPoints.length} נקודות
            </p>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {enrichedPoints.map((point) => (
              <div
                key={point.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <p className="font-medium">{point.name}</p>
                {point.area && (
                  <p className="text-sm text-slate-500">{point.area}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
            >
              ביטול
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-sm text-white"
            >
              ייבא נקודות
            </button>
          </div>
        </div>
      )}

      {!loading && enrichedPoints.length === 0 && (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
        >
          ביטול
        </button>
      )}
    </div>
  );
};



