import { useState, useMemo } from 'react';
import { Users, AlertTriangle, Rocket, Activity, Plus } from 'lucide-react';
import FilterBar from '../../components/FilterBar/FilterBar';
import EngagementTable from '../../components/EngagementTable/EngagementTable';
import EngagementCard from '../../components/EngagementCard/EngagementCard';
import AISummaryModal from '../../components/AISummaryModal/AISummaryModal';
import EditEngagementModal from '../../components/EditEngagementModal/EditEngagementModal';
import AddEngagementModal from '../../components/AddEngagementModal/AddEngagementModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import { calculateRiskLevel } from '../../utils/aiSummaryGenerator';
import styles from './Engagements.module.css';

const initialFilters = {
  search: '',
  status: 'All',
  industry: 'All',
  type: 'All',
  owner: 'All',
};

export default function Engagements({ engagements: allEngagements, onAdd, onUpdate, onDelete }) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [summaryEngagement, setSummaryEngagement] = useState(null);
  const [editEngagement, setEditEngagement] = useState(null);
  const [deleteEngagement, setDeleteEngagement] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters(initialFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const filteredEngagements = useMemo(() => {
    return allEngagements.filter(e => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!e.customerName.toLowerCase().includes(q) && !(e.projectName || '').toLowerCase().includes(q)) return false;
      }
      if (filters.status !== 'All' && e.status !== filters.status) return false;
      if (filters.industry !== 'All' && e.industry !== filters.industry) return false;
      if (filters.type !== 'All' && e.engagementType !== filters.type) return false;
      if (filters.owner !== 'All' && e.owner !== filters.owner) return false;
      return true;
    });
  }, [filters, allEngagements]);

  const stats = useMemo(() => {
    const active = allEngagements.filter(e => e.status === 'In Progress').length;
    const blocked = allEngagements.filter(e => e.status === 'Blocked').length;
    const highRisk = allEngagements.filter(e => calculateRiskLevel(e) === 'High').length;
    const goLive = allEngagements.filter(e => e.status === 'Completed' && e.progress === 100).length;
    return { active, blocked, highRisk, goLive };
  }, [allEngagements]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageIcon}>
            <Users size={18} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Engagement Workspace</h1>
            <p className={styles.pageSubtitle}>
              Operational management of customer engagements
            </p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <Plus size={14} />
          New Engagement
        </button>
      </div>

      {/* Quick Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <Activity size={13} />
          <span><strong>{stats.active}</strong> Active</span>
        </div>
        <div className={styles.statItem}>
          <AlertTriangle size={13} />
          <span><strong>{stats.blocked}</strong> Blocked</span>
        </div>
        <div className={styles.statItem}>
          <AlertTriangle size={13} />
          <span><strong>{stats.highRisk}</strong> High Risk</span>
        </div>
        <div className={styles.statItem}>
          <Rocket size={13} />
          <span><strong>{stats.goLive}</strong> Go Live</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statCount}>{filteredEngagements.length} of {allEngagements.length} shown</span>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        engagements={allEngagements}
      />

      {filteredEngagements.length > 0 ? (
        <EngagementTable
          engagements={filteredEngagements}
          onSelectEngagement={setSelectedEngagement}
          onEditEngagement={setEditEngagement}
          onDeleteEngagement={setDeleteEngagement}
        />
      ) : (
        <EmptyState />
      )}

      {selectedEngagement && (
        <EngagementCard
          engagement={selectedEngagement}
          onClose={() => setSelectedEngagement(null)}
          onGenerateSummary={(eng) => setSummaryEngagement(eng)}
          onDelete={(eng) => { setSelectedEngagement(null); setDeleteEngagement(eng); }}
        />
      )}

      {summaryEngagement && (
        <AISummaryModal
          engagement={summaryEngagement}
          onClose={() => setSummaryEngagement(null)}
        />
      )}

      {editEngagement && (
        <EditEngagementModal
          engagement={editEngagement}
          onSave={onUpdate}
          onClose={() => setEditEngagement(null)}
        />
      )}

      {deleteEngagement && (
        <DeleteConfirmModal
          engagement={deleteEngagement}
          onConfirm={onDelete}
          onClose={() => setDeleteEngagement(null)}
        />
      )}

      {showAddModal && (
        <AddEngagementModal
          onAdd={onAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
