import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Status extends BaseModel {
  public static table = "status";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public status_name: string;
}
