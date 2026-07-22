import { useMemo, useState } from 'react';
import { ShieldAlert, LayoutGrid, User, Activity, AlertTriangle, Rocket } from 'lucide-react';
import KPISection from '../../components/KPISection/KPISection';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import EngagementTable from '../../components/EngagementTable/EngagementTable';
import EngagementCard from '../../components/EngagementCard/EngagementCard';
import AISummaryModal from '../../components/AISummaryModal/AISummaryModal';
import EditEngagementModal from '../../components/EditEngagementModal/EditEngagementModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import { calculateRiskLevel } from '../../utils/aiSummaryGenerator';
import styles from './Dashboard.module.css';

const initialFilters = {
  search: '',
  status: 'All',
  industry: 'All',
  type: 'All',
  owner: 'All',
};

const VIEW = { MY: 'my', ALL: 'all' };

export default function Dashboard({
  engagements, allEngagements,
  isRegional, onToggleRegion, showMyProjects, onToggleView,
  currentUser, onAdd, onUpdate, onDelete,
}) {
  const [view, setView]               = useState(showMyProjects ? VIEW.MY : VIEW.ALL);
  const [filters, setFilters]         = useState(initialFilters);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [summaryEngagement, setSummaryEngagement]   = useState(null);
  const [editEngagement, setEditEngagement]         = useState(null);
  const [deleteEngagement, setDeleteEngagement]     = useState(null);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters(initialFilters);
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  const switchView = (v) => {
    setView(v);
    if (v === VIEW.MY && !showMyProjects) onToggleView();
    if (v === VIEW.ALL && showMyProjects) onToggleView();
  };

  const filterPool = view === VIEW.MY ? engagements : allEngagements;

  const filteredEngagements = useMemo(() => {
    return filterPool.filter(e => {
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
  }, [filters, filterPool]);

  const atRisk = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return engagements
      .filter(e => calculateRiskLevel(e) === 'High' || calculateRiskLevel(e) === 'Medium' || e.status === 'Blocked')
      .map(e => {
        const risk = calculateRiskLevel(e);
        const endDate = new Date(e.endDate); endDate.setHours(0, 0, 0, 0);
        return { ...e, risk, daysToEnd: Math.ceil((endDate - today) / 86400000) };
      })
      .sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.risk] ?? 3) - ({ High: 0, Medium: 1, Low: 2 }[b.risk] ?? 3));
  }, [engagements]);

  const quickStats = useMemo(() => ({
    active:   filterPool.filter(e => e.status === 'In Progress').length,
    blocked:  filterPool.filter(e => e.status === 'Blocked').length,
    highRisk: filterPool.filter(e => calculateRiskLevel(e) === 'High').length,
    goLive:   filterPool.filter(e => e.status === 'Completed' && e.progress === 100).length,
  }), [filterPool]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>

        {/* View toggle header */}
        <div className={styles.viewToggleBar}>
          <div className={styles.viewToggleLeft}>
            <h2 className={styles.viewTitle}>
              {view === VIEW.MY  && <><User size={15} /> My Projects</>}
              {view === VIEW.ALL && <><LayoutGrid size={15} /> All Projects</>}
            </h2>
          </div>
          <div className={styles.viewToggleRight}>
            <div className={styles.viewToggleGroup}>
              <button
                className={`${styles.viewToggleBtn} ${view === VIEW.MY ? styles.viewToggleActive : ''}`}
                onClick={() => switchView(VIEW.MY)}
              >
                <User size={12} /> My Projects
              </button>
              <button
                className={`${styles.viewToggleBtn} ${view === VIEW.ALL ? styles.viewToggleActive : ''}`}
                onClick={() => switchView(VIEW.ALL)}
              >
                <LayoutGrid size={12} /> All Projects
              </button>
            </div>
          </div>
        </div>

        {view === VIEW.ALL && (
          <div className={styles.regionToggleBar}>
            <button
              className={`${styles.regionToggleBtn} ${!isRegional ? styles.regionToggleActive : ''}`}
              onClick={() => isRegional && onToggleRegion()}
            >
              Global
            </button>
            <button
              className={`${styles.regionToggleBtn} ${isRegional ? styles.regionToggleActive : ''}`}
              onClick={() => !isRegional && onToggleRegion()}
            >
              Regional
            </button>
          </div>
        )}

        {/* ── MY PROJECTS ── */}
        {view === VIEW.MY && (
          <>
            <KPISection engagements={filterPool} />
            {engagements.length === 0 ? (
              <div className={styles.emptyMyProjects}>
                <User size={32} className={styles.emptyIcon} />
                <p className={styles.emptyTitle}>No projects assigned to you</p>
                <p className={styles.emptyDesc}>You have no engagements where you are listed as owner. Switch to All Projects to see the full portfolio.</p>
                <button className={styles.emptyAction} onClick={() => switchView(VIEW.ALL)}>
                  <LayoutGrid size={13} /> View All Projects
                </button>
              </div>
            ) : (
              <>
                {atRisk.length > 0 && (
                  <div className={styles.atRiskSection}>
                    <div className={styles.criticalHeader}>
                      <h3 className={styles.criticalTitle}><ShieldAlert size={15} /> Projects at Risk</h3>
                      <span className={styles.atRiskCount}>{atRisk.length} project{atRisk.length !== 1 ? 's' : ''} flagged</span>
                    </div>
                    <div className={styles.criticalGrid}>
                      {atRisk.map(eng => (
                        <div key={eng.id} className={`${styles.atRiskCard} ${styles[`risk${eng.risk}`]}`}>
                          <div className={styles.criticalCardHeader}>
                            <div>
                              <span className={styles.criticalCustomer}>{eng.customerName}</span>
                              {eng.projectName && <div className={styles.criticalProject}>{eng.projectName}</div>}
                            </div>
                            <span className={`${styles.riskBadge} ${styles[eng.risk.toLowerCase()]}`}>{eng.risk} Risk</span>
                          </div>
                          <div className={styles.criticalMeta}><span>{eng.industry}</span><span>&middot;</span><span>{eng.owner}</span></div>
                          <div className={styles.criticalProgress}><ProgressBar progress={eng.progress} status={eng.status} /></div>
                          <div className={`${styles.atRiskFooter} ${styles[eng.risk.toLowerCase()]}`}>
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
                <div className={styles.myProjectsTableSection}>
                  <FilterBar filters={filters} onFilterChange={handleFilterChange} engagements={engagements} />
                  {filteredEngagements.length > 0
                    ? <EngagementTable engagements={filteredEngagements} onSelectEngagement={setSelectedEngagement} onEditEngagement={setEditEngagement} onDeleteEngagement={setDeleteEngagement} />
                    : <EmptyState />}
                </div>
              </>
            )}
          </>
        )}

        {/* ── ALL PROJECTS ── */}
        {view === VIEW.ALL && (
          <>
            <KPISection engagements={filterPool} />
            <div className={styles.allEngagementsSection}>
              <div className={styles.statsBar}>
                <div className={styles.statItem}><Activity size={13} /><span><strong>{quickStats.active}</strong> Active</span></div>
                <div className={styles.statItem}><AlertTriangle size={13} /><span><strong>{quickStats.blocked}</strong> Blocked</span></div>
                <div className={styles.statItem}><AlertTriangle size={13} /><span><strong>{quickStats.highRisk}</strong> High Risk</span></div>
                <div className={styles.statItem}><Rocket size={13} /><span><strong>{quickStats.goLive}</strong> Go Live</span></div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}><span className={styles.statCount}>{filteredEngagements.length} of {allEngagements.length} shown</span></div>
              </div>
              <FilterBar filters={filters} onFilterChange={handleFilterChange} engagements={allEngagements} />
              {filteredEngagements.length > 0
                ? <EngagementTable engagements={filteredEngagements} onSelectEngagement={setSelectedEngagement} onEditEngagement={setEditEngagement} onDeleteEngagement={setDeleteEngagement} />
                : <EmptyState />}
            </div>
          </>
        )}

      </div>

      {/* Modals */}
      {selectedEngagement && (
        <EngagementCard engagement={selectedEngagement} onClose={() => setSelectedEngagement(null)} onGenerateSummary={setSummaryEngagement} onDelete={eng => { setSelectedEngagement(null); setDeleteEngagement(eng); }} />
      )}
      {summaryEngagement && <AISummaryModal engagement={summaryEngagement} onClose={() => setSummaryEngagement(null)} />}
      {editEngagement && <EditEngagementModal engagement={editEngagement} onSave={onUpdate} onClose={() => setEditEngagement(null)} />}
      {deleteEngagement && <DeleteConfirmModal engagement={deleteEngagement} onConfirm={onDelete} onClose={() => setDeleteEngagement(null)} />}
    </div>
  );
}
