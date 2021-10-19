import { IAuditTrail } from ".";

export interface IAdquisitionAttributes {
  id?: number;
  acquisition_type: string;
  active_type: string;
  title_type: string;
  title_type_document_id?: string;
  act_number: string;
  act_value: number;

  plot_area?: number;
  construction_area?: number;
  acquired_percentage: number;
  seller: string;

  entity_type: string;
  entity_number: string;
  address?: string;

  real_estate_id: number;

  status?: number;
  audit_trail?: IAuditTrail;
}
