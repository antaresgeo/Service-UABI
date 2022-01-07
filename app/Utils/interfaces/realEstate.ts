import { IAuditTrail } from ".";

export interface IRealEstateAttributes {
  id?: number;
  sap_id?: string;

  cost_center_id?: number;
  tipology_id: number;

  destination_type: string;
  registry_number: string;
  name: string;
  description: string;
  patrimonial_value: number;
  reconstruction_value: number;
  total_area: number;
  total_area_unit?: string;
  construction_area_unit?: string;
  plot_area_unit?: string;
  total_percentage: number;
  materials?: string;

  plot_area: number;
  construction_area?: number;

  zone: string;
  address: number;

  supports_documents?: string;

  projects_id?: number[];
  active_type: string;

  accounting_amount?: string;
  counterpart?: number;
  years_useful_life?: number;
  useful_life_periods?: number;
  assignments?: string;
  disposition_type?: string;
  exploitation_value?: number;
  authorization_value?: number;
  canyon_value?: number;

  status?: number;
  audit_trail?: IAuditTrail;
}

export interface IPayloadRealEstate {
  id?: number;
  sap_id?: string;

  cost_center_id?: number;
  tipology_id: number;

  destination_type: string;
  registry_number: string;
  name: string;
  description: string;
  patrimonial_value: number;
  reconstruction_value: number;
  total_area: number;
  total_area_unit?: string;
  construction_area_unit?: string;
  plot_area_unit?: string;
  total_percentage: number;
  materials?: string;

  plot_area: number;
  construction_area?: number;

  zone: string;
  address: number;

  dependency?: string;
  subdependency?: string;
  management_center?: number;
  cost_center?: number;

  supports_documents?: string;

  projects_id?: number[];
  active_type: string;

  accounting_amount?: string;
  counterpart?: number;
  years_useful_life?: number;
  useful_life_periods?: number;
  assignments?: string;
  disposition_type?: string;
  exploitation_value?: number;
  authorization_value?: number;
  canyon_value?: number;
}

export interface IPayloadManyRealEstates {
  realEstates: IPayloadRealEstate[];
}
