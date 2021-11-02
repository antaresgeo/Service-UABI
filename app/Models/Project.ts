import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;
  @column()
  public description: string;

  @column()
  public dependency: string;
  @column()
  public subdependency: string;
  @column()
  public management_center: number;
  @column()
  public cost_center: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
