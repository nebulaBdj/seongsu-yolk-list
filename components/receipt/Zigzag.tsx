import styles from "./receipt.module.css";

// 종이 아래 톱니 끝 (폭에 맞춰 늘어나는 CSS 삼각형 반복)
export function Zigzag({ tooth = 12.5 }: { tooth?: number }) {
  return <div className={styles.zigzag} style={{ backgroundSize: `${tooth}px 9px` }} aria-hidden="true" />;
}
