import styles from "./receipt.module.css";

// 노른자 뱃지 '로컬 찐 맛집' (SPEC §8-3)
export function Badge({ children = "로컬 찐 맛집" }: { children?: React.ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}

// 카테고리 칩 (테두리 알약)
export function Chip({ children }: { children: React.ReactNode }) {
  return <span className={styles.chip}>{children}</span>;
}
