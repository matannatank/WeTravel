import type { DaySegment, PointOfInterest } from "@/types";

export interface GeminiSuggestionInput {
  transcript: string;
  targetAudience?: string;
  tripLength?: number;
}

export interface GeminiSuggestion {
  summary: string;
  points: PointOfInterest[];
  days: DaySegment[];
}

export const generateSuggestion = async (
  payload: GeminiSuggestionInput,
): Promise<GeminiSuggestion> => {
  try {
    const response = await fetch("/api/gemini/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate itinerary");
    }

    const data = await response.json();
    
    // Map the response to our types
    const points: PointOfInterest[] = (data.points || []).map((p: any, index: number) => ({
      id: `point-${index}-${Date.now()}`,
      name: p.name || "",
      description: p.description,
      googleMapsUrl: p.googleMapsUrl || "",
      placeId: p.placeId,
      latitude: p.lat,
      longitude: p.lng,
      area: p.area,
    }));

    const days: DaySegment[] = (data.days || []).map((d: any) => ({
      title: d.title || "יום",
      dateLabel: d.dateLabel,
      area: d.area,
      summary: d.summary,
      tips: d.tips || [],
      points: (d.points || []).map((pointName: string) => {
        const point = points.find((p) => p.name === pointName);
        return point || {
          id: `point-${Date.now()}`,
          name: pointName,
          googleMapsUrl: "",
        };
      }),
    }));

    return {
      summary: data.summary || "",
      points,
      days,
    };
  } catch (error: any) {
    console.error("Error generating suggestion:", error);
    throw new Error(
      error.message || "אירעה שגיאה ביצירת המסלול. נסה שוב מאוחר יותר.",
    );
  }
};

