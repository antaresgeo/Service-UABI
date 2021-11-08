import { IAuditTrail } from ".";

export interface IRealEstateAttributes {
  id?: number;
  sap_id?: string;

  tipology: string;
  accounting_account: string;

  destination_type: string;
  registry_number: string;
  name: string;
  description: string;
  patrimonial_value: number;
  reconstruction_value: number;
  total_area: number;
  total_percentage: number;
  materials?: string;

  zone: string;
  address?: any;

  supports_documents?: string;
  projects_id?: number[];

  status?: number;
  audit_trail?: IAuditTrail;
}
