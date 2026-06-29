import { useMemo } from 'react';
import { FileText, Download, Clock } from 'lucide-react';
import { generateExecutiveReport, downloadReport } from '../../utils/executiveReportGenerator';
import styles from './ExecutiveReport.module.css';

export default function ExecutiveReport({ engagements }) {
  const report = useMemo(() => generateExecutiveReport(engagements), [engagements]);

  const handleDownload = () => {
    const date = new Date().toISOString().split('T')[0];
    downloadReport(report, `RIG_Executive_Report_${date}.txt`);
  };

  return (
    <div className={styles.reportPage}>
      <div className={styles.reportCard}>
        <div className={styles.reportHeader}>
          <div className={styles.reportHeaderLeft}>
            <div className={styles.reportIcon}>
              <FileText size={18} />
            </div>
            <div className={styles.reportTitleGroup}>
              <h2>Executive Report Generator</h2>
              <p>Auto-generated leadership summary</p>
            </div>
          </div>
          <button className={styles.downloadBtn} onClick={handleDownload}>
            <Download size={14} />
            Download Report
          </button>
        </div>

        <div className={styles.reportPreview}>
          <div className={styles.reportContent}>{report}</div>
        </div>

        <div className={styles.reportMeta}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} />
            Generated: {new Date().toLocaleString()}
          </span>
          <span>Format: Plain Text (.txt)</span>
        </div>
      </div>
    </div>
  );
}
