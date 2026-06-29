import { calculateRiskLevel } from './aiSummaryGenerator';
import { calculateHealthScore, getHealthClassification } from './healthScore';

export function generateRecommendedActions(engagement) {
  const { status, progress, endDate } = engagement;
  const daysToEnd = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const actions = [];

  if (daysToEnd < 0 && status !== 'Completed') {
    actions.push({
      priority: 'Critical',
      action: 'Engagement is overdue — escalate immediately and agree revised timeline with customer',
      icon: 'alert-triangle'
    });
  }

  if (status === 'Blocked') {
    actions.push({
      priority: 'High',
      action: 'Escalate blocker to engagement owner and stakeholders',
      icon: 'alert'
    });
    actions.push({
      priority: 'High',
      action: 'Schedule stakeholder review meeting within 48 hours',
      icon: 'calendar'
    });
    actions.push({
      priority: 'Medium',
      action: 'Identify alternative paths to resolve dependency',
      icon: 'route'
    });
  }

  if (progress < 50 && status !== 'Not Started' && status !== 'Completed') {
    actions.push({
      priority: 'Medium',
      action: 'Review and validate project plan and milestones',
      icon: 'clipboard'
    });
    actions.push({
      priority: 'Medium',
      action: 'Increase follow-up frequency to bi-weekly',
      icon: 'repeat'
    });
  }

  if (daysToEnd <= 14 && daysToEnd >= 0 && progress < 90 && status !== 'Completed') {
    actions.push({
      priority: 'High',
      action: 'Conduct immediate risk review with project team',
      icon: 'shield'
    });
    actions.push({
      priority: 'High',
      action: 'Prioritize critical path tasks for next sprint',
      icon: 'target'
    });
  }

  if (daysToEnd <= 7 && daysToEnd >= 0 && status !== 'Completed') {
    actions.push({
      priority: 'Critical',
      action: 'Escalate to leadership — deadline imminent',
      icon: 'alert-triangle'
    });
  }

  if (status === 'Not Started' && daysToEnd <= 30) {
    actions.push({
      priority: 'Medium',
      action: 'Confirm all pre-requisites and resources are in place',
      icon: 'check-circle'
    });
    actions.push({
      priority: 'Low',
      action: 'Schedule kick-off meeting with customer',
      icon: 'calendar'
    });
  }

  if (progress >= 90 && status === 'In Progress') {
    actions.push({
      priority: 'Low',
      action: 'Begin knowledge transfer and documentation',
      icon: 'book'
    });
    actions.push({
      priority: 'Low',
      action: 'Plan customer success story and case study',
      icon: 'award'
    });
  }

  if (status === 'Completed') {
    actions.push({
      priority: 'Low',
      action: 'Develop reference case for future engagements',
      icon: 'star'
    });
    actions.push({
      priority: 'Low',
      action: 'Explore expansion opportunities with customer',
      icon: 'trending-up'
    });
  }

  if (actions.length === 0) {
    actions.push({
      priority: 'Low',
      action: 'Continue monitoring engagement health',
      icon: 'activity'
    });
  }

  return actions;
}
