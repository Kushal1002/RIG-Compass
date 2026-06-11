import { BarChart3 } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>
          <BarChart3 size={18} color="white" />
        </div>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>RIG Engagement Tracker</h1>
          <p className={styles.subtitle}>SAP BTP Product Management – APJ Team</p>
        </div>
      </div>
      <div className={styles.headerRight} />
    </header>
  );
}
