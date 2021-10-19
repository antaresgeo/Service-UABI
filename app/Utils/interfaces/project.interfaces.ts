import { IAuditTrail } from ".";

export interface IProjectAttributes {
  id?: number;
  name: string;
  description: string;
  dependency: string;
  audit_trail?: IAuditTrail;
  status: number;
}
