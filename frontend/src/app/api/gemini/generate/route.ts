import { NextRequest, NextResponse } from "next/server";
import { rateLimit, corsHeaders } from "@/lib/api/middleware";
import { getGeminiApiKey } from "@/lib/integrations/env";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500, headers: corsHeaders },
    );
  }

  try {
    const body = await request.json();
    const { transcript, targetAudience, tripLength } = body;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (transcript.length > 10000) {
      return NextResponse.json(
        { error: "Transcript is too long. Maximum 10,000 characters." },
        { status: 400, headers: corsHeaders },
      );
    }

    // Call Gemini API with retry logic
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const prompt = `אתה עוזר ליצירת מסלולי טיול. המשתמש תיאר טיול בטקסט חופשי בעברית. 
    זהה מקומות, עסקים, מלונות, מסעדות וכו' מהתיאור.
    החזר רק JSON (ללא טקסט נוסף) עם המבנה הבא:
    {
      "summary": "סיכום קצר של המסלול",
      "points": [
        {
          "name": "שם המקום",
          "description": "תיאור קצר",
          "placeId": "place_id מ-Google Maps אם אפשר לזהות",
          "googleMapsUrl": "קישור ל-Google Maps",
          "area": "אזור/עיר"
        }
      ],
      "days": [
        {
          "title": "כותרת היום",
          "dateLabel": "תאריך או תווית",
          "area": "אזור",
          "summary": "סיכום היום",
          "tips": ["טיפ 1", "טיפ 2"],
          "points": ["שם נקודה 1", "שם נקודה 2"]
        }
      ]
    }
    
    ${targetAudience ? `קהל יעד: ${targetAudience}` : ""}
    ${tripLength ? `אורך טיול: ${tripLength} ימים` : ""}
    
    תיאור הטיול:
    ${transcript}`;

    // Retry logic for Gemini API
    let lastError: Error | null = null;
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Gemini API error (attempt ${attempt + 1}):`, errorData);
          
          if (response.status === 429 && attempt < maxRetries) {
            // Rate limited - wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
          
          return NextResponse.json(
            { error: "Failed to generate itinerary. Please try again." },
            { status: response.status >= 500 ? 503 : 500, headers: corsHeaders },
          );
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
          return NextResponse.json(
            { error: "No content generated" },
            { status: 500, headers: corsHeaders },
          );
        }

        // Try to parse JSON from the response
        try {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) ||
            generatedText.match(/```\n([\s\S]*?)\n```/) ||
            generatedText.match(/\{[\s\S]*\}/);
          
          const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : generatedText;
          const parsed = JSON.parse(jsonText);

          return NextResponse.json({
            summary: parsed.summary || "",
            points: parsed.points || [],
            days: parsed.days || [],
          }, { headers: corsHeaders });
        } catch (parseError) {
          // If JSON parsing fails, return a basic structure
          console.error("Failed to parse Gemini response:", parseError);
          return NextResponse.json({
            summary: "מסלול שנוצר מתיאור חופשי",
            points: [],
            days: [],
          }, { headers: corsHeaders });
        }
      } catch (error: any) {
        lastError = error;
        if (attempt < maxRetries && error.name !== "AbortError") {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    // All retries failed
    console.error("Gemini API failed after retries:", lastError);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503, headers: corsHeaders },
    );
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

