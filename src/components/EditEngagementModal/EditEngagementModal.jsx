import { useState } from 'react';
import { X, Save } from 'lucide-react';
import styles from './EditEngagementModal.module.css';

const STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Completed'];

export default function EditEngagementModal({ engagement, onSave, onClose }) {
  const [form, setForm] = useState({
    status: engagement.status,
    progress: engagement.progress,
    blockers: engagement.blockers || '',
    notes: engagement.notes || '',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const progress = Math.min(100, Math.max(0, Number(form.progress) || 0));
    onSave(engagement.id, { ...form, progress });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>Edit Engagement</h3>
            <span className={styles.customer}>{engagement.customerName}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={form.status}
              onChange={e => set('status', e.target.value)}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Progress (%)</label>
            <input
              type="number"
              className={styles.input}
              value={form.progress}
              min={0}
              max={100}
              onChange={e => set('progress', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Blockers</label>
            <textarea
              className={styles.textarea}
              value={form.blockers}
              placeholder="Describe any blockers..."
              maxLength={500}
              onChange={e => set('blockers', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <textarea
              className={styles.textarea}
              value={form.notes}
              placeholder="Add notes..."
              maxLength={500}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
