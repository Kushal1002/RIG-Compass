import styles from './Header.module.css';

export default function Header({ isRegional, onToggleRegion, onNavigate }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.logoBtn} onClick={() => onNavigate('dashboard')} aria-label="Go to dashboard">
          <div className={styles.logo}>
            <img src="/SAP_R_grad_scrn.png" alt="SAP" className={styles.sapLogo} />
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>RIG Project Tooling</h1>
          </div>
        </button>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleOption} ${!isRegional ? styles.toggleActive : ''}`}
            onClick={() => isRegional && onToggleRegion()}
          >
            Global
          </button>
          <button
            className={`${styles.toggleOption} ${isRegional ? styles.toggleActive : ''}`}
            onClick={() => !isRegional && onToggleRegion()}
          >
            Regional
          </button>
        </div>
      </div>
    </header>
  );
}
