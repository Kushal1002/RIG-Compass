import { useMemo } from 'react';
import { generateAIInsights } from '../../utils/aiInsightsEngine';
import styles from './AIInsightsPanel.module.css';

export default function AIInsightsPanel({ engagements }) {
  const insights = useMemo(() => generateAIInsights(engagements), [engagements]);

  return (
    <div className={styles.insightsSection}>
      <div className={styles.insightsCard}>
        <h3 className={styles.insightsTitle}>
          <img src="/301102_ai_white.png" alt="Joule" style={{ width: 14, height: 14, objectFit: 'contain', opacity: 0.7 }} />
          AI Insights & Observations
        </h3>
        <div className={styles.insightsList}>
          {insights.map((insight) => (
            <div key={insight.id} className={styles.insightItem}>
              <div className={`${styles.insightDot} ${styles[insight.impact.toLowerCase()]}`} />
              <div className={styles.insightContent}>
                <p className={styles.insightText}>{insight.insight}</p>
                <div className={styles.insightMeta}>
                  <span className={`${styles.impactLabel} ${styles[insight.impact.toLowerCase()]}`}>
                    {insight.impact}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem' }}>·</span>
                  <span className={styles.categoryTag}>{insight.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
