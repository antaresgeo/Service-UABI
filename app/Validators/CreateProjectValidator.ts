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
    contracts: schema.array.optional().members(
      schema.object().members({
        contract_number: schema.string(),
        contractor: schema.string(),
        validity: schema
          .object()
          .members({ end_date: schema.string(), start_date: schema.string() }),
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
