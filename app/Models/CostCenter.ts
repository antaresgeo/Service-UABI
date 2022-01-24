import { BaseModel, column, hasOne, HasOne } from "@ioc:Adonis/Lucid/Orm";
import Dependency from "App/Models/Dependency";

export default class CostCenter extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dependency_id: number;
  @column()
  public subdependency: string;
  @column()
  public cost_center: number;

  // Foreign Key Relation
  @hasOne(() => Dependency, { foreignKey: "id", localKey: "dependency_id" })
  public dependency_info: HasOne<typeof Dependency>;
}
