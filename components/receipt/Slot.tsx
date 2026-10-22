import styles from "./receipt.module.css";

// 영수증 프린터 슬롯 (SPEC §8-3)
export function Slot() {
  return <div className={styles.slot} />;
}
