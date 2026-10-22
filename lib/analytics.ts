// GA4 이벤트 (SPEC §9). GA_ID가 없거나 차단되면 조용히 아무것도 하지 않는다
export type Events = {
  maps_click: { place_slug: string; from: "card" | "detail" | "map" };
  category_select: { category: string };
  show_more: undefined;
  pin_select: { place_slug: string };
  pronounce_click: { place_slug: string; phrase: string };
  namedraw_click: undefined;
  instagram_click: undefined;
  popup_map_click: undefined;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track<E extends keyof Events>(event: E, ...[params]: Events[E] extends undefined ? [] : [Events[E]]): void {
  try {
    window.gtag?.("event", event, params ?? {});
  } catch {
    // 분석 실패는 화면에 영향을 주지 않는다
  }
}
