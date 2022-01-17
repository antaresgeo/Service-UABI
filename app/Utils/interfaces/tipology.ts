import { IAuditTrail } from "App/Utils/interfaces";
export interface ITipology {
  id?: number;

  tipology: string;
  accounting_account: string;

  status?: number;
  audit_trail?: IAuditTrail;
}
