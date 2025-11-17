import "server-only";
import { googleMapsApiKey } from "./env";

export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  url: string;
  photo?: string;
  lat?: number;
  lng?: number;
}

export const searchPlaces = async (
  query: string,
): Promise<PlaceSuggestion[]> => {
  if (!googleMapsApiKey()) {
    console.warn("GOOGLE_MAPS_API_KEY חסר. מוחזרת רשימה ריקה.");
    return [];
  }

  // TODO: Hook into Places API HTTP endpoint.
  void query;
  return [];
};

export const validatePlaceIds = async (
  placeIds: string[],
): Promise<Record<string, PlaceSuggestion | null>> => {
  if (!googleMapsApiKey()) {
    throw new Error("GOOGLE_MAPS_API_KEY נדרש לאימות נקודות interest.");
  }

  // Placeholder mapping until API call is available.
  return placeIds.reduce<Record<string, PlaceSuggestion | null>>((acc, id) => {
    acc[id] = null;
    return acc;
  }, {});
};

