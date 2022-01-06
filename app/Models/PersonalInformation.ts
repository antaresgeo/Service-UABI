import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import Status from "./Status";

export default class PersonalInformation extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public document_type: string;
  @column()
  public document_number: number;
  @column()
  public first_name: string;
  @column()
  public last_name: string;
  @column()
  public first_surname: string;
  @column()
  public last_surname: string;
  @column()
  public gender: string;
  @column()
  public phone_number: number;
  @column()
  public phone_number_ext: number;
  @column()
  public email: string;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;
}
