import Link from "next/link";
import { googleMapsUrl } from "@/lib/maps";
import { getCategory, placeNo, type Place } from "@/lib/places";
import { Badge, Chip } from "./receipt/Badge";
import { Dash } from "./receipt/Dash";
import { Leader } from "./receipt/Leader";
import { Zigzag } from "./receipt/Zigzag";
import { TrackedLink } from "./TrackedLink";
import styles from "./ui.module.css";

// 홈 가게 카드 (SPEC §3-2). 카드 전체가 상세 링크, 지도 버튼만 그 위로 올린다 (링크 안에 링크 없음)
export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.cardMeta}>
            <span className={styles.no}>{placeNo(place)}</span>
            <Chip>{getCategory(place.category).en}</Chip>
          </span>
          <Badge />
        </div>
        <h2 className={styles.cardName}>
          <Link href={`/places/${place.slug}`} className={styles.cardLink}>
            {place.nameEn}
          </Link>
        </h2>
        <div className={styles.sub}>{place.nameKo}</div>
        <Dash />
        <Leader label="ORDER" value={place.order[0].en} />
        <p className={styles.oneLiner}>{place.oneLiner.en}</p>
        <TrackedLink
          href={googleMapsUrl(place)}
          event="maps_click"
          params={{ place_slug: place.slug, from: "card" }}
          className={styles.mapsButton}
        >
          GOOGLE MAPS ↗
        </TrackedLink>
      </div>
      <Zigzag />
    </article>
  );
}
