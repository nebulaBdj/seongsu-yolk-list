"use client";

import { track, type Events } from "@/lib/analytics";

type TrackedLinkProps<E extends keyof Events> = {
  href: string;
  event: E;
  params?: Events[E];
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

// 바깥으로 나가는 링크(구글 지도·인스타·이름 뽑기): 새 탭으로 열고 GA 이벤트를 남긴다
export function TrackedLink<E extends keyof Events>({ href, event, params, className, children, ...rest }: TrackedLinkProps<E>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      aria-label={rest["aria-label"]}
      onClick={() => (track as (e: E, p?: Events[E]) => void)(event, params)}
    >
      {children}
    </a>
  );
}
