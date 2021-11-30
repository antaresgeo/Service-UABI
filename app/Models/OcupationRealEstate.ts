import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class OcupationRealEstate extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public tenure: string;
  @column()
  public use: string;
  @column()
  public ownership: string;
  @column()
  public contractual: string;

  @column()
  public real_estate_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
