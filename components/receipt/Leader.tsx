import styles from "./receipt.module.css";

// 항목 ····· 값 (점 리더 줄)
export function Leader({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className={styles.leader}>
      <span>{label}</span>
      <span className={styles.leaderLine} />
      <span className={styles.leaderValue}>{value}</span>
    </div>
  );
}
