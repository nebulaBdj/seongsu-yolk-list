import data from "@/data/places.json";

export type Category = { id: string; en: string; title: string; ko: string };

export type Checks = {
  englishMenu: boolean | null;
  foreignCards: boolean | null;
  soloOk: boolean | null;
  waitlistApp: boolean | null;
};

export type Place = {
  slug: string;
  category: string;
  nameEn: string;
  nameKo: string;
  order: { en: string; ko: string }[];
  oneLiner: { en: string; ko: string };
  address: string;
  floor: string;
  lat: number;
  lng: number;
  checks: Checks;
  mapsQuery?: string;
};

export type Landmark = {
  id: string;
  en: string;
  kind: "station" | "popup";
  line?: string;
  lat: number;
  lng: number;
};

export const categories: Category[] = data.categories;
export const places: Place[] = data.places as Place[];
export const landmarks: Landmark[] = data.landmarks as Landmark[];

export function getPlace(slug: string): Place | undefined {
  return places.find((place) => place.slug === slug);
}

export function getCategory(id: string): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`없는 카테고리: ${id}`);
  return category;
}

// 배열 순서가 No. (1부터, 두 자리)
export function placeNo(place: Place): string {
  return `No.${String(places.indexOf(place) + 1).padStart(2, "0")}`;
}

// 택시 기사님께 보여줄 전체 주소
export function taxiAddress(place: Place): string {
  return `서울 성동구 ${place.address} ${place.floor}`;
}
