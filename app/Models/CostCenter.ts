import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class CostCenter extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dependency_id: number;
  @column()
  public subdependency: string;
  @column()
  public cost_center: number;
}
