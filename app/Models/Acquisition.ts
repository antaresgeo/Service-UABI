import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import Status from "./Status";
import RealEstate from "./RealEstate";

export default class Acquisition extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public acquisition_type: string;
  @column()
  public acquisition_date: number;
  @column()
  public title_type: string;
  @column()
  public title_type_document_id: string;
  @column()
  public act_number: string;
  @column()
  public act_value: number;
  @column()
  public recognition_value: number;
  @column()
  public area: number;

  @column()
  public acquired_percentage: number;
  @column()
  public origin: number;

  @column()
  public entity_type: string;
  @column()
  public entity_number: string;
  @column()
  public city: string;

  @column()
  public real_estate_id: number;

  @column()
  public policy_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @hasOne(() => RealEstate, { foreignKey: "id", localKey: "real_estate_id" })
  public real_estate_info: HasOne<typeof RealEstate>;

  @hasOne(() => RealEstate, { foreignKey: "id", localKey: "real_estate_id" })
  public personal_information_info: HasOne<typeof RealEstate>;
}
