import styles from './Header.module.css';

export default function Header({ onNavigate }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.logoBtn} onClick={() => onNavigate('proposals')} aria-label="Go to proposals">
          <div className={styles.logo}>
            <img src="/SAP_R_grad_scrn.png" alt="SAP" className={styles.sapLogo} />
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>RIG Project Tooling</h1>
          </div>
        </button>
      </div>
    </header>
  );
}
