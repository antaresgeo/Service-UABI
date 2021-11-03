import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateRealEstateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    projects_id: schema.array.optional().members(schema.number()),

    tipology: schema.string({ trim: true }),
    accounting_account: schema.string({ trim: true }),

    destination_type: schema.string({ trim: true }),
    registry_number: schema.string({ trim: true }),
    name: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    patrimonial_value: schema.number(),
    reconstruction_value: schema.number(),
    total_area: schema.number(),
    total_percentage: schema.number(),
    materials: schema.string.optional({ trim: true }),

    zone: schema.string({ trim: true }),
    address: schema.object
      .optional()
      .members({ name: schema.string({ trim: true }) }),

    supports_documents: schema.array.optional().members(
      schema.object.optional().members({
        id: schema.string(),
        name: schema.string(),
        path: schema.string(),
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
