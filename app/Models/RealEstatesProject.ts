import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Project from "App/Models/Project";
import RealEstate from "App/Models/RealEstate";

export default class RealEstatesProject extends BaseModel {
  @column({ isPrimary: true })
  public project_id: number;

  @column({ isPrimary: true })
  public real_estate_id: number;

  // Foreign Key Relation
  @hasOne(() => Project, { foreignKey: "id", localKey: "project_id" })
  public project_info: HasOne<typeof Project>;

  @hasOne(() => RealEstate, { foreignKey: "id", localKey: "real_estate_id" })
  public real_estate_info: HasOne<typeof RealEstate>;
}
