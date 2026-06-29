import { Search, X } from 'lucide-react';
import styles from './FilterBar.module.css';

export default function FilterBar({ filters, onFilterChange, engagements }) {
  const statuses = ['All', 'Not Started', 'In Progress', 'Blocked', 'Completed'];
  const industries = ['All', ...new Set(engagements.map(e => e.industry))];
  const types = ['All', ...new Set(engagements.map(e => e.engagementType))];
  const owners = ['All', ...new Set(engagements.map(e => e.owner))];

  const hasActiveFilters = filters.search || filters.status !== 'All' ||
    filters.industry !== 'All' || filters.type !== 'All' || filters.owner !== 'All';

  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrapper}>
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search customer name..."
          className={styles.searchInput}
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          maxLength={100}
        />
      </div>

      <select
        className={styles.select}
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
      </select>

      <select
        className={styles.select}
        value={filters.industry}
        onChange={(e) => onFilterChange('industry', e.target.value)}
      >
        {industries.map(i => <option key={i} value={i}>{i === 'All' ? 'All Industries' : i}</option>)}
      </select>

      <select
        className={styles.select}
        value={filters.type}
        onChange={(e) => onFilterChange('type', e.target.value)}
      >
        {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
      </select>

      <select
        className={styles.select}
        value={filters.owner}
        onChange={(e) => onFilterChange('owner', e.target.value)}
      >
        {owners.map(o => <option key={o} value={o}>{o === 'All' ? 'All Owners' : o}</option>)}
      </select>

      {hasActiveFilters && (
        <button
          className={styles.clearBtn}
          onClick={() => onFilterChange('reset')}
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
}
