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
  try {
    const response = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error("Failed to search places:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
};

export const getPlaceDetails = async (
  placeId: string,
): Promise<PlaceSuggestion | null> => {
  try {
    const response = await fetch(`/api/places/details?placeId=${encodeURIComponent(placeId)}`);
    if (!response.ok) {
      console.error("Failed to get place details:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data.place || null;
  } catch (error) {
    console.error("Error getting place details:", error);
    return null;
  }
};

export const validatePlaceIds = async (
  placeIds: string[],
): Promise<Record<string, PlaceSuggestion | null>> => {
  const results: Record<string, PlaceSuggestion | null> = {};
  
  await Promise.all(
    placeIds.map(async (id) => {
      const place = await getPlaceDetails(id);
      results[id] = place;
    }),
  );

  return results;
};

