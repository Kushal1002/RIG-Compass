import { calculateRiskLevel } from './aiSummaryGenerator';
import { calculateHealthScore } from './healthScore';

/**
 * Generate dynamic AI insights from engagement data
 */
export function generateAIInsights(engagements) {
  const insights = [];

  // Blocked engagements
  const blocked = engagements.filter(e => e.status === 'Blocked');
  if (blocked.length > 0) {
    insights.push({
      id: 'blocked',
      icon: 'alert-circle',
      insight: `${blocked.length} engagement${blocked.length > 1 ? 's are' : ' is'} currently blocked and require${blocked.length === 1 ? 's' : ''} immediate attention.`,
      impact: 'High',
      category: 'Risk'
    });
  }

  // At-risk timeline
  const atRisk = engagements.filter(e => {
    const daysToEnd = Math.ceil((new Date(e.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysToEnd <= 30 && e.progress < 80 && e.status !== 'Completed';
  });
  if (atRisk.length > 0) {
    insights.push({
      id: 'timeline-risk',
      icon: 'clock',
      insight: `${atRisk.length} project${atRisk.length > 1 ? 's are' : ' is'} likely to miss delivery timelines based on current velocity.`,
      impact: 'High',
      category: 'Timeline'
    });
  }

  // Best performing engagement type
  const typeProgress = {};
  const typeCounts = {};
  engagements.forEach(e => {
    typeProgress[e.engagementType] = (typeProgress[e.engagementType] || 0) + e.progress;
    typeCounts[e.engagementType] = (typeCounts[e.engagementType] || 0) + 1;
  });
  const typeAvg = Object.entries(typeProgress).map(([type, total]) => ({
    type,
    avg: Math.round(total / typeCounts[type])
  }));
  const bestType = typeAvg.sort((a, b) => b.avg - a.avg)[0];
  if (bestType) {
    insights.push({
      id: 'best-type',
      icon: 'trending-up',
      insight: `${bestType.type} engagements show the highest average progress at ${bestType.avg}%.`,
      impact: 'Low',
      category: 'Performance'
    });
  }

  // Industry volume
  const industryCounts = {};
  engagements.forEach(e => {
    industryCounts[e.industry] = (industryCounts[e.industry] || 0) + 1;
  });
  const topIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0];
  if (topIndustry) {
    insights.push({
      id: 'top-industry',
      icon: 'building',
      insight: `${topIndustry[0]} customers have the highest engagement volume with ${topIndustry[1]} active projects.`,
      impact: 'Medium',
      category: 'Portfolio'
    });
  }

  // Average completion
  const activeEngagements = engagements.filter(e => e.status !== 'Not Started');
  const avgProgress = activeEngagements.length > 0
    ? Math.round(activeEngagements.reduce((s, e) => s + e.progress, 0) / activeEngagements.length)
    : 0;
  insights.push({
    id: 'avg-completion',
    icon: 'bar-chart',
    insight: `Average project completion rate across active engagements is ${avgProgress}%.`,
    impact: avgProgress < 50 ? 'Medium' : 'Low',
    category: 'Performance'
  });

  // Health distribution
  const healthScores = engagements.map(e => calculateHealthScore(e));
  const criticalCount = healthScores.filter(s => s < 50).length;
  if (criticalCount > 0) {
    insights.push({
      id: 'critical-health',
      icon: 'heart',
      insight: `${criticalCount} engagement${criticalCount > 1 ? 's have' : ' has'} critical health scores and need${criticalCount === 1 ? 's' : ''} immediate intervention.`,
      impact: 'High',
      category: 'Health'
    });
  }

  // Workload imbalance
  const ownerCounts = {};
  engagements.filter(e => e.status === 'In Progress').forEach(e => {
    ownerCounts[e.owner] = (ownerCounts[e.owner] || 0) + 1;
  });
  const ownerEntries = Object.entries(ownerCounts);
  if (ownerEntries.length >= 2) {
    const max = Math.max(...ownerEntries.map(e => e[1]));
    const min = Math.min(...ownerEntries.map(e => e[1]));
    if (max - min >= 3) {
      insights.push({
        id: 'workload-imbalance',
        icon: 'users',
        insight: `Workload imbalance detected — gap of ${max - min} engagements between most and least loaded consultants.`,
        impact: 'Medium',
        category: 'Capacity'
      });
    }
  }

  // Near completion
  const nearComplete = engagements.filter(e => e.progress >= 85 && e.status === 'In Progress');
  if (nearComplete.length > 0) {
    insights.push({
      id: 'near-complete',
      icon: 'check-circle',
      insight: `${nearComplete.length} engagement${nearComplete.length > 1 ? 's are' : ' is'} near completion (85%+) and should be prioritized for closure.`,
      impact: 'Low',
      category: 'Delivery'
    });
  }

  return insights;
}
