using { rig.tracker as db } from '../db/schema';

@path: '/odata/v4/engagement'
service EngagementService {
  entity Proposals    as projection on db.Proposals;
  entity Engagements  as projection on db.Engagements;
  entity MxpCustomers as projection on db.MxpCustomers;
}
