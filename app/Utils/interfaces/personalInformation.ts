import { IAuditTrail } from ".";
export interface IPersonalInformation {
  id?: number;

  document_type: string;
  document_number: number;

  first_name: string;
  last_name?: string;
  first_surname: string;
  last_surname?: string;

  gender: string;
  phone_number: number;
  phone_number_ext?: number;
  email: string;

  status?: number;
  audit_trail?: IAuditTrail;
}
