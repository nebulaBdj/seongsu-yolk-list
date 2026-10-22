import styles from "./receipt.module.css";

type LeaderProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  // 값이 짧은 한글일 때 중간에서 끊기지 않게 (직원에게 보여주는 메뉴 이름)
  keepValue?: boolean;
};

// 항목 ····· 값 (점 리더 줄)
export function Leader({ label, value, keepValue = false }: LeaderProps) {
  return (
    <div className={styles.leader}>
      <span>{label}</span>
      <span className={styles.leaderLine} />
      <span className={`${styles.leaderValue} ${keepValue ? styles.keep : ""}`}>{value}</span>
    </div>
  );
}
