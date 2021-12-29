import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { IResponseData } from "App/Utils/interfaces";
import CreateContractValidator from "./../../Validators/CreateContractValidator";
import { messageError } from "App/Utils/functions";
import Contract from "./../../Models/Contract";
import { IContract } from "./../../Utils/interfaces/contract";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { getToken } from "App/Utils/functions/jwt";

export default class ContractsController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract, data?) {
    const { token } = getToken(request.headers());
    let responseData: IResponseData = { message: "", status: 200 };
    const bodyPayload = data
      ? data
      : await request.validate(CreateContractValidator);

    const auditTrail = new AuditTrail(token);
    await auditTrail.init();

    let dataToCreate: IContract = {
      ...bodyPayload,

      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };

    try {
      const newContract = await Contract.create({ ...dataToCreate });
      responseData["message"] = "Registro de contrato exitoso.";
      responseData["results"] = newContract["$attributes"];
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al crear el registro del contrato.",
        500
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
