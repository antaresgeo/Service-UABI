import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class PoliciesInsuranceCompany extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public policy_id: number;
  @column()
  public insurance_company_id: number;
  @column()
  public percentage_insured: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
