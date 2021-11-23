import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class Tipology extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public tipology: string;
  @column()
  public accounting_account: string;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
