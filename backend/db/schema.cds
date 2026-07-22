namespace rig.tracker;

using { cuid, managed } from '@sap/cds/common';

// Proposals — submitted via intake form, awaiting review
entity Proposals : cuid, managed {
  // Customer
  externalId             : String(200);
  customerName           : String(200);
  industry               : String(100);
  region                 : String(50);
  country                : String(100);
  accountTeam            : String(200);
  customerSegment        : String(50);
  // Contacts
  sponsorName            : String(200);
  sponsorTitle           : String(200);
  sponsorEmail           : String(200);
  sponsorPhone           : String(50);
  techContactName        : String(200);
  techContactTitle       : String(200);
  techContactEmail       : String(200);
  techContactPhone       : String(50);
  // Opportunity
  projectName            : String(200);
  problemStatement       : LargeString;
  lineOfBusiness         : String(100);
  timeline               : String(50);
  jouleCapabilities      : LargeString;
  businessValue          : Integer default 50;
  strategicImportance    : Integer default 50;
  priority               : String(20) default 'Medium';
  isReferenceCustomer    : Boolean default false;
  notes                  : LargeString;
  // Proposal lifecycle
  proposalStatus         : String(20) default 'Under Review';  // Under Review | Accepted | Rejected
  reviewComment          : LargeString;
  reviewedBy             : String(100);
  reviewedAt             : String(30);
  submittedBy            : String(100);
}

// Engagements — promoted from accepted proposals
entity Engagements : cuid, managed {
  proposalId             : String(200);  // links back to Proposals.ID
  externalId             : String(200);
  // Customer
  customerName           : String(200);
  industry               : String(100);
  region                 : String(50);
  country                : String(100);
  accountTeam            : String(200);
  customerSegment        : String(50);
  // Contacts
  sponsorName            : String(200);
  sponsorTitle           : String(200);
  sponsorEmail           : String(200);
  sponsorPhone           : String(50);
  techContactName        : String(200);
  techContactTitle       : String(200);
  techContactEmail       : String(200);
  techContactPhone       : String(50);
  // Opportunity
  projectName            : String(200);
  problemStatement       : LargeString;
  lineOfBusiness         : String(100);
  timeline               : String(50);
  jouleCapabilities      : LargeString;
  businessValue          : Integer default 50;
  strategicImportance    : Integer default 50;
  priority               : String(20) default 'Medium';
  isReferenceCustomer    : Boolean default false;
  // Engagement tracking
  engagementType         : String(150);
  owner                  : String(100);
  status                 : String(50) default 'Not Started';
  progress               : Integer default 0;
  startDate              : String(20);
  endDate                : String(20);
  blockers               : String(500);
  notes                  : LargeString;
}

// MxpCustomers — imported from MXP, used for autofill lookup only
entity MxpCustomers {
  key externalId   : String(200);
  customerName     : String(200);
  industry         : String(100);
  region           : String(50);
  owner            : String(100);
  country          : String(100);
  planningEntity   : String(200);
  planningGroup    : String(200);
  erpAccount       : String(200);
  city             : String(100);
}
