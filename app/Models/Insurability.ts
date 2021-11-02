import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class Insurability extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public registry_number: number;

  @column()
  public vigency_start: string;
  @column()
  public vigency_end: string;

  @column()
  public insurance_broker: string;
  @column()
  public insurance_company: string;

  @column()
  public insurance_value: number;
  @column()
  public insurance_document_id: string;

  @column()
  public real_estate_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
