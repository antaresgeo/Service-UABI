import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAcquisitionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    acquisition_type: schema.string({ trim: true }),
    acquisition_date: schema.number(),
    title_type: schema.string({ trim: true }),
    title_type_document_id: schema.string.optional({ trim: true }),
    act_number: schema.string({ trim: true }),
    act_value: schema.number(),
    recognition_value: schema.number.optional(),

    area: schema.number.optional(),
    acquired_percentage: schema.number(),
    origin: schema.number(),

    entity_type: schema.string({ trim: true }),
    entity_number: schema.string({ trim: true }),
    address: schema.string.optional({ trim: true }),

    real_estate_id: schema.number(),
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
