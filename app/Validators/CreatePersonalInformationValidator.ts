import { schema } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreatePersonalInformationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    names: schema.object().members({
      firstName: schema.string(),
      lastName: schema.string.optional(),
    }),
    surnames: schema.object().members({
      firstSurname: schema.string(),
      lastSurname: schema.string.optional(),
    }),
    documentType: schema.string(),
    documentNumber: schema.number(),
    gender: schema.string(),
    phoneNumber: schema.number(),
    phoneNumberExt: schema.number.optional(),
    email: schema.string(),
  });

  public messages = {};
}
