import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import { ISecretary } from "App/Utils/interfaces/contract";
import Status from "./Status";

export default class Contract extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public act_number: number;
  @column()
  public contract_decree: string;
  @column()
  public decree_date: string;
  @column()
  public decree_number: number;
  @column()
  public dispose_area: number;
  @column()
  public finish_date: string;
  @column()
  public guarantee: string;
  @column()
  public manager_sabi: string;
  @column()
  public minutes_date: string;
  @column()
  public object_contract: string;
  @column()
  public secretary: ISecretary;
  @column()
  public subscription_date: string;
  @column()
  public type_contract: string;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;
}
