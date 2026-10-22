import type { Metadata } from "next";
import { EventFooter } from "@/components/EventFooter";
import { Header, ViewToggle } from "@/components/Header";
import { PickBrowser } from "@/components/PickBrowser";
import { PlaceCard } from "@/components/PlaceCard";
import { TrackedLink } from "@/components/TrackedLink";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import styles from "@/components/home.module.css";
import ui from "@/components/ui.module.css";
import { DATA, SITE } from "@/config/site";
import { categories, places } from "@/lib/places";

const count = places.length;

export const metadata: Metadata = {
  title: { absolute: `Where to Eat in Seongsu: ${count} Local Restaurants | The Yolk List` },
  description: `${count} local restaurants, bars and bakeries in Seongsu, Seoul that Korean diners rate highly. Real local food, what to order at each and one-tap Google Maps directions.`,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const nameDrawLink = `${SITE.nameDrawUrl}/?utm_source=yolklist&utm_medium=banner&utm_campaign=crosslink`;

// 검색엔진용 목록 구조화 데이터 (SPEC §12-4)
const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: places.map((place, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: place.nameEn,
      url: `${SITE.url}/places/${place.slug}`,
    })),
  },
];

export default function Home() {
  return (
    <main className={ui.screen}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PickBrowser
        categories={categories}
        items={places.map((place) => ({ slug: place.slug, category: place.category, card: <PlaceCard place={place} /> }))}
        head={
          <>
            <Header />
            <WelcomeBanner />
            <h1 className={styles.title}>
              Where to eat
              <br />
              in Seongsu
            </h1>
            <p className={styles.subtitle}>
              Only the yolk: local restaurants Korean diners rate highly, and what to order at each.
            </p>
            <div>
              <p className={styles.gloss}>
                <b lang="ko">노른자</b> no-reun-ja = egg yolk, Korean slang for “the best part”.
              </p>
              <p className={styles.gloss}>
                <b lang="ko">로컬 찐 맛집</b> lo-kal jjin mat-jip = a real-deal local favorite. Every pick here is one.
              </p>
            </div>
          </>
        }
        toggle={<ViewToggle current="list" />}
        after={
          <>
            <TrackedLink href={nameDrawLink} event="namedraw_click" className={styles.nameDraw}>
              <span>
                <strong>What&apos;s your Korean name?</strong>
                <small>Print one free in 10 seconds</small>
              </span>
              <span className={styles.nameDrawArrow} aria-hidden="true">
                →
              </span>
            </TrackedLink>
            <p className={styles.footer}>
              LAST CHECKED {DATA.lastChecked} · Hours can change, so check Google Maps before you go.
            </p>
            <EventFooter className={styles.footer} />
          </>
        }
      />
    </main>
  );
}
