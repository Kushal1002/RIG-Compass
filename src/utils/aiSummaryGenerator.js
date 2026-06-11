const summaryTemplates = {
  blocked: [
    "{customer} engagement is currently {progress}% complete and remains in a blocked state due to {blocker}. {phaseInfo} Immediate attention is recommended to resolve dependencies and prevent further delays. Overall engagement health is {health} with {riskLevel} risks.",
    "The {customer} project has stalled at {progress}% completion. The primary blocker — {blocker} — requires urgent escalation. {phaseInfo} Without resolution, the target end date of {endDate} is at risk. Recommend executive intervention to unblock progress.",
    "Critical attention needed for {customer}. Progress has halted at {progress}% due to {blocker}. {phaseInfo} The engagement team is unable to proceed until this dependency is resolved. Risk level: {riskLevel}."
  ],
  inProgress: [
    "{customer} engagement is progressing well at {progress}% completion. {phaseInfo} The team is on track to meet the target delivery date of {endDate}. {notesInfo} Overall engagement health is {health}.",
    "Good momentum on the {customer} engagement with {progress}% completion achieved. {phaseInfo} {notesInfo} No critical blockers identified. The engagement remains on schedule for {endDate} delivery.",
    "The {customer} project continues to advance steadily at {progress}% complete. {phaseInfo} Key activities are progressing as planned with delivery targeted for {endDate}. {notesInfo} Engagement health: {health}."
  ],
  completed: [
    "{customer} engagement has been successfully completed. All deliverables have been met and the solution is now in production. {notesInfo} This engagement demonstrates strong execution by the team led by {owner}.",
    "Successfully delivered the {customer} engagement. The project achieved all milestones and was completed on schedule. {notesInfo} Recommend leveraging this as a reference case for future {industry} engagements.",
    "The {customer} project is now complete with 100% of objectives achieved. {notesInfo} The {engagementType} solution is operational and the customer has confirmed satisfaction. Strong candidate for case study development."
  ],
  notStarted: [
    "{customer} engagement is scheduled to begin on {startDate}. {blockInfo} The engagement will focus on {engagementType} solutions for the {industry} sector. Target completion: {endDate}. {notesInfo}",
    "Pre-engagement phase for {customer}. Kick-off is planned for {startDate} with a {engagementType} focus. {blockInfo} {notesInfo} Ensure all prerequisites are met before the start date.",
    "The {customer} engagement is in planning phase with a scheduled start of {startDate}. {blockInfo} The scope covers {engagementType} implementation for {industry}. Expected delivery by {endDate}."
  ]
};

function getPhaseFromProgress(progress) {
  if (progress <= 15) return "Discovery";
  if (progress <= 30) return "Environment Setup";
  if (progress <= 50) return "Solution Design";
  if (progress <= 70) return "Prototype";
  if (progress <= 90) return "Testing";
  return "Go Live";
}

function getHealthFromProgress(progress, status) {
  if (status === "Blocked") return "critical";
  if (progress >= 70) return "strong";
  if (progress >= 40) return "moderate";
  return "developing";
}

function getRiskLevel(progress, status, endDate) {
  const daysToEnd = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));

  if (status === "Blocked" && progress < 50) return "high";
  if (status === "Blocked") return "high";
  if (daysToEnd <= 14 && progress < 90) return "high";
  if (progress < 70) return "medium";
  return "low";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function generateAISummary(engagement) {
  const {
    customerName,
    industry,
    engagementType,
    owner,
    status,
    progress,
    startDate,
    endDate,
    blockers,
    notes
  } = engagement;

  let templateKey;
  if (status === "Blocked") templateKey = "blocked";
  else if (status === "In Progress") templateKey = "inProgress";
  else if (status === "Completed") templateKey = "completed";
  else templateKey = "notStarted";

  const templates = summaryTemplates[templateKey];
  const template = templates[Math.floor(Math.random() * templates.length)];

  const currentPhase = getPhaseFromProgress(progress);
  const health = getHealthFromProgress(progress, status);
  const riskLevel = getRiskLevel(progress, status, endDate);

  const phaseInfo = progress > 0 && progress < 100
    ? `The team is currently in the ${currentPhase} phase.`
    : "";

  const notesInfo = notes ? notes.split(".")[0] + "." : "";
  const blockInfo = blockers ? `Note: ${blockers}.` : "No pre-engagement blockers identified.";

  let summary = template
    .replace(/{customer}/g, customerName)
    .replace(/{progress}/g, progress)
    .replace(/{blocker}/g, blockers || "unspecified dependencies")
    .replace(/{phaseInfo}/g, phaseInfo)
    .replace(/{health}/g, health)
    .replace(/{riskLevel}/g, riskLevel)
    .replace(/{endDate}/g, formatDate(endDate))
    .replace(/{startDate}/g, formatDate(startDate))
    .replace(/{notesInfo}/g, notesInfo)
    .replace(/{owner}/g, owner)
    .replace(/{industry}/g, industry)
    .replace(/{engagementType}/g, engagementType)
    .replace(/{blockInfo}/g, blockInfo);

  // Add recommendations based on context
  let recommendations = "\n\nRecommendations:\n";
  if (status === "Blocked") {
    recommendations += "• Escalate blocker to stakeholder management\n";
    recommendations += "• Schedule resolution meeting within 48 hours\n";
    recommendations += "• Identify alternative paths to maintain momentum";
  } else if (status === "In Progress" && progress < 50) {
    recommendations += "• Monitor progress velocity closely\n";
    recommendations += "• Ensure resource allocation is sufficient\n";
    recommendations += "• Validate timeline assumptions with customer";
  } else if (status === "In Progress" && progress >= 50) {
    recommendations += "• Continue current execution cadence\n";
    recommendations += "• Begin planning for knowledge transfer\n";
    recommendations += "• Document lessons learned for team reference";
  } else if (status === "Completed") {
    recommendations += "• Develop customer success story\n";
    recommendations += "• Explore expansion opportunities\n";
    recommendations += "• Share best practices with broader team";
  } else {
    recommendations += "• Confirm all pre-requisites are in place\n";
    recommendations += "• Finalize resource allocation\n";
    recommendations += "• Schedule kick-off meeting with customer";
  }

  return summary + recommendations;
}

export function calculateRiskLevel(engagement) {
  const { status, progress, endDate } = engagement;
  const daysToEnd = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));

  if (status === "Blocked" || (daysToEnd <= 14 && progress < 90)) {
    return "High";
  }
  if (progress < 70 && status === "In Progress") {
    return "Medium";
  }
  return "Low";
}

export function getPhase(progress) {
  return getPhaseFromProgress(progress);
}
