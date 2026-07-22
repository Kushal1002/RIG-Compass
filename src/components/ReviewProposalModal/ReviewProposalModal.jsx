import { useState } from 'react';
import { X, CheckCircle, XCircle, Building2, DollarSign, User, MessageCircleQuestion } from 'lucide-react';
import styles from './ReviewProposalModal.module.css';

const STATUS_COLORS = {
  'Under Review':    { bg: '#fff7ed', color: '#b25a00', border: '#fed7aa' },
  'Accepted':        { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  'Rejected':        { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Info Requested':  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
};

export default function ReviewProposalModal({ proposal, currentUser, onAccept, onReject, onRequestInfo, onClose }) {
  const [action, setAction]   = useState(null); // 'accept' | 'reject' | 'info'
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statusStyle = STATUS_COLORS[proposal.proposalStatus] || STATUS_COLORS['Under Review'];
  const isReviewable = proposal.proposalStatus === 'Under Review' || proposal.proposalStatus === 'Info Requested';

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      if (action === 'accept') {
        await onAccept(proposal, comment);
      } else if (action === 'reject') {
        await onReject(proposal, comment);
      } else {
        await onRequestInfo(proposal, comment);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerTitle}>{proposal.projectName || '—'}</div>
            <div className={styles.headerSub}>{proposal.customerName} · Submitted by {proposal.submittedBy || '—'}</div>
          </div>
          <span className={styles.statusBadge} style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}>
            {proposal.proposalStatus}
          </span>
          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div className={styles.body}>

          {/* Customer section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}><Building2 size={13} /> Customer</div>
            <div className={styles.infoGrid}>
              <InfoItem label="Customer Name"   value={proposal.customerName} />
              <InfoItem label="Industry"        value={proposal.industry} />
              <InfoItem label="Region"          value={proposal.region} />
              <InfoItem label="Country"         value={proposal.country} />
              <InfoItem label="Segment"         value={proposal.customerSegment} />
              <InfoItem label="Account Team"    value={proposal.accountTeam} />
            </div>
          </div>

          {/* Opportunity section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}><DollarSign size={13} /> Opportunity</div>
            <div className={styles.infoGrid}>
              <div className={`${styles.infoItem} ${styles.span2}`}>
                <div className={styles.infoLabel}>Problem Statement</div>
                <div className={styles.infoValue} style={{ fontWeight: 400, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {proposal.problemStatement || '—'}
                </div>
              </div>
              <InfoItem label="Line of Business"    value={proposal.lineOfBusiness} />
              <InfoItem label="Timeline"            value={proposal.timeline} />
              <InfoItem label="Priority"            value={proposal.priority} />
              <InfoItem label="Business Value"      value={proposal.businessValue != null ? `${proposal.businessValue}/100` : undefined} />
              <InfoItem label="Strategic Importance" value={proposal.strategicImportance != null ? `${proposal.strategicImportance}/100` : undefined} />
              <InfoItem label="Reference Customer"  value={proposal.isReferenceCustomer ? 'Yes' : 'No'} />
            </div>
            {proposal.jouleCapabilities && (() => {
              try {
                const caps = JSON.parse(proposal.jouleCapabilities);
                if (caps.length > 0) return (
                  <div className={styles.capsWrap}>
                    <div className={styles.infoLabel} style={{ marginBottom: 6 }}>Joule Capabilities</div>
                    <div className={styles.chips}>
                      {caps.map(c => <span key={c} className={styles.chip}>{c}</span>)}
                    </div>
                  </div>
                );
              } catch { return null; }
            })()}
          </div>

          {/* Contacts section */}
          {(proposal.sponsorName || proposal.techContactName) && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}><User size={13} /> Contacts</div>
              <div className={styles.contactGrid}>
                {proposal.sponsorName && (
                  <div className={styles.contactCard}>
                    <div className={styles.contactAvatar}>{proposal.sponsorName.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div className={styles.contactName}>{proposal.sponsorName}</div>
                      <div className={styles.contactRole}>Customer Sponsor{proposal.sponsorTitle ? ` · ${proposal.sponsorTitle}` : ''}</div>
                      {proposal.sponsorEmail && <div className={styles.contactMeta}>{proposal.sponsorEmail}{proposal.sponsorPhone ? ` · ${proposal.sponsorPhone}` : ''}</div>}
                    </div>
                  </div>
                )}
                {proposal.techContactName && (
                  <div className={styles.contactCard}>
                    <div className={styles.contactAvatar} style={{ background: 'linear-gradient(135deg,#1a8a4a,#4db8ff)' }}>{proposal.techContactName.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div className={styles.contactName}>{proposal.techContactName}</div>
                      <div className={styles.contactRole}>Technical Contact{proposal.techContactTitle ? ` · ${proposal.techContactTitle}` : ''}</div>
                      {proposal.techContactEmail && <div className={styles.contactMeta}>{proposal.techContactEmail}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Existing review comment (if already reviewed) */}
          {!isReviewable && proposal.reviewComment && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Review Comment</div>
              <div className={styles.existingComment}>
                <div className={styles.existingCommentMeta}>
                  {proposal.reviewedBy && <span>{proposal.reviewedBy}</span>}
                  {proposal.reviewedAt && <span>{new Date(proposal.reviewedAt).toLocaleString()}</span>}
                </div>
                <div className={styles.existingCommentText}>{proposal.reviewComment}</div>
              </div>
            </div>
          )}

          {/* Review action (only for Under Review / Info Requested) */}
          {isReviewable && (
            <div className={styles.reviewSection}>
              {!action ? (
                <>
                  <div className={styles.reviewSectionTitle}>Review Decision</div>
                  <div className={styles.actionBtns}>
                    <button className={styles.acceptBtn} onClick={() => setAction('accept')}>
                      <CheckCircle size={15} /> Accept Proposal
                    </button>
                    <button className={styles.infoBtn} onClick={() => setAction('info')}>
                      <MessageCircleQuestion size={15} /> Request Info
                    </button>
                    <button className={styles.rejectBtn} onClick={() => setAction('reject')}>
                      <XCircle size={15} /> Reject Proposal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.reviewSectionTitle} style={{
                    color: action === 'accept' ? '#15803d' : action === 'info' ? '#1d4ed8' : '#dc2626'
                  }}>
                    {action === 'accept' && <><CheckCircle size={14} /> Accepting proposal</>}
                    {action === 'info'   && <><MessageCircleQuestion size={14} /> Requesting more information</>}
                    {action === 'reject' && <><XCircle size={14} /> Rejecting proposal</>}
                  </div>
                  <textarea
                    className={styles.commentBox}
                    placeholder={
                      action === 'accept' ? 'Optional: add a note for the team…' :
                      action === 'info'   ? 'Specify what additional information is needed…' :
                                           'Please provide a reason for rejection…'
                    }
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className={styles.confirmRow}>
                    <button className={styles.cancelActionBtn} onClick={() => { setAction(null); setComment(''); }}>
                      Back
                    </button>
                    <button
                      className={
                        action === 'accept' ? styles.confirmAcceptBtn :
                        action === 'info'   ? styles.confirmInfoBtn :
                                             styles.confirmRejectBtn
                      }
                      onClick={handleConfirm}
                      disabled={submitting || ((action === 'reject' || action === 'info') && !comment.trim())}
                    >
                      {submitting ? 'Processing…' :
                        action === 'accept' ? 'Confirm & Create Engagement' :
                        action === 'info'   ? 'Send Request' :
                                             'Confirm Rejection'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className={styles.infoItem}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value || '—'}</div>
    </div>
  );
}
