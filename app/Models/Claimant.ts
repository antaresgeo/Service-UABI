import {BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import {IAuditTrail} from "App/Utils/interfaces";
import Status from "App/Models/Status";
import PersonalInformation from "App/Models/PersonalInformation";

export default class Claimant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // --- columns --- //

  @column()
  public person_type: string;

  @column()
  public document_type: number;

  @column()
  public document_number: number;

  @column()
  public person_location_id: number;

  @column()
  public company_name: string;

  @column()
  public company_phone_number: number;

  @column()
  public company_phone_number_ext: number;

  @column()
  public company_email: string;

  @column()
  public legal_reprensentative_person_type: string;

  @column()
  public legal_reprensentative_id: number;

  @hasOne(() => PersonalInformation, { foreignKey: "id", localKey: "legal_reprensentative_id" })
  public legal_reprensentative_information: HasOne<typeof PersonalInformation>;

  @column()
  public status: number;

  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @column()
  public audit_trail: IAuditTrail;

  @column()
  public person_id: number;

  @hasOne(() => PersonalInformation, { foreignKey: "id", localKey: "person_id" })
  public personal_information: HasOne<typeof PersonalInformation>;

  // --- end columns --- //
}
