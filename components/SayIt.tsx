"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { hasKoreanVoice, speakKorean } from "@/lib/speech";
import styles from "./detail.module.css";

// 한국어 한마디 ▶. 한국어 음성이 없으면 ▶만 숨긴다
export function SayIt({ text, placeSlug }: { text: string; placeSlug: string }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const update = () => setAvailable(hasKoreanVoice());
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      className={styles.play}
      aria-label={`Play ${text}`}
      onClick={() => {
        speakKorean(text);
        track("pronounce_click", { place_slug: placeSlug, phrase: text });
      }}
    >
      <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2.5 1.2l6 3.8-6 3.8z" fill="#FFFFFF" />
      </svg>
    </button>
  );
}
