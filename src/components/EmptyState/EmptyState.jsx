import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ title, description }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <SearchX size={28} />
      </div>
      <h3 className={styles.emptyTitle}>{title || 'No engagements found'}</h3>
      <p className={styles.emptyDescription}>
        {description || "Try adjusting your filters or search criteria to find what you're looking for."}
      </p>
    </div>
  );
}
