import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateRealEstateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    realEstates: schema.array().members(
      schema.object().members({
        projects_id: schema.array.optional().members(schema.number()),
        sap_id: schema.string.optional(),

        tipology_id: schema.number(),

        destination_type: schema.string({ trim: true }),
        registry_number: schema.string({ trim: true }),
        name: schema.string({ trim: true }),
        description: schema.string({ trim: true }),
        patrimonial_value: schema.number(),
        reconstruction_value: schema.number(),
        total_area: schema.number(),
        total_percentage: schema.number(),
        materials: schema.string.optional({ trim: true }),

        plot_area: schema.number(),
        construction_area: schema.number.optional(),

        active_type: schema.string({ trim: true }),

        dependency: schema.string.optional({ trim: true }),
        subdependency: schema.string.optional({ trim: true }),
        management_center: schema.number.optional(),
        cost_center: schema.number.optional(),

        cost_center_id: schema.number.optional(),

        zone: schema.string({ trim: true }),
        address: schema.number(),

        supports_documents: schema.string.optional({ trim: true }),
      })
    ),
  });

  public messages = {};
}
