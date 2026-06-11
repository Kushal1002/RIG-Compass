import styles from './Settings.module.css';

export default function Settings() {
  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsCard}>
        <h2 className={styles.settingsTitle}>Settings</h2>

        <div className={styles.settingItem}>
          <div>
            <div className={styles.settingLabel}>Application Version</div>
            <div className={styles.settingDesc}>RIG Engagement Tracker v2.0</div>
          </div>
        </div>

        <div className={styles.settingItem}>
          <div>
            <div className={styles.settingLabel}>Team</div>
            <div className={styles.settingDesc}>SAP BTP Product Management – APJ</div>
          </div>
        </div>

        <div className={styles.settingItem}>
          <div>
            <div className={styles.settingLabel}>Data Source</div>
            <div className={styles.settingDesc}>Local mock data (14 engagements)</div>
          </div>
        </div>

        <div className={styles.settingItem}>
          <div>
            <div className={styles.settingLabel}>Architecture</div>
            <div className={styles.settingDesc}>Dashboard (Portfolio View) + Engagements (Operational Workspace)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
