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

const TYPE_COLORS = ['#0070f2', '#6366f1', '#0891b2', '#e76500', '#188918'];

export default function Charts({ engagements }) {
  // Status pie chart data
  const statusData = Object.entries(
    engagements.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Type bar chart data
  const typeData = Object.entries(
    engagements.reduce((acc, e) => {
      const type = e.engagementType === 'SAP BTP Architecture' ? 'Architecture' : e.engagementType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

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
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '0.8rem'
              }}
            />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: '0.75rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Type Bar Chart */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>By Engagement Type</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={typeData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '0.8rem'
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {typeData.map((_, index) => (
                <Cell key={index} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Line Chart */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Progress Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyProgressData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '0.8rem'
              }}
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
