"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { useEventOver } from "@/lib/use-event";
import { MAP_SIZE, type Point } from "@/lib/geo";
import { Badge, Chip } from "./receipt/Badge";
import { TrackedLink } from "./TrackedLink";
import styles from "./map.module.css";

export type MapPin = {
  slug: string;
  no: string;
  nameEn: string;
  nameKo: string;
  categoryEn: string;
  mapsUrl: string;
  pin: Point;
};

const toPercent = (p: Point) => ({ left: `${(p.x / MAP_SIZE.width) * 100}%`, top: `${(p.y / MAP_SIZE.height) * 100}%` });

// 핀 선택 + 아래 카드 (SPEC §3-4). 핀은 상세 링크라 검색엔진이 따라가고, 누르면 선택만 한다
export function FoodMap({ pins, popup, map }: { pins: MapPin[]; popup: Point; map: React.ReactNode }) {
  const [selected, setSelected] = useState(pins[0].slug);
  const eventOver = useEventOver();
  const current = pins.find((p) => p.slug === selected) ?? pins[0];

  return (
    <>
      <div className={styles.map}>
        {map}
        {!eventOver && (
          <div className={styles.popup} style={toPercent(popup)}>
            <span className={styles.popupSquare} />
            <span className={styles.popupLabel}>OUR POP-UP</span>
          </div>
        )}
        {pins.map((p) => (
          <Link
            key={p.slug}
            href={`/places/${p.slug}`}
            aria-label={`${p.no} ${p.nameEn}`}
            aria-current={p.slug === selected ? "true" : undefined}
            className={styles.pin}
            style={toPercent(p.pin)}
            onClick={(event) => {
              event.preventDefault();
              setSelected(p.slug);
              track("pin_select", { place_slug: p.slug });
            }}
          >
            <span>{p.no.slice(3)}</span>
          </Link>
        ))}
      </div>

      <div className={styles.card} aria-live="polite">
        <div className={styles.cardText}>
          <div className={styles.cardMeta}>
            <span>{current.no}</span>
            <Chip>{current.categoryEn}</Chip>
            <Badge />
          </div>
          <div className={styles.cardName}>{current.nameEn}</div>
          <div className={styles.cardKo}>{current.nameKo}</div>
        </div>
        <div className={styles.cardActions}>
          <Link href={`/places/${current.slug}`} className={styles.open}>
            OPEN →
          </Link>
          <TrackedLink
            href={current.mapsUrl}
            event="maps_click"
            params={{ place_slug: current.slug, from: "map" }}
            className={styles.maps}
          >
            MAPS ↗
          </TrackedLink>
        </div>
      </div>
    </>
  );
}
