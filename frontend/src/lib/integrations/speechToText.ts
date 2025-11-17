import "server-only";
import { speechToTextApiKey } from "./env";

export interface SpeechToTextResult {
  transcript: string;
  language: string;
  confidence?: number;
}

export const transcribeAudio = async (
  audioBuffer: ArrayBuffer,
  language = "he-IL",
): Promise<SpeechToTextResult> => {
  if (!speechToTextApiKey()) {
    throw new Error("SPEECH_TO_TEXT_API_KEY חסר. יש להגדיר מפתח פעיל.");
  }

  // Placeholder: integrate Google Cloud Speech-to-Text or Whisper API.
  console.info(
    "[speech] received audio buffer length",
    audioBuffer.byteLength,
  );

  return {
    transcript: "",
    language,
  };
};

