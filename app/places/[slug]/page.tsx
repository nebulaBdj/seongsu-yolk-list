import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { YolkLogo } from "@/components/Header";
import { SayIt } from "@/components/SayIt";
import { TrackedLink } from "@/components/TrackedLink";
import styles from "@/components/detail.module.css";
import ui from "@/components/ui.module.css";
import { Badge } from "@/components/receipt/Badge";
import { Barcode } from "@/components/receipt/Barcode";
import { Dash } from "@/components/receipt/Dash";
import { Leader } from "@/components/receipt/Leader";
import { Slot } from "@/components/receipt/Slot";
import { Zigzag } from "@/components/receipt/Zigzag";
import { DATA, PHRASES, SITE } from "@/config/site";
import { googleMapsUrl } from "@/lib/maps";
import { getCategory, getPlace, placeNo, places, taxiAddress, type Checks, type Place } from "@/lib/places";

export const dynamicParams = false;

export function generateStaticParams() {
  return places.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = getPlace((await params).slug);
  if (!place) return {};
  const title = `${place.nameEn} (${place.nameKo}) — ${getCategory(place.category).title} in Seongsu`;
  const description = `${place.oneLiner.en}. What to order, how to say it in Korean and the address to show your taxi driver.`;
  const url = `/places/${place.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

const CHECK_LABELS: [keyof Checks, string][] = [
  ["englishMenu", "English menu"],
  ["foreignCards", "Foreign cards"],
  ["soloOk", "Solo OK"],
  ["waitlistApp", "Waitlist app"],
];

// 같은 카테고리의 다른 가게 (최대 2곳)
function samePicks(place: Place): Place[] {
  return places.filter((p) => p.category === place.category && p.slug !== place.slug).slice(0, 2);
}

function breadcrumbJsonLd(place: Place) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: place.nameEn, item: `${SITE.url}/places/${place.slug}` },
    ],
  };
}

export default async function PlacePage({ params }: Props) {
  const place = getPlace((await params).slug);
  if (!place) notFound();

  const category = getCategory(place.category);
  const checks = CHECK_LABELS.filter(([key]) => place.checks[key] !== null);
  const phrases = PHRASES[place.category] ?? PHRASES.default;
  const more = samePicks(place);

  return (
    <main className={ui.screen}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(place)) }} />
      <div className={styles.topBar}>
        <Link href="/" className={styles.back}>
          ← ALL PICKS
        </Link>
        <div className={styles.topNo}>
          <YolkLogo size={22} />
          {placeNo(place)}
        </div>
      </div>

      <div className={styles.stage}>
        <Slot />
        <div className={styles.paper}>
          <div className={styles.body}>
            <div className={styles.slipTitle}>THE YOLK LIST · ORDER SLIP · 주문서</div>
            <h1 className={styles.name}>{place.nameEn}</h1>
            <div className={styles.nameKo}>{place.nameKo}</div>
            <div className={styles.metaRow}>
              <span>{category.en}</span>
              <Badge>로컬 찐 맛집 · LOCALS&apos; PICK</Badge>
            </div>

            <Dash />
            <div className={styles.label}>WHAT TO ORDER · 추천 메뉴</div>
            {place.order.map((item) => (
              <Leader key={item.en} label={`1 × ${item.en}`} value={item.ko} />
            ))}

            <Dash />
            <div className={styles.label}>WHY IT&apos;S A PICK · 한 줄 평</div>
            <div>{place.oneLiner.en}</div>

            {checks.length > 0 && (
              <>
                <Dash />
                <div className={styles.label}>FOREIGNER CHECK · 외국인 체크</div>
                <div className={styles.checks}>
                  {checks.map(([key, label]) => (
                    <div key={key} className={styles.check}>
                      <span>{label}</span>
                      <b>{place.checks[key] ? "YES" : "NO"}</b>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Dash />
            <div className={styles.label}>SAY IT IN KOREAN · 한국어 한마디</div>
            {phrases.map((phrase) => (
              <div key={phrase.ko} className={styles.phrase}>
                <div className={styles.phraseText}>
                  <span className={styles.phraseKo} lang="ko">
                    {phrase.ko}
                  </span>
                  <span className={styles.phraseSub}>
                    {phrase.roman} · {phrase.en}
                  </span>
                </div>
                <SayIt text={phrase.ko} placeSlug={place.slug} />
              </div>
            ))}

            <Dash />
            <div className={styles.label}>SHOW YOUR TAXI DRIVER · 기사님께 보여주세요</div>
            <div className={styles.taxi} lang="ko">
              <div className={styles.taxiName}>{place.nameKo}</div>
              <div className={styles.taxiAddress}>{taxiAddress(place)}</div>
            </div>
            <TrackedLink
              href={googleMapsUrl(place)}
              event="maps_click"
              params={{ place_slug: place.slug, from: "detail" }}
              className={ui.mapsButtonFull}
            >
              GOOGLE MAPS ↗
            </TrackedLink>

            <Dash />
            <Barcode height={34} />
            <div className={styles.checked}>LAST CHECKED {DATA.lastChecked}</div>
            <div className={styles.thanks}>감사합니다! Enjoy your meal!</div>
          </div>
          <Zigzag tooth={11} />
        </div>

        {more.length > 0 && (
          <section className={styles.more}>
            <h2 className={styles.moreTitle}>More {category.title} picks</h2>
            {more.map((p) => (
              <Link key={p.slug} href={`/places/${p.slug}`} className={styles.moreLink}>
                <span>
                  {p.nameEn}
                  <small>{p.nameKo}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </section>
        )}
        <Link href="/" className={styles.backLink} style={{ alignSelf: "flex-start" }}>
          ← Back to all picks
        </Link>
      </div>
    </main>
  );
}
