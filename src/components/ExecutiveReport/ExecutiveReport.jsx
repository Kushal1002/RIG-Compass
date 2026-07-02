import { Clock, Presentation } from 'lucide-react';
import styles from './ExecutiveReport.module.css';

export default function ExecutiveReport() {
  const handleDownloadPpt = () => {
    const a = document.createElement('a');
    a.href = '/SAP_RIG_Portfolio.pptx';
    a.download = 'SAP_RIG_Portfolio.pptx';
    a.click();
  };

  return (
    <div className={styles.reportPage}>
      <div className={styles.reportCard}>
        <div className={styles.reportHeader}>
          <div className={styles.reportHeaderLeft}>
            <div className={styles.reportIcon}>
              <img src="/299078_manager-insight_blue.svg" alt="Reports" style={{ width: 20, height: 20, objectFit: 'contain' }} />
            </div>
            <div className={styles.reportTitleGroup}>
              <h2>Executive Report</h2>
              <p>SAP RIG Portfolio Presentation</p>
            </div>
          </div>
          <div className={styles.downloadGroup}>
            <button className={styles.downloadBtnPpt} onClick={handleDownloadPpt}>
              <Presentation size={14} />
              Download PPT
            </button>
          </div>
        </div>

        <div className={styles.reportMeta}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={12} />
            {new Date().toLocaleString()}
          </span>
          <span>Format: PowerPoint (.pptx)</span>
        </div>
      </div>
    </div>
  );
}
