export interface SpeechToTextResult {
  transcript: string;
  language: string;
  confidence?: number;
}

// Client-side implementation using Web Speech API
export const startSpeechRecognition = (
  onResult: (result: SpeechToTextResult) => void,
  onError: (error: Error) => void,
  language = "he-IL",
): SpeechRecognition | null => {
  if (typeof window === "undefined") {
    onError(new Error("Speech recognition is only available in the browser"));
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError(
      new Error(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge.",
      ),
    );
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language;
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalTranscript = "";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }

    onResult({
      transcript: finalTranscript + interimTranscript,
      language,
      confidence: 0.8, // Web Speech API doesn't provide confidence
    });
  };

  recognition.onerror = (event: any) => {
    onError(new Error(`Speech recognition error: ${event.error}`));
  };

  recognition.onend = () => {
    if (finalTranscript.trim()) {
      onResult({
        transcript: finalTranscript.trim(),
        language,
      });
    }
  };

  return recognition;
};

// For server-side (if needed in the future with Google Cloud Speech-to-Text)
export const transcribeAudio = async (
  audioBuffer: ArrayBuffer,
  language = "he-IL",
): Promise<SpeechToTextResult> => {
  // This would use Google Cloud Speech-to-Text API
  // For MVP, we use client-side Web Speech API instead
  throw new Error(
    "Server-side transcription not implemented. Use startSpeechRecognition() on the client.",
  );
};

