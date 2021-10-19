import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateRealEstateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    sap_id: schema.string.optional({ trim: true }),

    dependency: schema.string({ trim: true }),
    destination_type: schema.string({ trim: true }),
    accounting_account: schema.string({ trim: true }),
    cost_center: schema.string({ trim: true }),

    registry_number: schema.string({ trim: true }),
    registry_number_document_id: schema.string.optional({ trim: true }),
    name: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    patrimonial_value: schema.number(),
    address: schema.string({ trim: true }),
    cbml: schema.string({ trim: true }),

    total_area: schema.number(),
    total_percentage: schema.number(),
    zone: schema.string({ trim: true }),
    tipology: schema.string({ trim: true }),
    materials: schema.string.optional({ trim: true }),

    supports_documents: schema.object.optional().members({
      id: schema.string(),
      name: schema.string(),
      path: schema.string(),
    }),

    project_id: schema.number(),
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
