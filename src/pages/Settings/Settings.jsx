import { useState, useEffect } from 'react';
import { User, Briefcase, Users, Save, X, Pencil, Info, Layers, Database, Tag } from 'lucide-react';
import styles from './Settings.module.css';

const PROFILE_KEY = 'rig_user_profile';

const defaultProfile = {
  name: 'Kushal Kumar',
  role: 'RIG Architect',
  team: 'SAP BTP RIG',
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultProfile;
}

export default function Settings() {
  const [profile, setProfile] = useState(loadProfile);
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const handleSave = () => {
    setProfile(draft);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(draft));
    setEditing(false);
    setSaved(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Manage your profile and app information</p>
      </div>

      <div className={styles.sections}>
        {/* User Profile */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrap}>
              <User size={15} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>User Profile</h2>
              <p className={styles.cardDesc}>Your name and role shown across the app</p>
            </div>
            {!editing && (
              <button className={styles.editBtn} onClick={() => { setDraft(profile); setEditing(true); }}>
                <Pencil size={13} /> Edit
              </button>
            )}
          </div>

          <div className={styles.fieldList}>
            <div className={styles.field}>
              <div className={styles.fieldIcon}><User size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Full Name</label>
                {editing ? (
                  <input
                    className={styles.input}
                    value={draft.name}
                    onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                ) : (
                  <span className={styles.fieldValue}>{profile.name}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldIcon}><Briefcase size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Role</label>
                {editing ? (
                  <input
                    className={styles.input}
                    value={draft.role}
                    onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
                    placeholder="Your role"
                  />
                ) : (
                  <span className={styles.fieldValue}>{profile.role}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldIcon}><Users size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Team</label>
                {editing ? (
                  <input
                    className={styles.input}
                    value={draft.team}
                    onChange={e => setDraft(d => ({ ...d, team: e.target.value }))}
                    placeholder="Your team"
                  />
                ) : (
                  <span className={styles.fieldValue}>{profile.team}</span>
                )}
              </div>
            </div>
          </div>

          {editing && (
            <div className={styles.editActions}>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                <X size={13} /> Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                <Save size={13} /> Save Changes
              </button>
            </div>
          )}

          {saved && (
            <div className={styles.savedBanner}>Profile saved successfully</div>
          )}
        </section>

        {/* About */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrap}>
              <Info size={15} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>About</h2>
              <p className={styles.cardDesc}>Application and environment details</p>
            </div>
            <span className={styles.versionBadge}>v1.0</span>
          </div>

          <div className={styles.fieldList}>
            <div className={styles.field}>
              <div className={styles.fieldIcon}><Tag size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Application</label>
                <span className={styles.fieldValue}>RIG Project Tooling</span>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldIcon}><Users size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Team</label>
                <span className={styles.fieldValue}>SAP BTP RIG</span>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldIcon}><Database size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Data Source</label>
                <span className={styles.fieldValue}>Local storage (mock data)</span>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldIcon}><Layers size={13} /></div>
              <div className={styles.fieldBody}>
                <label className={styles.fieldLabel}>Architecture</label>
                <span className={styles.fieldValue}>Dashboard (Portfolio View) · Engagements (Operational Workspace)</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
