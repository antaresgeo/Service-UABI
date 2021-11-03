import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail, ISupportsDocuments } from "App/Utils/interfaces";

export default class RealEstate extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public sap_id: string | undefined;

  @column()
  public tipology: string;
  @column()
  public accounting_account: string;

  @column()
  public destination_type: string;
  @column()
  public registry_number: string;
  @column()
  public name: string;
  @column()
  public description: string;
  @column()
  public patrimonial_value: number;
  @column()
  public reconstruction_value: number;
  @column()
  public total_area: number;
  @column()
  public total_percentage: number;
  @column()
  public materials: string | undefined;

  @column()
  public zone: string;
  @column()
  public address: any | undefined;

  @column()
  public supports_documents: ISupportsDocuments[] | undefined;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
