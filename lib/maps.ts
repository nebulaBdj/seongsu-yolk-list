import type { Place } from "./places";

// 구글 지도 검색 주소 (SPEC §5). 기본 검색어로 안 잡히는 가게만 mapsQuery를 둔다
export function googleMapsUrl(place: Place): string {
  const query = place.mapsQuery ?? `${place.nameKo} 서울 성동구 ${place.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
