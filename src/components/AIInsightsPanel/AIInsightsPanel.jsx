import { useMemo } from 'react';
import { Brain, AlertCircle, Clock, TrendingUp, Building2, BarChart3, Heart, Users, CheckCircle } from 'lucide-react';
import { generateAIInsights } from '../../utils/aiInsightsEngine';
import styles from './AIInsightsPanel.module.css';

const iconMap = {
  'alert-circle': AlertCircle,
  'clock': Clock,
  'trending-up': TrendingUp,
  'building': Building2,
  'bar-chart': BarChart3,
  'heart': Heart,
  'users': Users,
  'check-circle': CheckCircle,
};

export default function AIInsightsPanel({ engagements }) {
  const insights = useMemo(() => generateAIInsights(engagements), [engagements]);

  return (
    <div className={styles.insightsSection}>
      <div className={styles.insightsCard}>
        <h3 className={styles.insightsTitle}>
          <Brain size={16} color="#6366f1" />
          AI Insights & Observations
        </h3>
        <div className={styles.insightsList}>
          {insights.map((insight) => {
            const Icon = iconMap[insight.icon] || AlertCircle;
            return (
              <div key={insight.id} className={`${styles.insightItem} ${styles[insight.impact.toLowerCase()]}`}>
                <div className={`${styles.insightIcon} ${styles[insight.impact.toLowerCase()]}`}>
                  <Icon size={14} />
                </div>
                <div className={styles.insightContent}>
                  <p className={styles.insightText}>{insight.insight}</p>
                  <div className={styles.insightMeta}>
                    <span className={`${styles.impactBadge} ${styles[insight.impact.toLowerCase()]}`}>
                      {insight.impact}
                    </span>
                    <span className={styles.categoryTag}>{insight.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
