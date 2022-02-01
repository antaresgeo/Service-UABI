
import {BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import PreviousStudy from "App/Models/PreviousStudy";

export default class Lease extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public iva: number;

  @column()
  public administration_value: number;

  @column()
  public appraisal_date: number;

  @column()
  public appraisal_number: number;

  @column()
  public coverage: string;

  @column()
  public fines: string;

  @column()
  public prediation_number: number;

  @column()
  public public_service: string;

  @column()
  public monthly_total: number;

  @column()
  public value_afro: number;

  @column()
  public vigilance_value: number;

  @column()
  public recovery_value: number;

  @column()
  public counter_value: number;

  @column()
  public detail_lease_id: number;

  @hasOne(() => PreviousStudy, { foreignKey: "id", localKey: "detail_lease_id" })
  public detail_lease: HasOne<typeof PreviousStudy>;

}
