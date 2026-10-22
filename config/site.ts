// 바뀌는 값은 여기서만 고친다 (SPEC §7)
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seongsu-local-eats.vercel.app", // canonical·sitemap 기준 주소
  name: "The Yolk List",
  brand: "Seoul Yolk",
  instagram: "https://instagram.com/seoul.yolk",
  instagramHandle: "@seoul.yolk",
  nameDrawUrl: "https://korean-name-draw.vercel.app", // TODO: 이름 뽑기 사이트 최종 주소
};

export const EVENT = {
  active: true, // 팝업이 끝나면 false로 바꿔 재배포 (§3-5)
  dates: "Oct 23–24",
  hours: "12:00–19:00",
  place: "The Gabae Seongsu (더가배성수)",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=%EC%84%9C%EC%9A%B8%20%EC%84%B1%EB%8F%99%EA%B5%AC%20%EC%97%B0%EB%AC%B4%EC%9E%A513%EA%B8%B8%2011", // 서울 성동구 연무장13길 11
  endsAt: "2026-10-24T19:00:00+09:00",
};

export const DATA = {
  lastChecked: "2026-10-21", // 팀이 가게 정보를 다시 확인하면 바꾼다
};

export type Phrase = { ko: string; roman: string; en: string };

// 상세의 한국어 한마디: 카테고리별, 없으면 default
export const PHRASES: Record<string, Phrase[]> = {
  default: [
    { ko: "두 명이요", roman: "du myeong-i-yo", en: "Table for two" },
    { ko: "이거 주세요", roman: "i-geo ju-se-yo", en: "This one, please" },
  ],
  bakery: [
    { ko: "이거 주세요", roman: "i-geo ju-se-yo", en: "This one, please" },
    { ko: "포장해 주세요", roman: "po-jang-hae ju-se-yo", en: "To go, please" },
  ],
};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // 없으면 분석 코드는 조용히 꺼진다
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION; // Search Console HTML 태그 토큰
