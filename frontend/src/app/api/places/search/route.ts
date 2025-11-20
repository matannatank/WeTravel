import { NextRequest, NextResponse } from "next/server";
import { rateLimit, corsHeaders } from "@/lib/api/middleware";
import { getGoogleMapsApiKey } from "@/lib/integrations/env";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Simple cache (in-memory, for production use Redis)
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const apiKey = getGoogleMapsApiKey();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400, headers: corsHeaders },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500, headers: corsHeaders },
    );
  }

  // Check cache
  const cacheKey = `places:${query}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expires) {
    return NextResponse.json({ places: cached.data }, { headers: corsHeaders });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}&language=he`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || "API error" },
        { status: 500, headers: corsHeaders },
      );
    }

    const places = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      photo: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : undefined,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
    }));

    // Cache the result
    cache.set(cacheKey, {
      data: places,
      expires: Date.now() + CACHE_TTL,
    });

    // Clean up old cache entries
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now > value.expires) {
          cache.delete(key);
        }
      }
    }

    return NextResponse.json({ places }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching places:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

