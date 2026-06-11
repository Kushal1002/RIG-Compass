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
  if (count >= 6) return '#cc1919';
  if (count >= 3) return '#0070f2';
  return '#188918';
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
            <Users size={16} color="#0070f2" />
            Team Capacity & Workload
          </h3>
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
            <BarChart data={workloadData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#e5e7eb' }}
                width={55}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}
                formatter={(value, name, props) => {
                  const status = getWorkloadStatus(value);
                  return [`${value} engagements (${status.label})`, props.payload.fullName];
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
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
