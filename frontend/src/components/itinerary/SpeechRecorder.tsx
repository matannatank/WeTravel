"use client";

import { useState, useRef, useEffect } from "react";
import { startSpeechRecognition } from "@/lib/integrations/speechToText";

interface Props {
  onTranscript: (transcript: string) => void;
  language?: string;
}

export const SpeechRecorder = ({ onTranscript, language = "he-IL" }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleStart = () => {
    const recognition = startSpeechRecognition(
      (result) => {
        setTranscript(result.transcript);
        onTranscript(result.transcript);
      },
      (error) => {
        console.error("Speech recognition error:", error);
        alert(`שגיאה בהקלטה: ${error.message}`);
        setIsRecording(false);
      },
      language,
    );

    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={isRecording ? handleStop : handleStart}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-white ${
            isRecording
              ? "bg-red-600 hover:bg-red-500"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          <span>{isRecording ? "⏹️" : "🎤"}</span>
          <span>{isRecording ? "עצור הקלטה" : "התחל הקלטה"}</span>
        </button>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-600">
            <span className="h-3 w-3 animate-pulse rounded-full bg-red-600"></span>
            <span className="text-sm">מקליט...</span>
          </div>
        )}
      </div>

      {transcript && (
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">תמלול:</p>
          <p className="mt-2 text-slate-900">{transcript}</p>
        </div>
      )}

      {!isRecording && transcript && (
        <button
          type="button"
          onClick={() => {
            setTranscript("");
            onTranscript("");
          }}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          נקה תמלול
        </button>
      )}
    </div>
  );
};

