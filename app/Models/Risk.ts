import {BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import Status from "App/Models/Status";
import {IAuditTrail} from "App/Utils/interfaces";

export default class Risk extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public leader_id: string;

  @column()
  public degree_occurrence: string;

  @column()
  public impact_degree: string;

  @column()
  public responsible: string;

  @column()
  public mitigation_mechanism: string;

  @column()
  public status: number;

  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @column()
  public audit_trail: IAuditTrail;
}
