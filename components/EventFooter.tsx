"use client";

import { EVENT, SITE } from "@/config/site";
import { useEventOver } from "@/lib/use-event";
import { TrackedLink } from "./TrackedLink";

// 하단 팝업 안내 줄. 팝업이 끝나면 인스타 안내로 바뀐다 (SPEC §3-5)
export function EventFooter({ className }: { className?: string }) {
  const over = useEventOver();
  if (over) {
    return (
      <p className={className}>
        Follow{" "}
        <TrackedLink href={SITE.instagram} event="instagram_click">
          {SITE.instagramHandle}
        </TrackedLink>{" "}
        for our next pop-up
      </p>
    );
  }
  return (
    <p className={className}>
      <TrackedLink href={EVENT.mapUrl} event="popup_map_click">
        Visit our AI newspaper photo booth · {EVENT.place} · {EVENT.dates} · {EVENT.hours} ↗
      </TrackedLink>
    </p>
  );
}
