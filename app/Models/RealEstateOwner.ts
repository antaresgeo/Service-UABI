import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class RealEstateOccupant extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public names_surnames: string;
  @column()
  public document_type: string;
  @column()
  public document_number: number;
  @column()
  public phone_number: number;
  @column()
  public email: string;

  @column()
  public real_estate_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
