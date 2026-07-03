import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import styles from '../EditEngagementModal/EditEngagementModal.module.css';

const STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Completed'];
const INDUSTRIES = ['Banking', 'Manufacturing', 'Professional Services', 'Retail', 'Utilities', 'Other'];
const REGIONS = ['APJ', 'Global', 'EMEA', 'Americas'];
const ENGAGEMENT_TYPES = ['Joule Agent and Skill', 'SAP Build', 'CAP', 'Integration Suite', 'SAP BTP Architecture', 'Business AI'];
const OWNERS = ['Rahul Mehta', 'Sarah Chen', 'Amir Khan', 'Priya Sharma', 'David Park'];

const empty = {
  customerName: '',
  projectName: '',
  industry: 'Banking',
  region: 'APJ',
  engagementType: 'Joule Agent and Skill',
  owner: 'Rahul Mehta',
  status: 'Not Started',
  progress: 0,
  startDate: '',
  endDate: '',
  blockers: '',
  notes: '',
};

export default function AddEngagementModal({ onAdd, onClose }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.projectName.trim()) e.projectName = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.endDate) e.endDate = 'Required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = 'Must be after start date';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      ...form,
      progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width: 560, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>New Engagement</h3>
            <span className={styles.customer}>Fill in the details below to add a new project</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={styles.body}>
          {/* Row: Customer + Project */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Customer Name *</label>
              <input
                className={styles.input}
                style={errors.customerName ? { borderColor: 'var(--color-danger)' } : {}}
                value={form.customerName}
                placeholder="e.g. Tata Steel"
                onChange={e => set('customerName', e.target.value)}
              />
              {errors.customerName && <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>{errors.customerName}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Project Name *</label>
              <input
                className={styles.input}
                style={errors.projectName ? { borderColor: 'var(--color-danger)' } : {}}
                value={form.projectName}
                placeholder="e.g. Sales Order Agent"
                onChange={e => set('projectName', e.target.value)}
              />
              {errors.projectName && <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>{errors.projectName}</span>}
            </div>
          </div>

          {/* Row: Industry + Region */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Industry</label>
              <select className={styles.select} value={form.industry} onChange={e => set('industry', e.target.value)}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Region</label>
              <select className={styles.select} value={form.region} onChange={e => set('region', e.target.value)}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Engagement Type + Owner */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Engagement Type</label>
              <select className={styles.select} value={form.engagementType} onChange={e => set('engagementType', e.target.value)}>
                {ENGAGEMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Owner</label>
              <select className={styles.select} value={form.owner} onChange={e => set('owner', e.target.value)}>
                {OWNERS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Status + Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Progress (%)</label>
              <input
                type="number"
                className={styles.input}
                value={form.progress}
                min={0} max={100}
                onChange={e => set('progress', e.target.value)}
              />
            </div>
          </div>

          {/* Row: Start + End Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label className={styles.label}>Start Date *</label>
              <input
                type="date"
                className={styles.input}
                style={errors.startDate ? { borderColor: 'var(--color-danger)' } : {}}
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
              />
              {errors.startDate && <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>{errors.startDate}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Date *</label>
              <input
                type="date"
                className={styles.input}
                style={errors.endDate ? { borderColor: 'var(--color-danger)' } : {}}
                value={form.endDate}
                onChange={e => set('endDate', e.target.value)}
              />
              {errors.endDate && <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>{errors.endDate}</span>}
            </div>
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
          <button className={styles.saveBtn} onClick={handleAdd}>
            <Plus size={14} />
            Add Engagement
          </button>
        </div>
      </div>
    </div>
  );
}
