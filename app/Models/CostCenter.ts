import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class CostCenter extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dependency: string;
  @column()
  public subdependency: string;
  @column()
  public management_center: number;
  @column()
  public cost_center: number;
  @column()
  public fixed_assets: string;
}
