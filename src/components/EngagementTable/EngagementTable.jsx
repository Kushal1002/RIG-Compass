import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Eye, AlertCircle, Shield } from 'lucide-react';
import ProgressBar from '../ProgressBar/ProgressBar';
import HealthBadge from '../HealthBadge/HealthBadge';
import { calculateRiskLevel } from '../../utils/aiSummaryGenerator';
import styles from './EngagementTable.module.css';

const PAGE_SIZE = 7;

export default function EngagementTable({ engagements, onSelectEngagement }) {
  const [sortField, setSortField] = useState('customerName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [engagements]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sorted = [...engagements].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress': return styles.inProgress;
      case 'Completed': return styles.completed;
      case 'Blocked': return styles.blocked;
      default: return styles.notStarted;
    }
  };

  const getRiskClass = (risk) => {
    switch (risk) {
      case 'High': return styles.high;
      case 'Medium': return styles.medium;
      default: return styles.low;
    }
  };

  const SortIndicator = ({ field }) => (
    <span className={`${styles.sortIcon} ${sortField === field ? styles.active : ''}`}>
      {sortField === field && sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
    </span>
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>Engagement Pipeline</h3>
          <span className={styles.tableCount}>{engagements.length} engagements</span>
        </div>

        <div className={styles.scrollArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('customerName')}>Customer <SortIndicator field="customerName" /></th>
              <th onClick={() => handleSort('industry')}>Industry <SortIndicator field="industry" /></th>
              <th onClick={() => handleSort('engagementType')}>Type <SortIndicator field="engagementType" /></th>
              <th onClick={() => handleSort('owner')}>Owner <SortIndicator field="owner" /></th>
              <th onClick={() => handleSort('status')}>Status <SortIndicator field="status" /></th>
              <th onClick={() => handleSort('progress')}>Progress <SortIndicator field="progress" /></th>
              <th>Health</th>
              <th>Risk</th>
              <th onClick={() => handleSort('startDate')}>Start <SortIndicator field="startDate" /></th>
              <th onClick={() => handleSort('endDate')}>End <SortIndicator field="endDate" /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((eng) => {
              const risk = calculateRiskLevel(eng);
              return (
                <tr key={eng.id} onClick={() => onSelectEngagement(eng)}>
                  <td className={styles.customerName}>{eng.customerName}</td>
                  <td>{eng.industry}</td>
                  <td>{eng.engagementType}</td>
                  <td>{eng.owner}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(eng.status)}`}>
                      {eng.status === 'Blocked' && <AlertCircle size={10} />}
                      {eng.status}
                    </span>
                  </td>
                  <td><ProgressBar progress={eng.progress} status={eng.status} /></td>
                  <td><HealthBadge engagement={eng} /></td>
                  <td>
                    <span className={`${styles.riskBadge} ${getRiskClass(risk)}`}>
                      <Shield size={10} />
                      {risk}
                    </span>
                  </td>
                  <td>{formatDate(eng.startDate)}</td>
                  <td>{formatDate(eng.endDate)}</td>
                  <td>
                    <button
                      className={styles.actionBtn}
                      onClick={(e) => { e.stopPropagation(); onSelectEngagement(eng); }}
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
