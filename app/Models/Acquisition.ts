import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

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
}
