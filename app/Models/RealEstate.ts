import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail, ISupportsDocuments } from "App/Utils/interfaces";

export default class RealEstate extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public sap_id: string | undefined;

  @column()
  public dependency: string;
  @column()
  public destination_type: string;
  @column()
  public accounting_account: string;
  @column()
  public cost_center: string;

  @column()
  public registry_number: string;
  @column()
  public registry_number_document_id: string | undefined;
  @column()
  public name: string;
  @column()
  public description: string;
  @column()
  public patrimonial_value: number;
  @column()
  public address: string;
  @column()
  public cbml: string;

  @column()
  public total_area: number;
  @column()
  public total_percentage: number;
  @column()
  public zone: string;
  @column()
  public tipology: string;
  @column()
  public materials: string | undefined;

  @column()
  public supports_documents: ISupportsDocuments | undefined;

  @column()
  public project_id: number;

  @column()
  public status: number;

  @column()
  public audit_trail: IAuditTrail;
}
