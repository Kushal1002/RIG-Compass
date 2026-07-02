import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './TeamWorkload.module.css';

function getWorkloadStatus(count) {
  if (count >= 6) return { label: 'Overloaded', className: styles.overloaded };
  if (count >= 3) return { label: 'Balanced', className: styles.balanced };
  return { label: 'Underutilized', className: styles.underutilized };
}

function getBarColor(count) {
  if (count >= 6) return '#BB0000';
  if (count >= 3) return '#0070F2';
  return '#107E3E';
}

export default function TeamWorkload({ engagements }) {
  const workloadData = useMemo(() => {
    const ownerCounts = {};
    engagements.filter(e => e.status !== 'Completed').forEach(e => {
      ownerCounts[e.owner] = (ownerCounts[e.owner] || 0) + 1;
    });
    return Object.entries(ownerCounts)
      .map(([name, count]) => ({ name: name.split(' ')[0], fullName: name, count }))
      .sort((a, b) => b.count - a.count);
  }, [engagements]);

  const mostLoaded = workloadData[0];
  const leastLoaded = workloadData[workloadData.length - 1];
  const avgPerConsultant = workloadData.length > 0
    ? (workloadData.reduce((s, d) => s + d.count, 0) / workloadData.length).toFixed(1)
    : 0;

  return (
    <div className={styles.workloadSection}>
      <div className={styles.workloadCard}>
        <div className={styles.workloadHeader}>
          <h3 className={styles.workloadTitle}>
            <Users size={15} color="#0070f2" />
            Team Capacity & Workload
          </h3>
          <div className={styles.legendRow}>
            <span className={`${styles.statusBadge} ${styles.underutilized}`}>Underutilized &lt;3</span>
            <span className={`${styles.statusBadge} ${styles.balanced}`}>Balanced 3–5</span>
            <span className={`${styles.statusBadge} ${styles.overloaded}`}>Overloaded 6+</span>
          </div>
        </div>

        <div className={styles.metricsRow}>
          <div className={styles.metricBox}>
            <div className={styles.metricValue}>{mostLoaded?.fullName || 'N/A'}</div>
            <div className={styles.metricLabel}>Most Loaded</div>
          </div>
          <div className={styles.metricBox}>
            <div className={styles.metricValue}>{leastLoaded?.fullName || 'N/A'}</div>
            <div className={styles.metricLabel}>Least Loaded</div>
          </div>
          <div className={styles.metricBox}>
            <div className={styles.metricValue}>{avgPerConsultant}</div>
            <div className={styles.metricLabel}>Avg Per Consultant</div>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C8DCEF" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3A536B', fontWeight: 600 }} axisLine={{ stroke: '#C8DCEF' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6E8FAB' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #C8DCEF', fontSize: '0.78rem', background: '#fff' }}
                formatter={(value, _, props) => {
                  const status = getWorkloadStatus(value);
                  return [`${value} engagements · ${status.label}`, props.payload.fullName];
                }}
                cursor={{ fill: 'rgba(0,112,242,0.05)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                {workloadData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.count)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
