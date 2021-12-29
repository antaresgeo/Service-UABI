import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateContractValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    act_number: schema.number(),
    contract_decree: schema.string(),
    decree_date: schema.string(),
    decree_number: schema.number(),
    dispose_area: schema.number(),
    finish_date: schema.string(),
    guarantee: schema.string(),
    manager_sabi: schema.string(),
    minutes_date: schema.string(),
    object_contract: schema.string(),
    secretary: schema
      .object()
      .members({ name: schema.string(), id_number: schema.number() }),
    subscription_date: schema.string(),
    type_contract: schema.string(),
  });

  public messages = {};
}
