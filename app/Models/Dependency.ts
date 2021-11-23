import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Dependency extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dependency: string;
  @column()
  public management_center: number;
  @column()
  public fixed_assets: string;
  @column()
  public last_consecutive: number;
}
