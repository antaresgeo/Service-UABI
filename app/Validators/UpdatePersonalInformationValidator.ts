import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UpdatePersonalInformationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    names: schema.object.optional().members({
      firstName: schema.string.optional(),
      lastName: schema.string.optional(),
    }),
    surnames: schema.object.optional().members({
      firstSurname: schema.string.optional(),
      lastSurname: schema.string.optional(),
    }),
    documentType: schema.string(),
    documentNumber: schema.number(),
    gender: schema.string.optional(),
    phoneNumber: schema.number.optional(),
    phoneNumberExt: schema.number.optional(),
    email: schema.string.optional(),
  });

  public messages = {};
}
