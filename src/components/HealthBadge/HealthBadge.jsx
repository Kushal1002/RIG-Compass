import { calculateHealthScore, getHealthClassification } from '../../utils/healthScore';
import styles from './HealthBadge.module.css';

export default function HealthBadge({ engagement, compact = false }) {
  const score = calculateHealthScore(engagement);
  const { label, color, bg } = getHealthClassification(score);

  const size = compact ? 26 : 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <div className={styles.circularProgress} style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            className={styles.track}
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          <circle
            className={styles.fill}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={styles.scoreText}>{score}</span>
      </div>
      <span className={styles.badge} style={{ background: bg, color }}>
        {label}
      </span>
    </div>
  );
}
