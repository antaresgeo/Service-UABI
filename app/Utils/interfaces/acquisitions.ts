import { IAuditTrail } from ".";

export interface IAcquisition {
  id?: number;
  acquisition_type: string;
  acquisition_date: number;
  title_type: string;
  title_type_document_id?: string;
  act_number: string;
  act_value: number;
  recognition_value: number;

  plot_area?: number;
  construction_area?: number;
  acquired_percentage: number;
  origin: number;

  entity_type: string;
  entity_number: string;
  address?: string;

  real_estate_id: number;

  status?: number;
  status_info?: { id: number; status_name: string };
  audit_trail?: IAuditTrail;
}
