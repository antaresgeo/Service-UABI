import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class RealEstate extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public sap_id: string | undefined;

  @column()
  public cost_center_id: number | undefined;
  @column()
  public tipology_id: number;

  @column()
  public destination_type: string;
  @column()
  public registry_number: string;
  @column()
  public name: string;
  @column()
  public description: string;
  @column()
  public patrimonial_value: number;
  @column()
  public reconstruction_value: number;
  @column()
  public total_area: number;
  @column()
  public total_area_unit: string | undefined;
  @column()
  public construction_area_unit: string | undefined;
  @column()
  public plot_area_unit: string | undefined;
  @column()
  public total_percentage: number;
  @column()
  public materials: string | undefined;

  @column()
  public plot_area: number;
  @column()
  public construction_area: number | undefined;

  @column()
  public zone: string;
  @column()
  public address: number;

  @column()
  public supports_documents: string | undefined;

  @column()
  public policy_id: number;
  @column()
  public active_type: string;

  @column()
  public accounting_amount: string | undefined;
  @column()
  public counterpart: number | undefined;
  @column()
  public years_useful_life: number | undefined;
  @column()
  public useful_life_periods: number | undefined;
  @column()
  public assignments: string | undefined;
  @column()
  public disposition_type: string | undefined;
  @column()
  public exploitation_value: number | undefined;
  @column()
  public authorization_value: number | undefined;
  @column()
  public canyon_value: number | undefined;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
