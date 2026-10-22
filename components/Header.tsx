import Link from "next/link";
import { SITE } from "@/config/site";
import styles from "./ui.module.css";
import { TrackedLink } from "./TrackedLink";

// 노른자 로고
export function YolkLogo({ size = 26 }: { size?: number }) {
  return (
    <span className={styles.logo} style={{ width: size, height: size }} aria-hidden="true">
      <span style={{ width: size * 0.46, height: size * 0.46 }} />
    </span>
  );
}

// 머리줄: 로고 + THE YOLK LIST, 오른쪽 인스타
export function Header() {
  return (
    <div className={styles.headerRow}>
      <Link href="/" className={styles.brand}>
        <YolkLogo />
        THE YOLK LIST
      </Link>
      <TrackedLink href={SITE.instagram} event="instagram_click" className={styles.handle}>
        {SITE.instagramHandle}
      </TrackedLink>
    </div>
  );
}

// LIST / MAP 토글 (주소가 다른 두 페이지)
export function ViewToggle({ current }: { current: "list" | "map" }) {
  return (
    <nav className={styles.toggle} aria-label="View">
      {current === "list" ? <span className={styles.toggleOn}>LIST</span> : <Link href="/">LIST</Link>}
      {current === "map" ? <span className={styles.toggleOn}>MAP</span> : <Link href="/map">MAP</Link>}
    </nav>
  );
}
