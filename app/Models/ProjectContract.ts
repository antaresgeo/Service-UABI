import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class ProjectContract extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public contract_number: number;
  @column()
  public vigency_start: number;
  @column()
  public vigency_end: number;
  @column()
  public contractor: string;

  @column()
  public project_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
