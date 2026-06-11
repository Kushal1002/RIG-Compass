import { Users, Activity, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import styles from './KPISection.module.css';

export default function KPISection({ engagements }) {
  const total = engagements.length;
  const active = engagements.filter(e => e.status === 'In Progress').length;
  const completed = engagements.filter(e => e.status === 'Completed').length;
  const blocked = engagements.filter(e => e.status === 'Blocked').length;
  const avgProgress = total > 0
    ? Math.round(engagements.reduce((sum, e) => sum + e.progress, 0) / total)
    : 0;

  const kpis = [
    { label: 'Total Engagements', value: total, type: 'total', icon: Users, trend: '+2 this quarter' },
    { label: 'Active', value: active, type: 'active', icon: Activity, trend: '+1 this month' },
    { label: 'Completed', value: completed, type: 'completed', icon: CheckCircle, trend: '+3 YTD' },
    { label: 'Blocked', value: blocked, type: 'blocked', icon: AlertTriangle, trend: blocked > 0 ? 'Needs attention' : 'None' },
    { label: 'Avg Progress', value: `${avgProgress}%`, type: 'progress', icon: TrendingUp, trend: '+8% this month' },
  ];

  return (
    <section className={styles.kpiSection}>
      {kpis.map((kpi) => (
        <div key={kpi.type} className={`${styles.kpiCard} ${styles[kpi.type]}`}>
          <div className={`${styles.kpiIcon} ${styles[kpi.type]}`}>
            <kpi.icon size={18} />
          </div>
          <div className={styles.kpiValue}>{kpi.value}</div>
          <div className={styles.kpiLabel}>{kpi.label}</div>
          <div className={styles.kpiTrend}>{kpi.trend}</div>
        </div>
      ))}
    </section>
  );
}
