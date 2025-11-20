"use client";

import { useState } from "react";
import type { Itinerary, DaySegment, PointOfInterest } from "@/types";
import {
  updateItinerary,
  updateItineraryDays,
  addDayToItinerary,
  updateDayInItinerary,
  deleteDayFromItinerary,
  addPointToDay,
  updatePointInDay,
  deletePointFromDay,
} from "@/lib/itineraries";
import { DayEditor } from "./DayEditor";
import { PointEditor } from "./PointEditor";

interface Props {
  itinerary: Itinerary;
  onSave?: () => void;
}

export const ItineraryEditor = ({ itinerary, onSave }: Props) => {
  const [days, setDays] = useState<DaySegment[]>(itinerary.days || []);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingPoint, setEditingPoint] = useState<{
    dayIndex: number;
    pointIndex: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDay = () => {
    const newDay: DaySegment = {
      title: `יום ${days.length + 1}`,
      points: [],
    };
    setDays([...days, newDay]);
    setEditingDayIndex(days.length);
  };

  const handleSaveDay = async (dayIndex: number, day: DaySegment) => {
    try {
      setSaving(true);
      setError(null);
      if (dayIndex < days.length) {
        await updateDayInItinerary(itinerary.id, dayIndex, day);
        const updatedDays = [...days];
        updatedDays[dayIndex] = day;
        setDays(updatedDays);
      } else {
        await addDayToItinerary(itinerary.id, day);
        setDays([...days, day]);
      }
      setEditingDayIndex(null);
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בשמירת היום");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDay = async (dayIndex: number) => {
    if (!confirm("למחוק את היום הזה?")) return;
    try {
      setSaving(true);
      setError(null);
      await deleteDayFromItinerary(itinerary.id, dayIndex);
      setDays(days.filter((_, index) => index !== dayIndex));
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה במחיקת היום");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPoint = (dayIndex: number) => {
    setEditingPoint({ dayIndex, pointIndex: -1 });
  };

  const handleSavePoint = async (
    dayIndex: number,
    pointIndex: number,
    point: PointOfInterest,
  ) => {
    try {
      setSaving(true);
      setError(null);
      if (pointIndex >= 0 && pointIndex < days[dayIndex].points.length) {
        await updatePointInDay(itinerary.id, dayIndex, pointIndex, point);
        const updatedDays = [...days];
        updatedDays[dayIndex].points[pointIndex] = point;
        setDays(updatedDays);
      } else {
        const pointWithId = {
          ...point,
          id: point.id || `point-${Date.now()}`,
        };
        await addPointToDay(itinerary.id, dayIndex, pointWithId);
        const updatedDays = [...days];
        updatedDays[dayIndex].points = [
          ...(updatedDays[dayIndex].points || []),
          pointWithId,
        ];
        setDays(updatedDays);
      }
      setEditingPoint(null);
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בשמירת הנקודה");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePoint = async (dayIndex: number, pointIndex: number) => {
    if (!confirm("למחוק את הנקודה הזו?")) return;
    try {
      setSaving(true);
      setError(null);
      await deletePointFromDay(itinerary.id, dayIndex, pointIndex);
      const updatedDays = [...days];
      updatedDays[dayIndex].points = updatedDays[dayIndex].points.filter(
        (_, index) => index !== pointIndex,
      );
      setDays(updatedDays);
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה במחיקת הנקודה");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateItineraryDays(itinerary.id, days);
      if (onSave) {
        onSave();
      }
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בשמירת המסלול");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">ימים במסלול</h2>
        <button
          type="button"
          onClick={handleAddDay}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          הוסף יום
        </button>
      </div>

      {days.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-slate-500">אין ימים במסלול. הוסף יום ראשון!</p>
        </div>
      )}

      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            {editingDayIndex === dayIndex ? (
              <DayEditor
                day={day}
                onSave={(updatedDay) => handleSaveDay(dayIndex, updatedDay)}
                onCancel={() => setEditingDayIndex(null)}
                saving={saving}
              />
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{day.title}</h3>
                    {day.dateLabel && (
                      <p className="text-sm text-slate-500">{day.dateLabel}</p>
                    )}
                    {day.area && (
                      <p className="text-sm text-slate-500">אזור: {day.area}</p>
                    )}
                    {day.summary && (
                      <p className="mt-2 text-sm text-slate-600">{day.summary}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-500">
                      {day.points?.length || 0} נקודות
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDayIndex(dayIndex)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600"
                    >
                      ערוך
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDay(dayIndex)}
                      className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600"
                    >
                      מחק
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">נקודות עניין</h4>
                    <button
                      type="button"
                      onClick={() => handleAddPoint(dayIndex)}
                      className="text-sm text-indigo-600"
                    >
                      הוסף נקודה
                    </button>
                  </div>

                  {editingPoint?.dayIndex === dayIndex ? (
                    <PointEditor
                      point={
                        editingPoint.pointIndex >= 0
                          ? day.points[editingPoint.pointIndex]
                          : undefined
                      }
                      onSave={(point) =>
                        handleSavePoint(
                          dayIndex,
                          editingPoint.pointIndex,
                          point,
                        )
                      }
                      onCancel={() => setEditingPoint(null)}
                      saving={saving}
                    />
                  ) : (
                    <div className="space-y-2">
                      {day.points?.map((point, pointIndex) => (
                        <div
                          key={point.id || pointIndex}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium">{point.name}</h5>
                            {point.description && (
                              <p className="text-sm text-slate-500">
                                {point.description}
                              </p>
                            )}
                            {point.googleMapsUrl && (
                              <a
                                href={point.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600"
                              >
                                פתח ב-Google Maps
                              </a>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingPoint({
                                  dayIndex,
                                  pointIndex,
                                })
                              }
                              className="text-sm text-slate-600"
                            >
                              ערוך
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeletePoint(dayIndex, pointIndex)
                              }
                              className="text-sm text-red-600"
                            >
                              מחק
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!day.points || day.points.length === 0) && (
                        <p className="text-sm text-slate-400">
                          אין נקודות ביום זה
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="rounded-full bg-indigo-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "שומר..." : "שמור מסלול"}
        </button>
      </div>
    </div>
  );
};

