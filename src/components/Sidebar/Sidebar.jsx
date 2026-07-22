import { useState } from 'react';
import {
  Menu,
  ChevronLeft
} from 'lucide-react';
import styles from './Sidebar.module.css';

const JouleIcon = () => <img src="/301104_da-2_blue.svg" alt="Joule" className={styles.jouleNavIcon} />;
const ReportIcon = () => <img src="/299078_manager-insight_blue.svg" alt="Reports" className={styles.jouleNavIcon} />;
const SettingsIcon = () => <img src="/298772_action-settings_blue.svg" alt="Settings" className={styles.jouleNavIcon} />;

const ProposalsIcon = () => <img src="/298849_group_blue.svg" alt="Proposals" className={styles.jouleNavIcon} />;
const ProjectsIcon  = () => <img src="/299449_bbyd-dashboard_blue.svg" alt="Projects" className={styles.jouleNavIcon} />;

const NAV_ITEMS = [
  { id: 'proposals', label: 'Proposals', icon: ProposalsIcon, section: 'main' },
  { id: 'projects',  label: 'Projects',  icon: ProjectsIcon,  section: 'main' },
  { id: 'copilot', label: 'Joule Work', icon: JouleIcon, section: 'ai' },
  { id: 'reports', label: 'Reports', icon: ReportIcon, section: 'tools' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, section: 'tools' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    { key: 'main', label: 'Navigation' },
    { key: 'ai', label: 'AI & Intelligence' },
    { key: 'tools', label: 'Tools' },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
      )}

      <nav className={`${styles.sidebar} ${mobileOpen ? styles.open : ''} ${collapsed ? styles.collapsed : ''}`}>
        <button className={styles.collapseBtn} onClick={onToggleCollapse} aria-label="Collapse sidebar">
          <ChevronLeft size={20} />
        </button>

        {sections.map((section) => (
          <div key={section.key}>
            <div className={styles.sectionLabel}>{section.label}</div>
            <ul className={styles.navList}>
              {NAV_ITEMS.filter(item => item.section === section.key).map((item) => (
                <li key={item.id} className={styles.navItem}>
                  <button
                    className={`${styles.navLink} ${activePage === item.id ? styles.active : ''}`}
                    onClick={() => handleNav(item.id)}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={styles.navIcon}>
                      <item.icon size={17} />
                    </span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.sidebarFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.footerAvatar}>KK</div>
            <div className={styles.footerText}>
              <div className={styles.footerName}>Kushal Kumar</div>
              <div className={styles.footerRole}>RIG APJ Team</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
