import styles from './KPISection.module.css';

export default function KPISection({ engagements }) {
  const total = engagements.length;
  const active = engagements.filter(e => e.status === 'In Progress').length;
  const completed = engagements.filter(e => e.status === 'Completed').length;
  const blocked = engagements.filter(e => e.status === 'Blocked').length;
  const goLive = engagements.filter(e => e.status === 'Completed' && e.progress === 100).length;

  const kpis = [
    { label: 'Total Engagements', value: total,     type: 'total',     trend: '+2 this quarter' },
    { label: 'Active',            value: active,    type: 'active',    trend: '+1 this month' },
    { label: 'Completed',         value: completed, type: 'completed', trend: '+3 YTD' },
    { label: 'Blocked',           value: blocked,   type: 'blocked',   trend: blocked > 0 ? 'Needs attention' : 'None blocked' },
    { label: 'Go Live',           value: goLive,    type: 'golive',    trend: `${goLive} customer${goLive !== 1 ? 's' : ''} live` },
  ];

  return (
    <section className={styles.kpiSection}>
      {kpis.map((kpi) => (
        <div key={kpi.type} className={`${styles.kpiCard} ${styles[kpi.type]}`}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiValue}>{kpi.value}</div>
          </div>
          <div className={styles.kpiLabel}>{kpi.label}</div>
          <div className={styles.kpiDivider} />
          <div className={styles.kpiTrend}>{kpi.trend}</div>
        </div>
      ))}
    </section>
  );
}
