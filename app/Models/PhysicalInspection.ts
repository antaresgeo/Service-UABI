import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import { IObservations } from "./../Utils/interfaces/inspection";

export default class PhysicalInspection extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public observations: IObservations;
  @column()
  public photographic_record: string;
  @column()
  public inspection_date: number | undefined;

  @column()
  public real_estate_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
