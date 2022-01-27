import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { IPaginationValidated, IResponseData } from "App/Utils/interfaces";
import CreateContractValidator from "./../../Validators/CreateContractValidator";
import { messageError, validatePagination } from "App/Utils/functions";
import Contract from "./../../Models/Contract";
import { IContract } from "./../../Utils/interfaces/contract";
import { AuditTrail } from "App/Utils/classes";
import { getToken } from "App/Utils/functions/jwt";

export default class ContractsController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract, data?) {
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
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

  public async showAll({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de Contratos completa. | Sin paginación",
      status: 200,
    };

    const { page, pageSize, key, value /*only*/ } = request.qs();
    let pagination: IPaginationValidated = { page: 0, pageSize: 1000000 };
    if (request.qs().with && request.qs().with === "pagination") {
      pagination = validatePagination(key, value, page, pageSize);
      responseData["message"] =
        "Lista de Contratos completa. | Con paginación.";
    }

    let count: number =
      pagination["page"] > 0
        ? pagination["page"] * pagination["pageSize"] - pagination["pageSize"]
        : 0;
    console.log(count);

    try {
      const contracts = await Contract.all();
      responseData["results"] = contracts;
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al obtener todos los Contratos.",
        400
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
