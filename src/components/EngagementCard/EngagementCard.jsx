import { X, Sparkles, Check } from 'lucide-react';
import ProgressBar from '../ProgressBar/ProgressBar';
import HealthBadge from '../HealthBadge/HealthBadge';
import { calculateRiskLevel, getPhase } from '../../utils/aiSummaryGenerator';
import { generateRecommendedActions } from '../../utils/recommendedActionsGenerator';
import styles from './EngagementCard.module.css';

const TIMELINE_PHASES = [
  { label: 'Discovery', maxProgress: 15 },
  { label: 'Env Setup', maxProgress: 30 },
  { label: 'Design', maxProgress: 50 },
  { label: 'Prototype', maxProgress: 70 },
  { label: 'Testing', maxProgress: 90 },
  { label: 'Go Live', maxProgress: 100 },
];

const TYPE_TAGS = {
  'Business AI': ['AI Core', 'Business AI', 'HANA Cloud'],
  'SAP Build': ['SAP Build', 'Low-Code', 'Build Apps'],
  'CAP': ['CAP', 'Node.js', 'HANA Cloud'],
  'Integration Suite': ['Integration Suite', 'API Mgmt', 'Connectivity'],
  'SAP BTP Architecture': ['BTP', 'Architecture', 'Cloud Foundry'],
};

export default function EngagementCard({ engagement, onClose, onGenerateSummary }) {
  if (!engagement) return null;

  const risk = calculateRiskLevel(engagement);
  const currentPhase = getPhase(engagement.progress);
  const actions = generateRecommendedActions(engagement);
  const tags = TYPE_TAGS[engagement.engagementType] || [engagement.engagementType];

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress': return styles.inProgress;
      case 'Completed': return styles.completed;
      case 'Blocked': return styles.blocked;
      default: return styles.notStarted;
    }
  };

  const getTimelineStatus = (phase) => {
    const phaseIndex = TIMELINE_PHASES.findIndex(p => p.label === phase.label);
    const currentIndex = TIMELINE_PHASES.findIndex(p => p.label === currentPhase || 
      (currentPhase === 'Environment Setup' && p.label === 'Env Setup') ||
      (currentPhase === 'Solution Design' && p.label === 'Design'));

    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{engagement.customerName}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.panelContent}>
          {/* Health & Status */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Health & Status</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className={`${styles.statusBadge} ${getStatusClass(engagement.status)}`}>
                {engagement.status}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Risk: <strong style={{ color: risk === 'High' ? 'var(--color-danger)' : 'inherit' }}>{risk}</strong>
              </span>
            </div>
            <HealthBadge engagement={engagement} />
            <div style={{ marginTop: '0.6rem' }}>
              <ProgressBar progress={engagement.progress} status={engagement.status} />
            </div>
          </div>

          {/* Tags */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Tags</h4>
            <div className={styles.tags}>
              {tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Engagement Details */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Details</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Industry</div>
                <div className={styles.infoValue}>{engagement.industry}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Type</div>
                <div className={styles.infoValue}>{engagement.engagementType}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Owner</div>
                <div className={styles.infoValue}>{engagement.owner}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Phase</div>
                <div className={styles.infoValue}>{currentPhase}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Start</div>
                <div className={styles.infoValue}>{formatDate(engagement.startDate)}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>End</div>
                <div className={styles.infoValue}>{formatDate(engagement.endDate)}</div>
              </div>
            </div>
          </div>

          {/* Blockers */}
          {engagement.blockers && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Blockers</h4>
              <div className={styles.blockerBox}>{engagement.blockers}</div>
            </div>
          )}

          {/* Notes */}
          {engagement.notes && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Notes</h4>
              <div className={styles.notesBox}>{engagement.notes}</div>
            </div>
          )}

          {/* Timeline - Horizontal */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Journey</h4>
            <div className={styles.timeline}>
              {TIMELINE_PHASES.map((phase) => {
                const status = getTimelineStatus(phase);
                return (
                  <div key={phase.label} className={`${styles.timelineStep} ${styles[status]}`}>
                    <div className={styles.timelineConnector} />
                    <div className={`${styles.timelineDot} ${styles[status]}`}>
                      {status === 'completed' && <Check size={11} color="white" />}
                    </div>
                    <span className={`${styles.timelineLabel} ${styles[status]}`}>
                      {phase.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Recommended Actions</h4>
            <div className={styles.actionsList}>
              {actions.slice(0, 4).map((action, i) => (
                <div key={i} className={styles.actionItem}>
                  <span className={`${styles.actionPriority} ${styles[action.priority.toLowerCase()]}`}>
                    {action.priority}
                  </span>
                  <span className={styles.actionText}>{action.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary Button */}
          <div className={styles.section}>
            <button className={styles.aiBtn} onClick={() => onGenerateSummary(engagement)}>
              <Sparkles size={15} />
              Generate AI Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
