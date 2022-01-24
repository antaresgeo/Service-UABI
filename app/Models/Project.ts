import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import CostCenter from "./CostCenter";
import Status from "./Status";

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;
  @column()
  public description: string;

  @column()
  public cost_center_id: number;
  @column()
  public budget_value: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @hasOne(() => CostCenter, { foreignKey: "id", localKey: "cost_center_id" })
  public cost_center_info: HasOne<typeof CostCenter>;
}
