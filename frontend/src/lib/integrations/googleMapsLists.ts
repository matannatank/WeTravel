// Google Maps Lists Import
// Note: Google Maps doesn't have a public API for accessing saved lists
// This is a placeholder for future implementation
// Users would need to export their list and import it manually

export interface GoogleMapsListPoint {
  name: string;
  address?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface GoogleMapsList {
  name: string;
  points: GoogleMapsListPoint[];
}

// Parse a CSV or JSON export from Google Maps
export const parseGoogleMapsExport = async (
  file: File,
): Promise<GoogleMapsList> => {
  const text = await file.text();

  // Try to parse as JSON first
  try {
    const json = JSON.parse(text);
    // Handle different Google Maps export formats
    if (Array.isArray(json)) {
      return {
        name: "רשימה מיובאת",
        points: json.map((item: any) => ({
          name: item.name || item.title || "",
          address: item.address || item.formatted_address,
          placeId: item.place_id || item.placeId,
          lat: item.lat || item.latitude || item.location?.lat,
          lng: item.lng || item.longitude || item.location?.lng,
          notes: item.notes || item.description,
        })),
      };
    }
  } catch {
    // Not JSON, try CSV
  }

  // Try CSV parsing
  const lines = text.split("\n");
  const headers = lines[0]?.split(",") || [];
  const points: GoogleMapsListPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length > 0 && values[0].trim()) {
      const point: GoogleMapsListPoint = {
        name: values[0]?.trim() || "",
      };

      // Try to find address, placeId, etc. in columns
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes("address") || lowerHeader.includes("כתובת")) {
          point.address = value;
        } else if (lowerHeader.includes("place") && lowerHeader.includes("id")) {
          point.placeId = value;
        } else if (lowerHeader.includes("lat") || lowerHeader.includes("latitude")) {
          point.lat = parseFloat(value);
        } else if (lowerHeader.includes("lng") || lowerHeader.includes("longitude")) {
          point.lng = parseFloat(value);
        } else if (lowerHeader.includes("note") || lowerHeader.includes("הערה")) {
          point.notes = value;
        }
      });

      points.push(point);
    }
  }

  return {
    name: "רשימה מיובאת",
    points,
  };
};

// Alternative: Parse from a shared Google Maps list URL
// This would require scraping or using an unofficial API
export const parseGoogleMapsListUrl = async (
  url: string,
): Promise<GoogleMapsList> => {
  // Placeholder - Google Maps doesn't provide a public API for this
  // In a real implementation, you might:
  // 1. Ask users to export their list as CSV/JSON
  // 2. Use a browser extension to extract the data
  // 3. Use Google My Maps API if it's a My Maps list
  
  throw new Error(
    "ייבוא מרשימת Google Maps דורש ייצוא ידני. אנא ייצא את הרשימה שלך כקובץ CSV או JSON.",
  );
};



