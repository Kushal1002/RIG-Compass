import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { monthlyProgressData } from '../../data/engagements';
import styles from './Charts.module.css';

const STATUS_COLORS = {
  'Not Started': '#6b7280',
  'In Progress': '#0070f2',
  'Blocked': '#cc1919',
  'Completed': '#188918'
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Charts({ engagements }) {
  const statusData = Object.entries(
    engagements.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Timeline: count projects ending each month
  const timelineMap = {};
  engagements.forEach(e => {
    if (!e.endDate) return;
    const d = new Date(e.endDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${MONTH_NAMES[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
    if (!timelineMap[key]) timelineMap[key] = { key, label, ending: 0 };
    timelineMap[key].ending += 1;
  });
  const timelineData = Object.values(timelineMap).sort((a, b) => a.key.localeCompare(b.key));

  return (
    <section className={styles.chartsSection}>
      {/* Status Pie Chart */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Engagement Status</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Overview */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Timeline Overview</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timelineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}
              formatter={(value) => [value, 'Projects ending']}
            />
            <Bar dataKey="ending" radius={[4, 4, 0, 0]} fill="#0070F2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Line Chart */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Progress Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyProgressData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}
              formatter={(value) => [`${value}%`, 'Avg Progress']}
            />
            <Line
              type="monotone"
              dataKey="avgProgress"
              stroke="#0070f2"
              strokeWidth={2.5}
              dot={{ fill: '#0070f2', r: 4 }}
              activeDot={{ r: 6, fill: '#0070f2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
