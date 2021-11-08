import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateInsuranceBrokerValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    nit: schema.number(),
    location_id: schema.string({ trim: true }),
    phone: schema.string({ trim: true }),

    contact_information: schema.object.optional().members({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }),
      phone: schema.string({ trim: true }),
    }),
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
