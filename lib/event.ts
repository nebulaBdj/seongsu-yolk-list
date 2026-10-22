import { EVENT } from "@/config/site";

// 팝업이 끝났는지: config를 끄거나 endsAt이 지나면 끝 (SPEC §3-5)
export function isEventOver(now = Date.now()): boolean {
  return !EVENT.active || now >= new Date(EVENT.endsAt).getTime();
}
