import { useMemo } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';
import Charts from '../../components/Charts/Charts';
import TeamWorkload from '../../components/TeamWorkload/TeamWorkload';
import AIInsightsPanel from '../../components/AIInsightsPanel/AIInsightsPanel';
import ExecutiveSummary from '../../components/ExecutiveSummary/ExecutiveSummary';
import KPISection from '../../components/KPISection/KPISection';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { calculateRiskLevel } from '../../utils/aiSummaryGenerator';
import { generateRecommendedActions } from '../../utils/recommendedActionsGenerator';
import styles from './Dashboard.module.css';

export default function Dashboard({ engagements, isRegional }) {
  const derived = useMemo(() => {
    const ownerCounts = {};
    const industryRisk = {};
    const criticals = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const atRisk = [];

    for (const e of engagements) {
      const risk = calculateRiskLevel(e);
      const endDate = new Date(e.endDate);
      endDate.setHours(0, 0, 0, 0);

      if (e.status === 'In Progress') {
        ownerCounts[e.owner] = (ownerCounts[e.owner] || 0) + 1;
      }
      if (risk === 'High') {
        industryRisk[e.industry] = (industryRisk[e.industry] || 0) + 1;
      }
      if (e.status === 'Blocked' || risk === 'High') {
        const reason = e.status === 'Blocked'
          ? (e.blockers || 'Blocked — requires escalation')
          : `High risk — ${e.progress}% progress with approaching deadline`;
        const actions = generateRecommendedActions(e);
        criticals.push({
          ...e, risk, reason,
          recommendation: actions[0]?.action || 'Review and escalate',
        });
      }
      if (risk === 'High' || risk === 'Medium' || e.status === 'Blocked') {
        const daysToEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        atRisk.push({ ...e, risk, daysToEnd });
      }
    }

    const sortedOwners = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]);
    const maxOwner = sortedOwners[0];
    const riskyIndustry = Object.entries(industryRisk).sort((a, b) => b[1] - a[1])[0];
    const blocked = engagements.filter(e => e.status === 'Blocked');
    const highRisk = engagements.filter(e => calculateRiskLevel(e) === 'High');

    const executiveRecommendations = [];
    const overdue = engagements.filter(e => {
      const endDate = new Date(e.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today && e.status !== 'Completed';
    });
    if (overdue.length > 0) {
      executiveRecommendations.push({ severity: 'critical', text: `${overdue.length} engagement${overdue.length > 1 ? 's are' : ' is'} past the agreed end date — agree revised timelines immediately` });
    }
    if (blocked.length > 0) {
      executiveRecommendations.push({ severity: 'critical', text: `Escalate ${blocked.length} blocked engagement${blocked.length > 1 ? 's' : ''} with immediate stakeholder review` });
    }
    if (highRisk.length > 0) {
      executiveRecommendations.push({ severity: 'critical', text: `${highRisk.length} high-risk engagement${highRisk.length > 1 ? 's require' : ' requires'} urgent delivery intervention` });
    }
    if (maxOwner && maxOwner[1] >= 4) {
      executiveRecommendations.push({ severity: 'warning', text: `Rebalance team capacity — ${maxOwner[0]} is managing ${maxOwner[1]} active engagements` });
    }
    if (riskyIndustry) {
      executiveRecommendations.push({ severity: 'warning', text: `Review ${riskyIndustry[0]} engagements — highest risk concentration (${riskyIndustry[1]} high-risk)` });
    }
    executiveRecommendations.push({ severity: 'info', text: 'Schedule quarterly portfolio review with regional leadership' });
    executiveRecommendations.push({ severity: 'info', text: 'Prioritize resource allocation for approaching deadline engagements' });

    return {
      criticalEngagements: criticals.slice(0, 5),
      atRisk: atRisk.sort((a, b) => {
        const riskOrder = { High: 0, Medium: 1, Low: 2 };
        return (riskOrder[a.risk] ?? 3) - (riskOrder[b.risk] ?? 3);
      }),
      executiveRecommendations,
    };
  }, [engagements]);

  const { criticalEngagements, atRisk, executiveRecommendations } = derived;

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        {/* Section 1: Executive Summary Hero */}
        <ExecutiveSummary engagements={engagements} />

        {/* Section 2: AI Portfolio Insights */}
        <AIInsightsPanel engagements={engagements} />

        {/* Section 3: Portfolio KPIs */}
        <KPISection engagements={engagements} />

        {/* Section 4: Portfolio Visualizations */}
        <Charts engagements={engagements} />

        {/* Section 4: Projects at Risk */}
        {atRisk.length > 0 && (
          <div className={styles.atRiskSection}>
            <div className={styles.criticalHeader}>
              <h3 className={styles.criticalTitle}>
                <ShieldAlert size={15} />
                Projects at Risk
              </h3>
              <span className={styles.atRiskCount}>{atRisk.length} project{atRisk.length !== 1 ? 's' : ''} flagged</span>
            </div>
            <div className={styles.criticalGrid}>
              {atRisk.map((eng) => (
                <div key={eng.id} className={`${styles.atRiskCard} ${styles[`risk${eng.risk}`]}`}>
                  <div className={styles.criticalCardHeader}>
                    <div>
                      <span className={styles.criticalCustomer}>{eng.customerName}</span>
                      {eng.projectName && <div className={styles.criticalProject}>{eng.projectName}</div>}
                    </div>
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
                  <div className={`${styles.atRiskFooter} ${styles[eng.risk.toLowerCase()]}`}>
                    <ShieldAlert size={11} />
                    {eng.status === 'Blocked'
                      ? `Blocked — ${eng.blockers || 'requires escalation'}`
                      : eng.daysToEnd < 0
                        ? `${Math.abs(eng.daysToEnd)}d past end date · ${eng.progress}% complete`
                        : `${eng.daysToEnd}d to deadline · ${eng.progress}% complete`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Team Capacity — Regional only */}
        {isRegional && <TeamWorkload engagements={engagements} />}

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
                    <div>
                      <span className={styles.criticalCustomer}>{eng.customerName}</span>
                      {eng.projectName && <div className={styles.criticalProject}>{eng.projectName}</div>}
                    </div>
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
