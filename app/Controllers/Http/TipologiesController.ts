import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tipology from "./../../Models/Tipology";
import { IResponseData } from "App/Utils/interfaces";
import { ITipology } from "./../../Utils/interfaces/tipology";
import { AuditTrail } from "App/Utils/classes";
import { getToken } from "App/Utils/functions/jwt";
import { messageError } from "App/Utils/functions";

export default class TipologiesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Tipología registrada y creada correctamente.",
      status: 200,
    };
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
    const requestBodyPayload = request.body();
    const { action } = request.qs();
    let dataToCreate: ITipology[] = [];

    // Audit Trail
    const auditTrail = new AuditTrail(token);
    await auditTrail.init();
    console.log(requestBodyPayload);

    if (!action || String(action).toUpperCase() === "ONE") {
      dataToCreate.push({
        tipology: requestBodyPayload["tipology"].toUpperCase(),
        accounting_account: requestBodyPayload["accounting_account"],

        status: 1,
        audit_trail: auditTrail.getAsJson(),
      });
    } else {
      requestBodyPayload["data"].map((tmpTipology) => {
        dataToCreate.push({
          tipology: tmpTipology["tipology"].toUpperCase(),
          accounting_account: tmpTipology["accounting_account"],

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      });
    }

    try {
      const tipologiesCreated = await Tipology.createMany(dataToCreate);

      responseData["results"] = tipologiesCreated;
      responseData["total_results"] = tipologiesCreated.length;

      if (!action || String(action).toUpperCase() === "ONE") {
        responseData["results"] = tipologiesCreated[0];
        responseData["total_results"] = 1;
      }
    } catch (error) {
      return messageError(error, response, "Error al crear las tipologías");
    }
    return response.status(responseData["status"]).json(responseData);
  }

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.qs();

    try {
      const tipology = await Tipology.findOrFail(id);

      return response.status(200).json({
        message: `Tipología y Cuenta Contable del ID: ${id}`,
        results: tipology,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: `Error al obtener la tipología y cuenta contable del ID: ${id}`,
      });
    }
  }

  public async showAll({ response }: HttpContextContract) {
    try {
      const tipologies = await Tipology.query()
        .select(["id", "tipology", "accounting_account"])
        .where("status", 1)
        .orderBy("id", "asc");
      return response.status(200).json({
        message: "Lista de Tipologías y Cuenta Contable",
        results: tipologies,
      });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Error al obtener las tipologías" });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
