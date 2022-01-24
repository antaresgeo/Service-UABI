import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import Status from "./Status";
import Project from "App/Models/Project";

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

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @hasOne(() => Project, { foreignKey: "id", localKey: "project_id" })
  public project_info: HasOne<typeof Project>;
}
