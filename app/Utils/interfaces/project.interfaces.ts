import { IAuditTrail } from ".";

export interface IProjectAttributes {
  id?: number;

  name: string;
  description: string;

  dependency: string;
  subdependency: string;
  management_center: number;
  cost_center: number;

  status: number;
  audit_trail?: IAuditTrail;
}
