import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProjectContract from "App/Models/ProjectContract";
import { AuditTrail } from "App/Utils/classes";
import { messageError } from "App/Utils/functions";
import { IResponseData } from "App/Utils/interfaces";
import { getToken } from "App/Utils/functions/jwt";

export default class ProjectContractsController {
  public async index({}: HttpContextContract) {}

  // public async create({}: HttpContextContract) {}

  /**
   * createContracts
   */
  public async create(
    { response, request }: HttpContextContract,
    contracts: any[],
    projectId: number
  ) {
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
    let dataToCreate: any[] = [];

    const auditTrail = new AuditTrail(token);
    await auditTrail.init();

    contracts.map((contract) => {
      let tmp = {
        ...contract,
        vigency_start: contract["validity"]["start_date"],
        vigency_end: contract["validity"]["end_date"],

        project_id: projectId,

        status: 1,
        audit_trail: auditTrail.getAsJson(),
      };
      delete tmp["validity"];
      dataToCreate.push({
        ...tmp,
      });
    });

    try {
      const contractsCreated = await ProjectContract.createMany(dataToCreate);
      return contractsCreated;
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al crear los contratos.",
        500
      );
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  /**
   * Show all contracts for ID Project
   */
  public async showByProject(
    { request, response }: HttpContextContract,
    id?: number
  ) {
    let responseData: IResponseData = {
      message: "Contratos del proyecto con ID: ",
      status: 200,
    };

    let _id: number;
    if (id) _id = id;
    else {
      const { id } = request.qs();
      _id = id;
    }

    if (!_id)
      return messageError({}, response, "Ingrese el ID del proyecto.", 400);
    responseData["message"] += String(_id);

    try {
      const contracts: ProjectContract[] = await ProjectContract.query()
        .where("status", 1)
        .where("project_id", _id);

      let dataToReturn: any[] = [];
      contracts.map((contract) => {
        let tmp = { ...contract["$attributes"] };
        delete tmp["project_id"];
        delete tmp["status"];
        delete tmp["audit_trail"];

        dataToReturn.push({ ...tmp });
      });

      if (id) return dataToReturn;
      responseData["results"] = dataToReturn;
    } catch (error) {
      return messageError(
        error,
        response,
        `Error al obtener los contratos del proyecto con ID: ${_id}`
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  private async changeStatus(id: string | number) {
    try {
      const contract = await ProjectContract.findOrFail(id);

      contract.status = contract.status === 1 ? 0 : 1;

      const c = await contract.save();

      return { success: true, results: c };
    } catch (error) {
      console.error(`Error changing status:\n${error}`);
      return { success: false, results: error };
    }
  }

  public async inactivate(
    { response }: HttpContextContract,
    deleteContract: any
  ) {
    // const { token } = getToken(request.headers(), {response} as HttpContextContract);
    // const { id } = request.params();

    const { success, results } = await this.changeStatus(deleteContract.id);

    if (success)
      return response.status(200).json({
        message: "Contrato Inactivado",
        results,
      });
    else {
      let message: string =
          "A ocurrido un error inesperado al inactivar el Contrato.",
        status: number = 500;

      console.error(results.message);
      console.error(results);
      if (results.message === "E_ROW_NOT_FOUND: Row not found") {
        message = "No se ha encontrado un Contrato para el ID buscado.";
        status = 400;
      }
      return response.status(status).json({
        message,
        error: { name: results.name },
      });
    }
  }
}
