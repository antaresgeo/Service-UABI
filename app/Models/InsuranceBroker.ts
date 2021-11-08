import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import { IContactInformation } from "App/Utils/interfaces/insurances.interfaces";

export default class InsuranceBroker extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;
  @column()
  public nit: number;
  @column()
  public location_id: string;
  @column()
  public phone: string;

  @column()
  public contact_information: IContactInformation;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
