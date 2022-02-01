import {BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import Status from "App/Models/Status";
import {IAuditTrail} from "App/Utils/interfaces";

export default class Obligation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: number;

  @column()
  public obligation: string;

  @column()
  public destination_id: number;

  @column()
  public status: number;

  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @column()
  public audit_trail: IAuditTrail;
}
