import { calculateRiskLevel } from './aiSummaryGenerator';
import { calculateHealthScore } from './healthScore';

/**
 * Engagement Copilot - intent detection and response generation
 */
export function processCopilotQuery(query, engagements) {
  const q = query.toLowerCase().trim();

  // Intent: Blocked projects
  if (q.includes('block') || q.includes('stuck') || q.includes('stalled')) {
    const blocked = engagements.filter(e => e.status === 'Blocked');
    if (blocked.length === 0) {
      return { text: 'Great news! There are currently no blocked engagements in the pipeline.', data: [] };
    }
    let response = `${blocked.length} engagement${blocked.length > 1 ? 's' : ''} currently blocked:\n\n`;
    blocked.forEach((e, i) => {
      response += `${i + 1}. **${e.customerName}** — ${e.blockers || 'No blocker details provided'}\n`;
    });
    response += `\nRecommend escalating these to remove dependencies promptly.`;
    return { text: response, data: blocked };
  }

  // Intent: Risk
  if (q.includes('risk') || q.includes('danger') || q.includes('critical')) {
    const highRisk = engagements.filter(e => calculateRiskLevel(e) === 'High');
    if (highRisk.length === 0) {
      return { text: 'No high-risk engagements detected at this time.', data: [] };
    }
    let response = `${highRisk.length} high-risk engagement${highRisk.length > 1 ? 's' : ''} identified:\n\n`;
    highRisk.forEach((e, i) => {
      const score = calculateHealthScore(e);
      response += `${i + 1}. **${e.customerName}** — Health: ${score}/100, Progress: ${e.progress}%, Status: ${e.status}\n`;
    });
    response += `\nThese engagements require immediate leadership attention and intervention.`;
    return { text: response, data: highRisk };
  }

  // Intent: Workload
  if (q.includes('workload') || q.includes('capacity') || q.includes('load') || q.includes('team')) {
    const ownerCounts = {};
    engagements.filter(e => e.status === 'In Progress' || e.status === 'Blocked').forEach(e => {
      ownerCounts[e.owner] = (ownerCounts[e.owner] || 0) + 1;
    });
    const sorted = Object.entries(ownerCounts).sort((a, b) => b[1] - a[1]);
    let response = `Team workload summary (active + blocked engagements):\n\n`;
    sorted.forEach(([owner, count]) => {
      const status = count >= 6 ? '🔴 Overloaded' : count >= 3 ? '🟡 Balanced' : '🟢 Underutilized';
      response += `• **${owner}** — ${count} engagement${count > 1 ? 's' : ''} (${status})\n`;
    });
    const avg = sorted.length > 0 ? (sorted.reduce((s, e) => s + e[1], 0) / sorted.length).toFixed(1) : 0;
    response += `\nAverage: ${avg} engagements per consultant.`;
    return { text: response, data: sorted };
  }

  // Intent: Business AI / specific type
  if (q.includes('business ai') || q.includes('ai project')) {
    const aiProjects = engagements.filter(e => e.engagementType === 'Business AI');
    let response = `${aiProjects.length} Business AI engagement${aiProjects.length > 1 ? 's' : ''} in portfolio:\n\n`;
    aiProjects.forEach((e, i) => {
      response += `${i + 1}. **${e.customerName}** — ${e.status}, ${e.progress}% complete\n`;
    });
    const avgProg = aiProjects.length > 0 ? Math.round(aiProjects.reduce((s, e) => s + e.progress, 0) / aiProjects.length) : 0;
    response += `\nAverage progress: ${avgProg}%.`;
    return { text: response, data: aiProjects };
  }

  // Intent: Near completion
  if (q.includes('complet') || q.includes('finish') || q.includes('done') || q.includes('near')) {
    const nearComplete = engagements.filter(e => e.progress >= 80 && e.status === 'In Progress');
    if (nearComplete.length === 0) {
      return { text: 'No engagements are currently near completion (80%+).', data: [] };
    }
    let response = `${nearComplete.length} engagement${nearComplete.length > 1 ? 's' : ''} near completion:\n\n`;
    nearComplete.forEach((e, i) => {
      response += `${i + 1}. **${e.customerName}** — ${e.progress}% (${e.engagementType})\n`;
    });
    response += `\nThese should be prioritized for Go-Live readiness.`;
    return { text: response, data: nearComplete };
  }

  // Intent: Attention / this week
  if (q.includes('attention') || q.includes('week') || q.includes('urgent') || q.includes('priority')) {
    const needsAttention = engagements.filter(e => {
      const score = calculateHealthScore(e);
      return score < 70 && e.status !== 'Completed';
    });
    if (needsAttention.length === 0) {
      return { text: 'All engagements are in good health this week. No urgent items.', data: [] };
    }
    let response = `${needsAttention.length} engagement${needsAttention.length > 1 ? 's' : ''} need attention this week:\n\n`;
    needsAttention.forEach((e, i) => {
      const score = calculateHealthScore(e);
      response += `${i + 1}. **${e.customerName}** — Health: ${score}/100, Status: ${e.status}\n`;
    });
    return { text: response, data: needsAttention };
  }

  // Intent: Summary / overview
  if (q.includes('summary') || q.includes('overview') || q.includes('status') || q.includes('how')) {
    const active = engagements.filter(e => e.status === 'In Progress').length;
    const blocked = engagements.filter(e => e.status === 'Blocked').length;
    const completed = engagements.filter(e => e.status === 'Completed').length;
    const notStarted = engagements.filter(e => e.status === 'Not Started').length;
    const avgProgress = Math.round(engagements.reduce((s, e) => s + e.progress, 0) / engagements.length);
    let response = `Portfolio Overview:\n\n`;
    response += `• **Total Engagements:** ${engagements.length}\n`;
    response += `• **Active:** ${active} | **Blocked:** ${blocked} | **Completed:** ${completed} | **Not Started:** ${notStarted}\n`;
    response += `• **Average Progress:** ${avgProgress}%\n\n`;
    if (blocked > 0) response += `⚠️ ${blocked} blocked engagement${blocked > 1 ? 's' : ''} require${blocked === 1 ? 's' : ''} immediate action.`;
    return { text: response, data: [] };
  }

  // Intent: specific customer search
  const matchingCustomers = engagements.filter(e => e.customerName.toLowerCase().includes(q));
  if (matchingCustomers.length > 0) {
    const e = matchingCustomers[0];
    const score = calculateHealthScore(e);
    let response = `**${e.customerName}**\n\n`;
    response += `• Industry: ${e.industry}\n`;
    response += `• Type: ${e.engagementType}\n`;
    response += `• Owner: ${e.owner}\n`;
    response += `• Status: ${e.status}\n`;
    response += `• Progress: ${e.progress}%\n`;
    response += `• Health Score: ${score}/100\n`;
    if (e.blockers) response += `• Blockers: ${e.blockers}\n`;
    return { text: response, data: matchingCustomers };
  }

  // Fallback
  return {
    text: `I can help you with information about your engagement portfolio. Try asking about:\n\n• Blocked projects\n• High-risk engagements\n• Team workload\n• Near completion\n• Business AI projects\n• What needs attention this week\n\nOr search for a specific customer name.`,
    data: []
  };
}
