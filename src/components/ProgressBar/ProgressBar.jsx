import styles from './ProgressBar.module.css';

export default function ProgressBar({ progress, status }) {
  let colorClass = styles.medium;
  if (status === 'Completed' || progress === 100) colorClass = styles.complete;
  else if (status === 'Blocked') colorClass = styles.low;
  else if (progress >= 70) colorClass = styles.high;
  else if (progress >= 40) colorClass = styles.medium;
  else colorClass = styles.low;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${colorClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={styles.progressLabel}>{progress}%</span>
    </div>
  );
}
