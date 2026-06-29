import { calculateRiskLevel } from './aiSummaryGenerator';

/**
 * Calculate engagement health score (0-100)
 */
export function calculateHealthScore(engagement) {
  const { status, progress, endDate, blockers } = engagement;
  let score = 100;

  // Risk penalties
  const risk = calculateRiskLevel(engagement);
  if (risk === 'High') score -= 35;
  else if (risk === 'Medium') score -= 15;

  // Status penalties
  if (status === 'Blocked') score -= 25;
  else if (status === 'In Progress') score -= 5;

  // Timeline penalties
  const daysToEnd = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysToEnd < 0 && status !== 'Completed') score -= 30;
  else if (daysToEnd <= 7 && progress < 50) score -= 20;
  else if (daysToEnd <= 14 && progress < 70) score -= 15;

  // Blocker penalties
  if (blockers) {
    const blockerCount = blockers.split('.').filter(b => b.trim()).length;
    score -= blockerCount * 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Classify health score into categories
 */
export function getHealthClassification(score) {
  if (score >= 90) return { label: 'Healthy', color: '#188918', bg: '#e6f4e6' };
  if (score >= 70) return { label: 'Stable', color: '#0070f2', bg: '#e8f4fd' };
  if (score >= 50) return { label: 'Needs Attention', color: '#e76500', bg: '#fef3e6' };
  return { label: 'Critical', color: '#cc1919', bg: '#fce6e6' };
}
