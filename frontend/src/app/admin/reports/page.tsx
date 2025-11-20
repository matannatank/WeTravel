"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import {
  subscribeToReports,
  updateReportStatus,
  deleteReport,
} from "@/lib/reports";
import { getItinerary, deleteItinerary } from "@/lib/itineraries";
import type { Report } from "@/lib/reports";
import type { Itinerary } from "@/types";

export default function AdminReportsPage() {
  const { user } = useAuthContext();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "reviewing" | "closed">("open");
  const [processing, setProcessing] = useState<string | null>(null);

  // Check if user is admin (in real app, check from Firestore)
  const isAdmin = user?.email?.endsWith("@admin.com") || user?.uid === "admin"; // Placeholder

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    const unsubscribe = subscribeToReports(
      (items) => {
        setReports(items);
        setLoading(false);
      },
      statusFilter === "all" ? undefined : statusFilter,
    );

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [isAdmin, statusFilter]);

  const handleUpdateStatus = async (
    reportId: string,
    status: "open" | "reviewing" | "closed",
  ) => {
    if (!user) return;

    try {
      setProcessing(reportId);
      await updateReportStatus(reportId, status, user.uid);
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה בעדכון הסטטוס");
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (!confirm("להסיר את המסלול לצמיתות? פעולה זו לא ניתנת לביטול.")) {
      return;
    }

    try {
      setProcessing(itineraryId);
      await deleteItinerary(itineraryId);
      alert("המסלול הוסר בהצלחה");
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה בהסרת המסלול");
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("למחוק את הדיווח?")) return;

    try {
      setProcessing(reportId);
      await deleteReport(reportId);
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה במחיקת הדיווח");
    } finally {
      setProcessing(null);
    }
  };

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p>יש להתחבר כדי לגשת לממשק הניהול</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-red-500">אין לך הרשאות גישה לממשק זה</p>
      </div>
    );
  }

  const filteredReports = statusFilter === "all"
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">ניהול דיווחים</h1>
        <p className="mt-2 text-sm text-slate-500">
          סך הכל: {reports.length} דיווחים
        </p>
      </header>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex gap-2">
          {(["all", "open", "reviewing", "closed"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-sm ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 text-slate-600"
              }`}
            >
              {status === "all"
                ? "הכל"
                : status === "open"
                  ? "פתוחים"
                  : status === "reviewing"
                    ? "בבדיקה"
                    : "סגורים"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500">טוען דיווחים...</p>
        ) : filteredReports.length === 0 ? (
          <p className="text-slate-500">אין דיווחים</p>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                onUpdateStatus={handleUpdateStatus}
                onDeleteItinerary={handleDeleteItinerary}
                onDeleteReport={handleDeleteReport}
                processing={processing === report.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportItem({
  report,
  onUpdateStatus,
  onDeleteItinerary,
  onDeleteReport,
  processing,
}: {
  report: Report;
  onUpdateStatus: (id: string, status: "open" | "reviewing" | "closed") => void;
  onDeleteItinerary: (id: string) => void;
  onDeleteReport: (id: string) => void;
  processing: boolean;
}) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getItinerary(report.itineraryId);
        setItinerary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [report.itineraryId]);

  const statusColors = {
    open: "bg-red-100 text-red-700",
    reviewing: "bg-yellow-100 text-yellow-700",
    closed: "bg-green-100 text-green-700",
  };

  const reasonLabels = {
    offensive: "תוכן פוגעני",
    spam: "ספאם",
    copyright: "הפרת זכויות יוצרים",
    other: "אחר",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                statusColors[report.status]
              }`}
            >
              {report.status === "open"
                ? "פתוח"
                : report.status === "reviewing"
                  ? "בבדיקה"
                  : "סגור"}
            </span>
            <span className="text-sm text-slate-500">
              {reasonLabels[report.reason]}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(report.createdAt).toLocaleDateString("he-IL")}
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">טוען מסלול...</p>
          ) : itinerary ? (
            <div>
              <a
                href={`/itinerary/${itinerary.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-indigo-600 hover:underline"
              >
                {itinerary.title}
              </a>
              <p className="text-sm text-slate-500">
                {itinerary.primaryDestination}
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-500">מסלול לא נמצא (אולי נמחק)</p>
          )}

          {report.notes && (
            <p className="mt-2 text-sm text-slate-600">{report.notes}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {report.status === "open" && (
            <>
              <button
                type="button"
                onClick={() => onUpdateStatus(report.id, "reviewing")}
                disabled={processing}
                className="rounded-full border border-yellow-200 px-3 py-1 text-xs text-yellow-600 disabled:opacity-50"
              >
                העבר לבדיקה
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus(report.id, "closed")}
                disabled={processing}
                className="rounded-full border border-green-200 px-3 py-1 text-xs text-green-600 disabled:opacity-50"
              >
                סגור
              </button>
            </>
          )}
          {report.status === "reviewing" && (
            <button
              type="button"
              onClick={() => onUpdateStatus(report.id, "closed")}
              disabled={processing}
              className="rounded-full border border-green-200 px-3 py-1 text-xs text-green-600 disabled:opacity-50"
            >
              סגור
            </button>
          )}
          {itinerary && (
            <button
              type="button"
              onClick={() => onDeleteItinerary(report.itineraryId)}
              disabled={processing}
              className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 disabled:opacity-50"
            >
              הסר מסלול
            </button>
          )}
          <button
            type="button"
            onClick={() => onDeleteReport(report.id)}
            disabled={processing}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 disabled:opacity-50"
          >
            מחק דיווח
          </button>
        </div>
      </div>
    </div>
  );
}

