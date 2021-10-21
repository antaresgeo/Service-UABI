import { IAuditTrail, ISupportsDocuments } from ".";

export interface IRealEstateAttributes {
  id?: number;
  sap_id?: string;

  dependency: string;
  destination_type: string;
  accounting_account: string;
  cost_center: string;

  registry_number: string;
  registry_number_document_id?: string;
  name: string;
  description: string;
  patrimonial_value: number;
  location?: string;
  cbml?: string;

  total_area: number;
  total_percentage: number;
  zone: string;
  tipology: string;
  materials?: string;

  supports_documents?: ISupportsDocuments;

  project_id: number;

  status?: number;
  audit_trail?: IAuditTrail;
}
