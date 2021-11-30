import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class RealEstateProperty extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;
  @column()
  public status_property: string;
  @column()
  public observation: string;
  @column()
  public accountant: number;

  @column()
  public physical_inspection_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
