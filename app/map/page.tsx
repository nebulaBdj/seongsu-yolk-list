import type { Metadata } from "next";
import { FoodMap, type MapPin } from "@/components/FoodMap";
import { Header, ViewToggle } from "@/components/Header";
import { SeoulMap } from "@/components/SeoulMap";
import styles from "@/components/map.module.css";
import ui from "@/components/ui.module.css";
import { project, spreadPins } from "@/lib/geo";
import { googleMapsUrl } from "@/lib/maps";
import { getCategory, landmarks, placeNo, places } from "@/lib/places";

export const metadata: Metadata = {
  title: { absolute: `Seongsu Food Map: ${places.length} Local Picks | The Yolk List` },
  description: `All ${places.length} local picks on one map of Seongsu, from Seoul Forest to Seongsu Station.`,
  alternates: { canonical: "/map" },
  openGraph: { url: "/map" },
};

// 빌드 때 한 번: 실제 위치 → 겹치지 않게 민 핀 위치
const actual = places.map((place) => project(place.lat, place.lng));
const spread = spreadPins(actual);

const pins: MapPin[] = places.map((place, i) => ({
  slug: place.slug,
  no: placeNo(place),
  nameEn: place.nameEn,
  nameKo: place.nameKo,
  categoryEn: getCategory(place.category).en,
  mapsUrl: googleMapsUrl(place),
  pin: spread[i],
}));

const leaders = actual
  .map((from, i) => ({ from, to: spread[i] }))
  .filter(({ from, to }) => Math.hypot(from.x - to.x, from.y - to.y) > 1);

const popupLandmark = landmarks.find((l) => l.kind === "popup");
const popup = popupLandmark ? project(popupLandmark.lat, popupLandmark.lng) : { x: 0, y: 0 };

export default function MapPage() {
  return (
    <main className={ui.screen}>
      <div className={ui.top}>
        <Header />
        <ViewToggle current="map" />
        <h1 className={styles.title}>Seongsu food map</h1>
      </div>
      <FoodMap pins={pins} popup={popup} map={<SeoulMap leaders={leaders} />} />
      <p className={styles.note}>Map not to scale. Use Google Maps for directions.</p>
    </main>
  );
}
