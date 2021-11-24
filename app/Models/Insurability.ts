import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class Insurability extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public registry_number: string;
  @column()
  public policy_type: string;

  @column()
  public vigency_start: number;
  @column()
  public vigency_end: number;

  @column()
  public insurance_broker_id: number;
  @column()
  public type_assurance: string;

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
