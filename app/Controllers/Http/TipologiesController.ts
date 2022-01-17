import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tipology from "./../../Models/Tipology";
import { IResponseData } from "App/Utils/interfaces";
import { ITipology } from "./../../Utils/interfaces/tipology";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { getToken } from "App/Utils/functions/jwt";

export default class TipologiesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Tipología registrada y creada correctamente.",
      status: 200,
    };
    const { token } = getToken(request.headers());
    const { tipology, accounting_account } = request.body();

    // Audit Trail
    const auditTrail = new AuditTrail(token);
    await auditTrail.init();

    let dataToCreate: ITipology = {
      tipology,
      accounting_account,

      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };
    console.log(dataToCreate);

    try {
      // Tipology.createMany()
    } catch (error) {
      return response.status(responseData["status"]).json(responseData);
    }
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
