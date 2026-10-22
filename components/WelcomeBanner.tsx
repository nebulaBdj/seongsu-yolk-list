"use client";

import { useSyncExternalStore } from "react";
import { readSource, rememberSource } from "@/lib/storage";
import { useEventOver } from "@/lib/use-event";
import styles from "./home.module.css";

const subscribe = () => () => {};

function cameFromNewspaper(): boolean {
  rememberSource(window.location.search);
  return readSource() === "newspaper";
}

// 신문 사진 QR로 들어온 경우만 보이는 노른자 배너. 정적 HTML에는 없다
export function WelcomeBanner() {
  const over = useEventOver();
  const fromNewspaper = useSyncExternalStore(subscribe, cameFromNewspaper, () => false);

  if (over || !fromNewspaper) return null;
  return (
    <div className={styles.welcome}>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <rect x="2" y="3" width="14" height="12" rx="1.5" fill="none" stroke="#0E0E12" strokeWidth="1.6" />
        <path
          d="M5 6.5h8M5 9h3.5M5 11.5h3.5M10.5 9h2.5v2.5h-2.5z"
          fill="none"
          stroke="#0E0E12"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Got your newspaper photo? Here&apos;s where to eat next in Seongsu.</span>
    </div>
  );
}
