"use client";

import { useEffect } from "react";
import { rememberSource } from "@/lib/storage";

// 첫 진입의 utm_source를 기억한다 (화면에는 아무것도 그리지 않는다)
export function SourceMemory() {
  useEffect(() => rememberSource(window.location.search), []);
  return null;
}
