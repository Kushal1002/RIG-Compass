import { useState, useEffect } from 'react';
import { X, Clock, Building2 } from 'lucide-react';
import { generateAISummary } from '../../utils/aiSummaryGenerator';
import styles from './AISummaryModal.module.css';

export default function AISummaryModal({ engagement, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (engagement) {
      setLoading(true);
      // Simulate AI processing delay
      const timer = setTimeout(() => {
        const result = generateAISummary(engagement);
        setSummary(result);
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [engagement]);

  if (!engagement) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalIcon}>
              <img src="/301102_ai_white.png" alt="Joule" style={{ width: 14, height: 14, objectFit: 'contain' }} />
            </div>
            AI Engagement Summary
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.customerTag}>
            <Building2 size={12} />
            {engagement.customerName}
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingDots}>
                <span className={styles.loadingDot} />
                <span className={styles.loadingDot} />
                <span className={styles.loadingDot} />
              </div>
              <span className={styles.loadingText}>Generating executive summary...</span>
            </div>
          ) : (
            <>
              <div className={styles.summaryText}>{summary}</div>
              <div className={styles.summaryMeta}>
                <span className={styles.metaItem}>
                  <Clock size={12} />
                  Generated {new Date().toLocaleTimeString()}
                </span>
                <span className={styles.metaItem}>
                  <img src="/301102_ai_white.png" alt="Joule" style={{ width: 12, height: 12, objectFit: 'contain' }} />
                  AI-powered analysis
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
