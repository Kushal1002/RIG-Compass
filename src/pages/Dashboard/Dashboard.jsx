import { useMemo } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Shield, Target } from 'lucide-react';
import KPISection from '../../components/KPISection/KPISection';
import Charts from '../../components/Charts/Charts';
import TeamWorkload from '../../components/TeamWorkload/TeamWorkload';
import AIInsightsPanel from '../../components/AIInsightsPanel/AIInsightsPanel';
import ExecutiveSummary from '../../components/ExecutiveSummary/ExecutiveSummary';
import HealthBadge from '../../components/HealthBadge/HealthBadge';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { engagements as allEngagements } from '../../data/engagements';
import { calculateRiskLevel, generateAISummary } from '../../utils/aiSummaryGenerator';
import { calculateHealthScore, getHealthClassification } from '../../utils/healthScore';
import { generateRecommendedActions } from '../../utils/recommendedActionsGenerator';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const riskCounts = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    allEngagements.forEach(e => {
      const risk = calculateRiskLevel(e);
      counts[risk]++;
    });
    return counts;
  }, []);

  const healthDistribution = useMemo(() => {
    const dist = { Healthy: 0, Stable: 0, 'Needs Attention': 0, Critical: 0 };
    allEngagements.forEach(e => {
      const score = calculateHealthScore(e);
      const { label } = getHealthClassification(score);
      dist[label]++;
    });
    return dist;
  }, []);

  const criticalEngagements = useMemo(() => {
    return allEngagements
      .filter(e => e.status === 'Blocked' || calculateRiskLevel(e) === 'High')
      .slice(0, 5)
      .map(e => {
        const risk = calculateRiskLevel(e);
        const actions = generateRecommendedActions(e);
        const reason = e.status === 'Blocked'
          ? (e.blockers || 'Blocked - requires escalation')
          : `High risk - ${e.progress}% progress with approaching deadline`;
        return {
          ...e,
          risk,
          reason,
          recommendation: actions[0]?.action || 'Review and escalate',
        };
      });
  }, []);

  const executiveRecommendations = useMemo(() => {
    const recs = [];
    const blocked = allEngagements.filter(e => e.status === 'Blocked');
    const highRisk = allEngagements.filter(e => calculateRiskLevel(e) === 'High');

    // Workload analysis
    const ownerCounts = {};
    allEngagements.filter(e => e.status === 'In Progress').forEach(e => {
      ownerCounts[e.owner] = (ownerCounts[e.owner] || 0) + 1;
    });
    const maxOwner = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1])[0];

    // Industry risk analysis
    const industryRisk = {};
    highRisk.forEach(e => {
      industryRisk[e.industry] = (industryRisk[e.industry] || 0) + 1;
    });
    const riskyIndustry = Object.entries(industryRisk).sort((a, b) => b[1] - a[1])[0];

    if (blocked.length > 0) {
      recs.push({ severity: 'critical', text: `Escalate ${blocked.length} blocked engagement${blocked.length > 1 ? 's' : ''} with immediate stakeholder review` });
    }
    if (highRisk.length > 0) {
      recs.push({ severity: 'critical', text: `${highRisk.length} high-risk engagement${highRisk.length > 1 ? 's require' : ' requires'} urgent delivery intervention` });
    }
    if (maxOwner && maxOwner[1] >= 4) {
      recs.push({ severity: 'warning', text: `Rebalance team capacity - ${maxOwner[0]} is managing ${maxOwner[1]} active engagements` });
    }
    if (riskyIndustry) {
      recs.push({ severity: 'warning', text: `Review ${riskyIndustry[0]} engagements - highest risk concentration (${riskyIndustry[1]} high-risk)` });
    }
    recs.push({ severity: 'info', text: 'Schedule quarterly portfolio review with regional leadership' });
    recs.push({ severity: 'info', text: 'Prioritize resource allocation for approaching deadline engagements' });

    return recs;
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {/* Section 1: Executive Summary Hero */}
        <ExecutiveSummary engagements={allEngagements} />

        {/* Section 2: AI Portfolio Insights */}
        <AIInsightsPanel engagements={allEngagements} />

        {/* Section 3: Portfolio KPIs */}
        <KPISection engagements={allEngagements} />

        {/* Section 4: Portfolio Visualizations */}
        <Charts engagements={allEngagements} />

        {/* Risk & Health Distribution */}
        <div className={styles.riskSummary}>
          <div className={styles.riskCard}>
            <h3 className={styles.riskTitle}>
              <Shield size={14} />
              Risk Distribution
            </h3>
            <div className={styles.riskGrid}>
              <div className={`${styles.riskItem} ${styles.high}`}>
                <div className={styles.riskCount}>{riskCounts.High}</div>
                <div className={styles.riskLabel}>High Risk</div>
              </div>
              <div className={`${styles.riskItem} ${styles.medium}`}>
                <div className={styles.riskCount}>{riskCounts.Medium}</div>
                <div className={styles.riskLabel}>Medium Risk</div>
              </div>
              <div className={`${styles.riskItem} ${styles.low}`}>
                <div className={styles.riskCount}>{riskCounts.Low}</div>
                <div className={styles.riskLabel}>Low Risk</div>
              </div>
            </div>
          </div>

          <div className={styles.riskCard}>
            <h3 className={styles.riskTitle}>
              <Target size={14} />
              Health Distribution
            </h3>
            <div className={styles.riskGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className={styles.healthItem} style={{ background: '#e6f4e6' }}>
                <div className={styles.riskCount} style={{ color: '#188918' }}>{healthDistribution.Healthy}</div>
                <div className={styles.riskLabel} style={{ color: '#188918' }}>Healthy</div>
              </div>
              <div className={styles.healthItem} style={{ background: '#e8f4fd' }}>
                <div className={styles.riskCount} style={{ color: '#0070f2' }}>{healthDistribution.Stable}</div>
                <div className={styles.riskLabel} style={{ color: '#0070f2' }}>Stable</div>
              </div>
              <div className={styles.healthItem} style={{ background: '#fef3e6' }}>
                <div className={styles.riskCount} style={{ color: '#e76500' }}>{healthDistribution['Needs Attention']}</div>
                <div className={styles.riskLabel} style={{ color: '#e76500' }}>Attention</div>
              </div>
              <div className={styles.healthItem} style={{ background: '#fce6e6' }}>
                <div className={styles.riskCount} style={{ color: '#cc1919' }}>{healthDistribution.Critical}</div>
                <div className={styles.riskLabel} style={{ color: '#cc1919' }}>Critical</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Team Capacity */}
        <TeamWorkload engagements={allEngagements} />

        {/* Section 6: Critical Engagements */}
        <div className={styles.criticalSection}>
          <div className={styles.criticalHeader}>
            <h3 className={styles.criticalTitle}>
              <AlertTriangle size={15} />
              Critical Engagements Requiring Attention
            </h3>
            <span className={styles.criticalCount}>{criticalEngagements.length} flagged</span>
          </div>
          <div className={styles.criticalGrid}>
            {criticalEngagements.map((eng) => (
              <div key={eng.id} className={styles.criticalCard}>
                <div className={styles.criticalCardHeader}>
                  <span className={styles.criticalCustomer}>{eng.customerName}</span>
                  <span className={`${styles.riskBadge} ${styles[eng.risk.toLowerCase()]}`}>
                    {eng.risk} Risk
                  </span>
                </div>
                <div className={styles.criticalMeta}>
                  <span>{eng.industry}</span>
                  <span>&middot;</span>
                  <span>{eng.engagementType}</span>
                  <span>&middot;</span>
                  <span>{eng.owner}</span>
                </div>
                <div className={styles.criticalProgress}>
                  <ProgressBar progress={eng.progress} status={eng.status} />
                </div>
                <div className={styles.criticalReason}>
                  <AlertTriangle size={11} />
                  {eng.reason}
                </div>
                <div className={styles.criticalAction}>
                  <TrendingUp size={11} />
                  <strong>Action:</strong> {eng.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Executive Recommendations */}
        <div className={styles.recommendationsSection}>
          <div className={styles.recCard}>
            <h3 className={styles.recTitle}>
              <Sparkles size={15} />
              Executive Recommendations
            </h3>
            <div className={styles.recList}>
              {executiveRecommendations.map((rec, i) => (
                <div key={i} className={styles.recItem}>
                  <span className={`${styles.recDot} ${styles[rec.severity]}`} />
                  <span className={styles.recText}>{rec.text}</span>
                  <span className={`${styles.severityBadge} ${styles[rec.severity]}`}>
                    {rec.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
