import { PlaceCard } from "@/components/PlaceCard";
import { Header, ViewToggle } from "@/components/Header";
import ui from "@/components/ui.module.css";
import { places } from "@/lib/places";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={ui.screen}>
      <div className={ui.top}>
        <Header />
        <h1 className={styles.title}>
          Where to eat
          <br />
          in Seongsu
        </h1>
        <p className={styles.subtitle}>Only the yolk: local favorites Korean diners rate highly, and what to order at each.</p>
        <div>
          <p className={styles.gloss}>
            <b>노른자</b> no-reun-ja = egg yolk, Korean slang for “the best part”.
          </p>
          <p className={styles.gloss}>
            <b>로컬 찐 맛집</b> lo-kal jjin mat-jip = a real-deal local favorite. Every pick here is one.
          </p>
        </div>
        <ViewToggle current="list" />
      </div>
      <div className={styles.list}>
        {places.map((place) => (
          <PlaceCard key={place.slug} place={place} />
        ))}
      </div>
    </main>
  );
}
