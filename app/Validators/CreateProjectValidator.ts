import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateProjectValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    description: schema.string({ trim: true }),

    budget_value: schema.number.optional(),

    cost_center_id: schema.number.optional(),
    dependency: schema.string.optional({ trim: true }),
    subdependency: schema.string.optional({ trim: true }),
    management_center: schema.number.optional(),
    cost_center: schema.number.optional(),
    contracts: schema.array().members(
      schema.object().members({
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
      })
    ),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {};
}
