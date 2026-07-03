import { Trash2, X } from 'lucide-react';
import styles from './DeleteConfirmModal.module.css';

export default function DeleteConfirmModal({ engagement, onConfirm, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <Trash2 size={18} />
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>Delete Engagement</h3>
          <p className={styles.message}>
            Are you sure you want to delete <strong>{engagement.customerName}</strong>
            {engagement.projectName && <> — {engagement.projectName}</>}?
            This action cannot be undone.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={() => { onConfirm(engagement.id); onClose(); }}>
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
