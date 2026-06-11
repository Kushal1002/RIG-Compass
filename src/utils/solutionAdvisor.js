/**
 * SAP BTP Solution Advisor - Rule-based recommendation engine
 */

const solutionMap = {
  Banking: {
    'Customer Support': {
      services: ['SAP AI Core', 'SAP Build Process Automation', 'SAP Conversational AI', 'SAP BTP Connectivity'],
      reasoning: 'Banking customer support benefits from AI-powered chatbots for query resolution, process automation for case routing, and secure connectivity to core banking systems.',
      benefits: ['50% reduction in response times', 'Automated case classification', '24/7 self-service capabilities', 'Regulatory compliance built-in'],
      complexity: 'Medium'
    },
    'Document Processing': {
      services: ['SAP AI Core', 'SAP Document Information Extraction', 'SAP Build Process Automation', 'SAP HANA Cloud'],
      reasoning: 'Financial document processing requires AI extraction capabilities, automated validation workflows, and high-performance data storage for audit trails.',
      benefits: ['90% reduction in manual processing', 'Improved accuracy', 'Automated compliance checks', 'Real-time processing'],
      complexity: 'Medium'
    },
    'Workflow Automation': {
      services: ['SAP Build Process Automation', 'SAP Integration Suite', 'SAP Task Center', 'SAP BTP Connectivity'],
      reasoning: 'Banking workflows require secure process automation with integration to core systems, centralized task management, and audit-ready process trails.',
      benefits: ['End-to-end process visibility', 'Reduced processing time by 60%', 'Compliance automation', 'Cross-system orchestration'],
      complexity: 'Low'
    },
    'Predictive Analytics': {
      services: ['SAP AI Core', 'SAP HANA Cloud', 'SAP Analytics Cloud', 'SAP Datasphere'],
      reasoning: 'Predictive analytics in banking leverages AI models for risk scoring, cloud-native data processing, and enterprise analytics for decision support.',
      benefits: ['Early risk detection', 'Portfolio optimization', 'Customer churn prediction', 'Revenue forecasting'],
      complexity: 'High'
    },
    'Knowledge Search': {
      services: ['SAP AI Core', 'SAP Build Work Zone', 'SAP HANA Cloud Vector Engine', 'SAP Integration Suite'],
      reasoning: 'Enterprise knowledge search uses vector embeddings for semantic search, unified work zones for access, and integration with content repositories.',
      benefits: ['Instant access to institutional knowledge', 'Reduced search time by 70%', 'Context-aware results', 'Multi-source aggregation'],
      complexity: 'Medium'
    },
    'Custom Extension': {
      services: ['SAP Cloud Application Programming Model', 'SAP HANA Cloud', 'SAP Build Apps', 'SAP BTP Connectivity'],
      reasoning: 'Custom extensions for banking require the CAP framework for enterprise-grade development, secure connectivity, and low-code capabilities for rapid iteration.',
      benefits: ['Rapid development cycles', 'Enterprise-grade security', 'Seamless S/4HANA integration', 'Scalable architecture'],
      complexity: 'High'
    }
  },
  Retail: {
    'Customer Support': {
      services: ['SAP AI Core', 'SAP Build Process Automation', 'SAP Commerce Cloud', 'SAP Emarsys'],
      reasoning: 'Retail customer support combines AI for intelligent routing, process automation for returns/exchanges, and commerce integration for order visibility.',
      benefits: ['Omnichannel support experience', 'Automated returns processing', 'Personalized interactions', 'Reduced support costs by 40%'],
      complexity: 'Medium'
    },
    'Document Processing': {
      services: ['SAP Document Information Extraction', 'SAP Build Process Automation', 'SAP Integration Suite', 'SAP S/4HANA Cloud'],
      reasoning: 'Retail document processing focuses on invoice extraction, PO matching automation, and seamless ERP integration for financial close.',
      benefits: ['Touchless invoice processing', 'Automated 3-way matching', '95% extraction accuracy', 'Faster financial close'],
      complexity: 'Low'
    },
    'Workflow Automation': {
      services: ['SAP Build Process Automation', 'SAP Integration Suite', 'SAP Build Apps', 'SAP Task Center'],
      reasoning: 'Retail workflows span store operations, supply chain coordination, and employee task management requiring multi-system automation.',
      benefits: ['Streamlined store operations', 'Automated replenishment triggers', 'Employee productivity gains', 'Cross-channel orchestration'],
      complexity: 'Low'
    },
    'Predictive Analytics': {
      services: ['SAP AI Core', 'SAP HANA Cloud', 'SAP Analytics Cloud', 'SAP Datasphere'],
      reasoning: 'Retail analytics drives demand forecasting, customer behavior prediction, and inventory optimization through AI and cloud data platforms.',
      benefits: ['Demand forecasting accuracy +30%', 'Inventory optimization', 'Customer lifetime value prediction', 'Dynamic pricing insights'],
      complexity: 'High'
    },
    'Knowledge Search': {
      services: ['SAP AI Core', 'SAP Build Work Zone', 'SAP HANA Cloud Vector Engine', 'SAP Commerce Cloud'],
      reasoning: 'Product knowledge search enables associates and customers to find information quickly using semantic search and unified access portals.',
      benefits: ['Product discovery improvement', 'Associate empowerment', 'Reduced training time', 'Self-service knowledge base'],
      complexity: 'Medium'
    },
    'Custom Extension': {
      services: ['SAP Cloud Application Programming Model', 'SAP Build Apps', 'SAP HANA Cloud', 'SAP Integration Suite'],
      reasoning: 'Retail extensions require rapid low-code development for store apps combined with CAP for complex backend logic and integration.',
      benefits: ['Store-specific customizations', 'Rapid app deployment', 'Integration with POS systems', 'Mobile-first design'],
      complexity: 'Medium'
    }
  },
  Healthcare: {
    'Customer Support': {
      services: ['SAP AI Core', 'SAP Build Process Automation', 'SAP Conversational AI', 'SAP BTP Connectivity'],
      reasoning: 'Healthcare patient support requires HIPAA-aware AI assistants, secure process automation for appointment management, and compliant connectivity.',
      benefits: ['Patient self-service portal', 'Automated appointment scheduling', 'Secure messaging', 'Reduced call center volume by 35%'],
      complexity: 'High'
    },
    'Document Processing': {
      services: ['SAP Document Information Extraction', 'SAP AI Core', 'SAP HANA Cloud', 'SAP Build Process Automation'],
      reasoning: 'Healthcare document processing handles clinical forms, insurance claims, and patient records with AI extraction and compliant storage.',
      benefits: ['Automated claims processing', 'Clinical document digitization', 'Compliance automation', 'Reduced administrative burden'],
      complexity: 'High'
    },
    'Workflow Automation': {
      services: ['SAP Build Process Automation', 'SAP Integration Suite', 'SAP Task Center', 'SAP BTP Connectivity'],
      reasoning: 'Healthcare workflows manage patient journeys, clinical approvals, and inter-department coordination with compliance requirements.',
      benefits: ['Patient journey optimization', 'Clinical workflow compliance', 'Inter-system coordination', 'Audit trail automation'],
      complexity: 'Medium'
    },
    'Predictive Analytics': {
      services: ['SAP AI Core', 'SAP HANA Cloud', 'SAP Analytics Cloud', 'SAP Datasphere'],
      reasoning: 'Healthcare analytics powers patient outcome prediction, resource planning, and population health management with privacy-preserving AI.',
      benefits: ['Patient outcome prediction', 'Resource utilization optimization', 'Population health insights', 'Early intervention triggers'],
      complexity: 'High'
    },
    'Knowledge Search': {
      services: ['SAP AI Core', 'SAP HANA Cloud Vector Engine', 'SAP Build Work Zone', 'SAP Integration Suite'],
      reasoning: 'Medical knowledge search enables clinicians to access guidelines, research, and protocols through semantic search across clinical systems.',
      benefits: ['Evidence-based decision support', 'Rapid protocol access', 'Cross-system search', 'Continuous learning integration'],
      complexity: 'High'
    },
    'Custom Extension': {
      services: ['SAP Cloud Application Programming Model', 'SAP HANA Cloud', 'SAP Build Apps', 'SAP BTP Connectivity'],
      reasoning: 'Healthcare extensions need enterprise-grade security, compliant data handling, and rapid development for clinical applications.',
      benefits: ['HIPAA-compliant development', 'Patient portal customization', 'Clinical system integration', 'Rapid prototyping'],
      complexity: 'High'
    }
  },
  Manufacturing: {
    'Customer Support': {
      services: ['SAP AI Core', 'SAP Build Process Automation', 'SAP Service Cloud', 'SAP Integration Suite'],
      reasoning: 'Manufacturing support leverages AI for predictive service, automated case handling, and integration with IoT for proactive maintenance.',
      benefits: ['Predictive service tickets', 'Automated spare parts ordering', 'IoT-driven support', 'First-call resolution improvement'],
      complexity: 'Medium'
    },
    'Document Processing': {
      services: ['SAP Document Information Extraction', 'SAP Build Process Automation', 'SAP Integration Suite', 'SAP S/4HANA Cloud'],
      reasoning: 'Manufacturing document processing handles BOMs, quality certificates, and shipping documents with automated extraction and ERP integration.',
      benefits: ['Automated BOM processing', 'Quality certificate validation', 'Shipping document automation', 'Supplier document management'],
      complexity: 'Medium'
    },
    'Workflow Automation': {
      services: ['SAP Build Process Automation', 'SAP Integration Suite', 'SAP Digital Manufacturing', 'SAP Task Center'],
      reasoning: 'Manufacturing workflows span shop floor to back office, requiring MES integration, quality management, and cross-functional coordination.',
      benefits: ['Shop floor digitization', 'Quality workflow automation', 'Cross-functional visibility', 'Reduced cycle times'],
      complexity: 'Medium'
    },
    'Predictive Analytics': {
      services: ['SAP AI Core', 'SAP HANA Cloud', 'SAP Analytics Cloud', 'SAP Digital Manufacturing'],
      reasoning: 'Manufacturing analytics drives predictive maintenance, quality prediction, and supply chain optimization through AI and real-time data.',
      benefits: ['Predictive maintenance (30% downtime reduction)', 'Quality prediction', 'Yield optimization', 'Supply chain risk detection'],
      complexity: 'High'
    },
    'Knowledge Search': {
      services: ['SAP AI Core', 'SAP HANA Cloud Vector Engine', 'SAP Build Work Zone', 'SAP Digital Manufacturing'],
      reasoning: 'Manufacturing knowledge search enables operators to access procedures, troubleshooting guides, and specifications through semantic search.',
      benefits: ['Operator self-service', 'Reduced downtime', 'Knowledge preservation', 'Cross-plant knowledge sharing'],
      complexity: 'Medium'
    },
    'Custom Extension': {
      services: ['SAP Cloud Application Programming Model', 'SAP HANA Cloud', 'SAP Build Apps', 'SAP Integration Suite'],
      reasoning: 'Manufacturing extensions need IoT integration, real-time processing, and custom shop floor applications with enterprise connectivity.',
      benefits: ['IoT data integration', 'Custom shop floor apps', 'Real-time dashboards', 'OT-IT bridge'],
      complexity: 'High'
    }
  },
  Telecom: {
    'Customer Support': {
      services: ['SAP AI Core', 'SAP Conversational AI', 'SAP Build Process Automation', 'SAP Integration Suite'],
      reasoning: 'Telecom customer support uses AI for intelligent virtual agents, automated provisioning workflows, and BSS/OSS integration.',
      benefits: ['AI-powered virtual agents', 'Automated service provisioning', 'Reduced churn through proactive engagement', '40% call deflection'],
      complexity: 'Medium'
    },
    'Document Processing': {
      services: ['SAP Document Information Extraction', 'SAP Build Process Automation', 'SAP HANA Cloud', 'SAP Integration Suite'],
      reasoning: 'Telecom document processing handles contracts, SLAs, and regulatory filings with AI extraction and compliance workflows.',
      benefits: ['Contract lifecycle automation', 'SLA monitoring automation', 'Regulatory compliance', 'Vendor document management'],
      complexity: 'Medium'
    },
    'Workflow Automation': {
      services: ['SAP Build Process Automation', 'SAP Integration Suite', 'SAP Task Center', 'SAP BTP Connectivity'],
      reasoning: 'Telecom workflows automate order-to-activate, trouble-to-resolve, and network change management across BSS and OSS systems.',
      benefits: ['Order-to-activate automation', 'Trouble ticket resolution', 'Network change management', 'Cross-system orchestration'],
      complexity: 'Medium'
    },
    'Predictive Analytics': {
      services: ['SAP AI Core', 'SAP HANA Cloud', 'SAP Analytics Cloud', 'SAP Datasphere'],
      reasoning: 'Telecom analytics powers network optimization, churn prediction, and revenue assurance through real-time AI and big data processing.',
      benefits: ['Network optimization', 'Churn prediction (15% improvement)', 'Revenue assurance', 'Capacity planning'],
      complexity: 'High'
    },
    'Knowledge Search': {
      services: ['SAP AI Core', 'SAP HANA Cloud Vector Engine', 'SAP Build Work Zone', 'SAP Integration Suite'],
      reasoning: 'Telecom knowledge search enables technicians and support agents to access network documentation, procedures, and troubleshooting guides.',
      benefits: ['Technician empowerment', 'Faster issue resolution', 'Network knowledge base', 'Training cost reduction'],
      complexity: 'Medium'
    },
    'Custom Extension': {
      services: ['SAP Cloud Application Programming Model', 'SAP HANA Cloud', 'SAP Build Apps', 'SAP Integration Suite'],
      reasoning: 'Telecom extensions require BSS/OSS integration, real-time event processing, and custom subscriber management applications.',
      benefits: ['BSS/OSS integration', 'Subscriber management apps', 'Real-time event processing', 'API management'],
      complexity: 'High'
    }
  }
};

export function getRecommendation(industry, problem) {
  const industryData = solutionMap[industry];
  if (!industryData) return null;

  const recommendation = industryData[problem];
  if (!recommendation) return null;

  return {
    industry,
    problem,
    ...recommendation
  };
}

export function getIndustries() {
  return Object.keys(solutionMap);
}

export function getProblems() {
  return ['Customer Support', 'Document Processing', 'Workflow Automation', 'Predictive Analytics', 'Knowledge Search', 'Custom Extension'];
}
