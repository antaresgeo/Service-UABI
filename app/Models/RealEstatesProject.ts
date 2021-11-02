import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class RealEstatesProject extends BaseModel {
  @column({ isPrimary: true })
  public project_id: number;

  @column({ isPrimary: true })
  public real_estate_id: number;
}
