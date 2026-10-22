"use client";

import { useSyncExternalStore } from "react";
import { EVENT } from "@/config/site";
import { isEventOver } from "./event";

const subscribe = () => () => {};

// 정적 HTML은 EVENT.active 기준, 화면에서는 endsAt으로 한 번 더 막는다 (SPEC §3-5)
export function useEventOver(): boolean {
  return useSyncExternalStore(subscribe, () => isEventOver(), () => !EVENT.active);
}
