"use client";

import { useState } from "react";
import { shareToWhatsApp, shareToFacebook, copyToClipboard } from "@/lib/share/utils";

interface Props {
  itineraryId: string;
  title: string;
}

export const ShareButtons = ({ itineraryId, title }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(itineraryId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("לא הצלחתי להעתיק את הקישור");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => shareToWhatsApp(itineraryId, title)}
        className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500"
      >
        <span>📱</span>
        <span>וואטסאפ</span>
      </button>
      <button
        type="button"
        onClick={() => shareToFacebook(itineraryId)}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
      >
        <span>📘</span>
        <span>פייסבוק</span>
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <span>{copied ? "✓" : "🔗"}</span>
        <span>{copied ? "הועתק!" : "העתק קישור"}</span>
      </button>
    </div>
  );
};

