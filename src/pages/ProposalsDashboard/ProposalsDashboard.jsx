import { useMemo, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, User, LayoutGrid, Plus, MessageCircleQuestion } from 'lucide-react';
import AddEngagementModal from '../../components/AddEngagementModal/AddEngagementModal';
import ReviewProposalModal from '../../components/ReviewProposalModal/ReviewProposalModal';
import styles from '../Dashboard/Dashboard.module.css';

const PROPOSAL_STATUS_META = {
  'Under Review':   { icon: Clock,                   color: '#b25a00', bg: '#fff7ed', border: '#fed7aa' },
  'Accepted':       { icon: CheckCircle,             color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  'Rejected':       { icon: XCircle,                 color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Info Requested': { icon: MessageCircleQuestion,   color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
};

const VIEW = { MY: 'my', ALL: 'all' };

export default function ProposalsDashboard({
  proposals, currentUser, onAddProposal, onUpdateProposal, onAddEngagement,
  isRegional, onToggleRegion,
}) {
  const [view, setView] = useState(VIEW.MY);
  const [proposalSearch, setProposalSearch] = useState('');
  const [proposalStatusFilter, setProposalStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewProposal, setReviewProposal] = useState(null);

  const currentUserName = currentUser?.name || '';

  const viewPool = useMemo(() => {
    if (view === VIEW.MY) return (proposals || []).filter(p => p.submittedBy === currentUserName);
    return proposals || [];
  }, [proposals, view, currentUserName]);

  const filteredProposals = useMemo(() => {
    return viewPool.filter(p => {
      if (proposalSearch) {
        const q = proposalSearch.toLowerCase();
        if (!(p.customerName || '').toLowerCase().includes(q) && !(p.projectName || '').toLowerCase().includes(q)) return false;
      }
      if (proposalStatusFilter !== 'All' && p.proposalStatus !== proposalStatusFilter) return false;
      return true;
    });
  }, [viewPool, proposalSearch, proposalStatusFilter]);

  const proposalCounts = useMemo(() => ({
    underReview:   viewPool.filter(p => p.proposalStatus === 'Under Review').length,
    accepted:      viewPool.filter(p => p.proposalStatus === 'Accepted').length,
    rejected:      viewPool.filter(p => p.proposalStatus === 'Rejected').length,
    infoRequested: viewPool.filter(p => p.proposalStatus === 'Info Requested').length,
  }), [viewPool]);

  const handleAccept = async (proposal, comment) => {
    const now = new Date().toISOString();
    await onUpdateProposal(proposal.id, {
      proposalStatus: 'Accepted',
      reviewComment:  comment,
      reviewedBy:     currentUserName,
      reviewedAt:     now,
    });
    const { id, ID, createdAt, createdBy, modifiedAt, modifiedBy,
            proposalStatus, reviewComment, reviewedBy, reviewedAt, submittedBy,
            ...engagementFields } = proposal;
    await onAddEngagement({
      ...engagementFields,
      proposalId:     proposal.id,
      status:         'Not Started',
      progress:       0,
      blockers:       '',
      engagementType: '',
      owner:          currentUserName,
    });
    setReviewProposal(null);
  };

  const handleReject = async (proposal, comment) => {
    await onUpdateProposal(proposal.id, {
      proposalStatus: 'Rejected',
      reviewComment:  comment,
      reviewedBy:     currentUserName,
      reviewedAt:     new Date().toISOString(),
    });
    setReviewProposal(null);
  };

  const handleRequestInfo = async (proposal, comment) => {
    await onUpdateProposal(proposal.id, {
      proposalStatus: 'Info Requested',
      reviewComment:  comment,
      reviewedBy:     currentUserName,
      reviewedAt:     new Date().toISOString(),
    });
    setReviewProposal(null);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>

        <div className={styles.viewToggleBar}>
          <div className={styles.viewToggleLeft}>
            <h2 className={styles.viewTitle}>
              <FileText size={15} />
              {view === VIEW.MY ? 'My Proposals' : 'All Proposals'}
            </h2>
            {proposalCounts.underReview > 0 && (
              <span className={styles.viewSubtitle}>{proposalCounts.underReview} pending review{proposalCounts.infoRequested > 0 ? ` · ${proposalCounts.infoRequested} info requested` : ''}</span>
            )}
          </div>
          <div className={styles.viewToggleRight}>
            <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> New Intake
            </button>
            <div className={styles.viewToggleGroup}>
              <button
                className={`${styles.viewToggleBtn} ${view === VIEW.MY ? styles.viewToggleActive : ''}`}
                onClick={() => setView(VIEW.MY)}
              >
                <User size={12} /> My Proposals
              </button>
              <button
                className={`${styles.viewToggleBtn} ${view === VIEW.ALL ? styles.viewToggleActive : ''}`}
                onClick={() => setView(VIEW.ALL)}
              >
                <LayoutGrid size={12} /> All Proposals
                {view === VIEW.ALL && proposalCounts.underReview > 0 && (
                  <span className={styles.proposalTabBadge}>{proposalCounts.underReview}</span>
                )}
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

        <div className={styles.proposalsSection}>
          <div className={styles.proposalSummaryBar}>
            {['Under Review', 'Info Requested', 'Accepted', 'Rejected'].map(s => {
              const meta = PROPOSAL_STATUS_META[s];
              const countKey = s === 'Under Review' ? 'underReview' : s === 'Info Requested' ? 'infoRequested' : s.toLowerCase();
              const count = proposalCounts[countKey];
              return (
                <button
                  key={s}
                  className={`${styles.proposalSummaryChip} ${proposalStatusFilter === s ? styles.proposalSummaryChipActive : ''}`}
                  style={proposalStatusFilter === s ? { borderColor: meta.border, background: meta.bg, color: meta.color } : {}}
                  onClick={() => setProposalStatusFilter(proposalStatusFilter === s ? 'All' : s)}
                >
                  <meta.icon size={12} /> {s} <span className={styles.proposalSummaryCount}>{count}</span>
                </button>
              );
            })}
            {proposalStatusFilter !== 'All' && (
              <button className={styles.proposalClearFilter} onClick={() => setProposalStatusFilter('All')}>Clear filter</button>
            )}
            <div style={{ flex: 1 }} />
            <input
              className={styles.proposalSearch}
              placeholder="Search proposals…"
              value={proposalSearch}
              onChange={e => setProposalSearch(e.target.value)}
            />
          </div>

          {filteredProposals.length === 0 ? (
            <div className={styles.emptyMyProjects}>
              <FileText size={32} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>
                {viewPool.length === 0 ? 'No proposals yet' : 'No proposals match your filter'}
              </p>
              <p className={styles.emptyDesc}>
                {viewPool.length === 0
                  ? 'Use the New Intake button to submit a proposal.'
                  : 'Try clearing the filter to see all proposals.'}
              </p>
            </div>
          ) : (
            <div className={styles.proposalList}>
              {filteredProposals.map(p => {
                const meta = PROPOSAL_STATUS_META[p.proposalStatus] || PROPOSAL_STATUS_META['Under Review'];
                const Icon = meta.icon;
                return (
                  <div key={p.id} className={styles.proposalRow} onClick={() => setReviewProposal(p)}>
                    <div className={styles.proposalRowMain}>
                      <div className={styles.proposalRowTitle}>{p.projectName || '—'}</div>
                      <div className={styles.proposalRowSub}>{p.customerName}{p.lineOfBusiness ? ` · ${p.lineOfBusiness}` : ''}{p.region ? ` · ${p.region}` : ''}</div>
                    </div>
                    <div className={styles.proposalRowMeta}>
                      {p.priority && (
                        <span className={`${styles.proposalPriority} ${styles[`priority${p.priority}`]}`}>{p.priority}</span>
                      )}
                      <span className={styles.proposalSubmittedBy}>by {p.submittedBy || '—'}</span>
                    </div>
                    <span
                      className={styles.proposalStatusBadge}
                      style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
                    >
                      <Icon size={11} /> {p.proposalStatus}
                    </span>
                    {(p.proposalStatus === 'Under Review' || p.proposalStatus === 'Info Requested') && (
                      <div className={styles.proposalRowActions} onClick={e => e.stopPropagation()}>
                        <button className={styles.acceptRowBtn} onClick={() => setReviewProposal(p)}>Review</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {showAddModal && (
        <AddEngagementModal onAdd={onAddProposal} currentUser={currentUser} onClose={() => setShowAddModal(false)} />
      )}
      {reviewProposal && (
        <ReviewProposalModal
          proposal={reviewProposal}
          currentUser={currentUser}
          onAccept={handleAccept}
          onReject={handleReject}
          onRequestInfo={handleRequestInfo}
          onClose={() => setReviewProposal(null)}
        />
      )}
    </div>
  );
}
