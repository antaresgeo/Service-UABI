import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { messageError } from "App/Utils/functions";
import { IResponseData } from "App/Utils/interfaces";
import CreatePersonalInformationValidator from "App/Validators/CreatePersonalInformationValidator";
import { IPersonalInformation } from "./../../Utils/interfaces/personalInformation";
import PersonalInformation from "./../../Models/PersonalInformation";
import { AuditTrail } from "./../../Utils/classes";
import { getToken } from "App/Utils/functions/jwt";
import UpdatePersonalInformationValidator from "./../../Validators/UpdatePersonalInformationValidator";

export default class PersonalInformationsController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Información personal almacenada correctamente.",
      status: 200,
    };
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);

    const {
      documentNumber,
      documentType,
      names,
      surnames,
      phoneNumber,
      phoneNumberExt,
      gender,
      email,
    } = await request.validate(CreatePersonalInformationValidator);

    let dataToCreate: IPersonalInformation = {
      document_type: documentType,
      document_number: documentNumber,

      first_name: names["firstName"],
      first_surname: surnames["firstSurname"],

      phone_number: phoneNumber,
      gender,
      email,

      status: 1,
    };
    if (names["lastName"]) dataToCreate["last_name"] = names["lastName"];
    if (surnames["lastSurname"])
      dataToCreate["last_surname"] = surnames["lastSurname"];
    if (phoneNumberExt) dataToCreate["phone_number_ext"] = phoneNumberExt;

    const auditTrail = new AuditTrail(token);
    await auditTrail.init();
    dataToCreate["audit_trail"] = auditTrail.getAsJson();

    try {
      const personalInformation = await PersonalInformation.create(
        dataToCreate
      );

      responseData["results"] = personalInformation;
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al persistir la información personal.",
        400
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }

  public async store({}: HttpContextContract) {}

  public async show({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Información personal de ",
      status: 200,
    };

    const { dn, dt } = request.qs();

    if (!dt)
      return messageError(
        {},
        response,
        "Ingrese el tipo de documento. [ dt ]",
        400
      );
    if (!dn)
      return messageError(
        {},
        response,
        "Ingrese el número de documento. [ dn ]",
        400
      );

    try {
      const personalInformation = (
        await PersonalInformation.query()
          .preload("status_info")
          .where("document_number", dn)
          .where("document_type", dt)
      )[0];

      let dataToReturn = {
        ...personalInformation["$attributes"],
        ...personalInformation["$preloaded"],
      };
      delete dataToReturn["status"];

      responseData["message"] +=
        personalInformation["$attributes"]["first_name"];
      responseData["results"] = dataToReturn;
    } catch (error) {
      return messageError(
        error,
        response,
        "Información no enconcontrada. Por favor llenar los datos para crearlos.",
        400
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }

  public async edit({}: HttpContextContract) {}

  public async update({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Información Personal actualizada correctamente.",
      status: 200,
    };
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
    let personalInformation: PersonalInformation;

    const bodyPayload = await request.validate(
      UpdatePersonalInformationValidator
    );

    try {
      personalInformation = (
        await PersonalInformation.query()
          .preload("status_info")
          .where("document_number", bodyPayload["documentNumber"])
          .where("document_type", bodyPayload["documentType"])
      )[0];
    } catch (error) {
      return messageError(
        error,
        response,
        "Información no encontrada. Proporcionar un documento válido.",
        400
      );
    }

    let dataToUpdate: any = {
      ...bodyPayload,
      document_type: bodyPayload["documentType"],
      document_number: bodyPayload["documentNumber"],
    };
    delete dataToUpdate["documentType"];
    delete dataToUpdate["documentNumber"];

    if (dataToUpdate["names"]) {
      if (dataToUpdate["names"]["firstName"])
        dataToUpdate["first_name"] = dataToUpdate["names"]["firstName"];
      dataToUpdate["last_name"] = dataToUpdate["names"]["lastName"]
        ? dataToUpdate["names"]["lastName"]
        : null;
      delete dataToUpdate["names"];
    }

    if (dataToUpdate["surnames"]) {
      if (dataToUpdate["surnames"]["firstSurname"])
        dataToUpdate["first_surname"] =
          dataToUpdate["surnames"]["firstSurname"];
      dataToUpdate["last_surname"] = dataToUpdate["surnames"]["lastSurname"]
        ? dataToUpdate["surnames"]["lastSurname"]
        : null;
      delete dataToUpdate["surnames"];
    }

    if (dataToUpdate["phoneNumber"]) {
      dataToUpdate["phone_number"] = dataToUpdate["phoneNumber"];
      delete dataToUpdate["phoneNumber"];
    }

    if (dataToUpdate["phoneNumberExt"]) {
      dataToUpdate["phone_number_ext"] = dataToUpdate["phoneNumberExt"];
      delete dataToUpdate["phoneNumberExt"];
    }

    const auditTrail = new AuditTrail(
      token,
      personalInformation["audit_trail"]
    );
    await auditTrail.update({ ...dataToUpdate }, personalInformation);

    dataToUpdate["audit_trail"] = auditTrail.getAsJson();

    try {
      personalInformation = await personalInformation
        .merge(dataToUpdate)
        .save();
      responseData["results"] = personalInformation;
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al actualizar.",
        500
      );
    }
    return response.status(responseData["status"]).json(responseData);
  }

  public async destroy({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Información personal eliminada correctamente.",
      status: 200,
    };
    let personalInformation: PersonalInformation;

    const { id } = request.qs();
    if (!id)
      return messageError(
        {},
        response,
        "Ingrese el ID de la información personal a eliminar."
      );

    try {
      personalInformation = await PersonalInformation.findOrFail(id);
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al obtener la información personal."
      );
    }

    try {
      await personalInformation.delete();

      return response.status(responseData["status"]).json(responseData);
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al eliminar la información personal."
      );
    }
  }
}
