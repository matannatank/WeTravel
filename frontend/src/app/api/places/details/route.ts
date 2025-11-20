import { NextRequest, NextResponse } from "next/server";
import { rateLimit, corsHeaders } from "@/lib/api/middleware";
import { getGoogleMapsApiKey } from "@/lib/integrations/env";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Simple cache (in-memory, for production use Redis)
const detailsCache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes (place details don't change often)

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");
  const apiKey = getGoogleMapsApiKey();

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId parameter is required" },
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
  const cacheKey = `place:${placeId}`;
  const cached = detailsCache.get(cacheKey);
  if (cached && Date.now() < cached.expires) {
    return NextResponse.json({ place: cached.data }, { headers: corsHeaders });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=he&fields=place_id,name,formatted_address,geometry,photos,url`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || "API error" },
        { status: 500, headers: corsHeaders },
      );
    }

    const place = data.result;
    const result = {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      url: place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      photo: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
        : undefined,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
    };

    // Cache the result
    detailsCache.set(cacheKey, {
      data: result,
      expires: Date.now() + CACHE_TTL,
    });

    // Clean up old cache entries
    if (detailsCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of detailsCache.entries()) {
        if (now > value.expires) {
          detailsCache.delete(key);
        }
      }
    }

    return NextResponse.json({ place: result }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching place details:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

