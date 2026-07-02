import { useMemo } from 'react';
import { Shield, Heart, TrendingUp } from 'lucide-react';
import { calculateRiskLevel } from '../../utils/aiSummaryGenerator';
import { calculateHealthScore } from '../../utils/healthScore';
import styles from './ExecutiveSummary.module.css';

export default function ExecutiveSummary({ engagements }) {
  const summary = useMemo(() => {
    const total = engagements.length;
    const active = engagements.filter(e => e.status === 'In Progress').length;
    const blocked = engagements.filter(e => e.status === 'Blocked').length;
    const highRisk = engagements.filter(e => calculateRiskLevel(e) === 'High').length;
    const avgProgress = Math.round(engagements.reduce((s, e) => s + e.progress, 0) / total);
    const avgHealth = Math.round(engagements.reduce((s, e) => s + calculateHealthScore(e), 0) / total);

    // Find top performing type
    const typeProgress = {};
    const typeCounts = {};
    engagements.forEach(e => {
      typeProgress[e.engagementType] = (typeProgress[e.engagementType] || 0) + e.progress;
      typeCounts[e.engagementType] = (typeCounts[e.engagementType] || 0) + 1;
    });
    const bestType = Object.entries(typeProgress)
      .map(([type, total]) => ({ type, avg: Math.round(total / typeCounts[type]) }))
      .sort((a, b) => b.avg - a.avg)[0];

    // Find most blocked industry
    const industryBlocked = {};
    engagements.filter(e => e.status === 'Blocked').forEach(e => {
      industryBlocked[e.industry] = (industryBlocked[e.industry] || 0) + 1;
    });
    const blockedIndustry = Object.entries(industryBlocked).sort((a, b) => b[1] - a[1])[0];

    let text = `The APJ portfolio currently contains ${total} engagements with ${active} active and an average completion rate of ${avgProgress}%. `;
    if (highRisk > 0) {
      text += `${highRisk} engagement${highRisk > 1 ? 's are' : ' is'} classified as high risk requiring immediate attention. `;
    }
    if (blockedIndustry) {
      text += `${blockedIndustry[0]} projects face ongoing blockers. `;
    }
    if (bestType) {
      text += `${bestType.type} initiatives lead with ${bestType.avg}% average progress.`;
    }

    return { text, avgHealth, highRisk, avgProgress };
  }, [engagements]);

  const healthClass = summary.avgHealth >= 75 ? 'healthy' : summary.avgHealth >= 50 ? 'warning' : 'danger';

  return (
    <section className={styles.summarySection}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h2 className={styles.summaryTitle}>
            <img src="/301102_ai_white.png" alt="AI" style={{ width: 16, height: 16, objectFit: 'contain' }} />
            Executive Portfolio Summary
          </h2>
          <span className={styles.summaryTimestamp}>
            Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className={styles.summaryBody}>
          <p className={styles.summaryText}>{summary.text}</p>

          <div className={styles.summaryMetrics}>
            <div className={styles.metricCircle}>
              <div className={`${styles.circleValue} ${styles[healthClass]}`}>
                {summary.avgHealth}
              </div>
              <span className={styles.circleLabel}>Health</span>
            </div>
          </div>
        </div>

        <div className={styles.indicators}>
          <span className={styles.indicator}>
            <Heart size={11} /> Portfolio Health: {summary.avgHealth}/100
          </span>
          <span className={styles.indicator}>
            <Shield size={11} /> High Risk: {summary.highRisk}
          </span>
          <span className={styles.indicator}>
            <TrendingUp size={11} /> Avg Progress: {summary.avgProgress}%
          </span>
        </div>
      </div>
    </section>
  );
}
