import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/api/middleware";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // Speech-to-Text is implemented client-side using Web Speech API
  // This endpoint is kept for future server-side implementation if needed
  // (e.g., using Google Cloud Speech-to-Text for better accuracy)
  
  return NextResponse.json(
    {
      error: "Speech-to-Text is implemented client-side",
      message: "This application uses the Web Speech API in the browser. No server-side transcription is needed.",
      clientImplementation: "Use navigator.mediaDevices.getUserMedia() and Web Speech API",
    },
    { status: 200, headers: corsHeaders },
  );
}

