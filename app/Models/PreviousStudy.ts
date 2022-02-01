
import {BaseModel, column, HasMany, hasMany, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import Claimant from "App/Models/Claimant";
import Risk from "App/Models/Risk";
import PersonalInformation from "App/Models/PersonalInformation";
import Obligation from "App/Models/Obligation";

export default class PreviousStudy extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public boundaries: string;

  @column()
  public destination_realestate: string;

  @column()
  public contract_period: number;

  @column()
  public business_type: string;

  @column()
  public lockable_base: number;

  @column()
  public prediation_date: number;

  @column()
  public registration_date: number;

  @column()
  leader_id: number

  @hasOne(() => Claimant, { foreignKey: "id", localKey: "leader_id" })
  public leader: HasOne<typeof Claimant>;

  @column()
  applicant_id: number

  @hasOne(() => Claimant, { foreignKey: "id", localKey: "applicant_id" })
  public applicant: HasOne<typeof Claimant>;

  @column()
  operational_risk_id: number

  @hasOne(() => Risk, { foreignKey: "id", localKey: "operational_risk_id" })
  public operational_risk: HasOne<typeof Risk>;

  @column()
  regulatory_risk_id: number

  @hasOne(() => Risk, { foreignKey: "id", localKey: "regulatory_risk_id" })
  public regulatory_risk: HasOne<typeof Risk>;

  @column()
  public revised_id: number;

  @hasOne(() => PersonalInformation, { foreignKey: "id", localKey: "revised_id" })
  public revised: HasOne<typeof PersonalInformation>;

  @column()
  public approved_id: number;

  @hasOne(() => PersonalInformation, { foreignKey: "id", localKey: "approved_id" })
  public approved: HasOne<typeof PersonalInformation>;

  @column()
  public elaborated_id: number;

  @hasOne(() => PersonalInformation, { foreignKey: "id", localKey: "elaborated_id" })
  public elaborated: HasOne<typeof PersonalInformation>;

  @hasMany(() => Obligation, { localKey: "id", foreignKey: "destination_id"})
  public obligations: HasMany<typeof Obligation>
}
