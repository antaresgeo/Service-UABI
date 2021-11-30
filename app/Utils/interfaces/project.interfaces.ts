import { IAuditTrail } from ".";

export interface IProjectAttributes {
  id?: number;

  name: string;
  description: string;

  cost_center_id?: number;

  status?: number;
  audit_trail?: IAuditTrail;
}

export interface IPayloadProject {
  name: string;
  description: string;

  budget_value?: number;

  cost_center_id?: number;

  dependency?: string;
  subdependency?: string;
  management_center?: number;
  cost_center?: number;
}
