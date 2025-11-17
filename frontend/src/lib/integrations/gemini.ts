import "server-only";
import type { DaySegment, PointOfInterest } from "@/types";
import { geminiApiKey } from "./env";

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
  if (!geminiApiKey()) {
    throw new Error(
      "אין מפתח GEMINI_API_KEY. יש לעדכן את קובץ ה-env לפני יצירת מסלול AI.",
    );
  }

  // Placeholder implementation until the actual Gemini client is wired.
  return {
    summary: `טיול מתומצת עבור ${payload.tripLength ?? 3} ימים.`,
    points: [],
    days: [],
  };
};

