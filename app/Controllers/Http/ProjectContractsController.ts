import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProjectContract from "App/Models/ProjectContract";
import { messageError } from "App/Utils/functions";
import { IResponseData } from "App/Utils/interfaces";

export default class ProjectContractsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  /**
   * Show all contracts for ID Project
   */
  public async showByProject({ request, response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Contratos del proyecto con ID: ",
      status: 200,
    };

    const { id } = request.qs();

    if (!id)
      return messageError({}, response, "Ingrese el ID del proyecto.", 400);
    responseData["message"] += String(id);

    try {
      const contracts: ProjectContract[] = await ProjectContract.query()
        .where("status", 1)
        .where("project_id", id);

      let dataToReturn: any[] = [];
      contracts.map((contract) => {
        let tmp = { ...contract["$attributes"] };
        delete tmp["project_id"];
        delete tmp["status"];
        delete tmp["audit_trail"];

        dataToReturn.push({ ...tmp });
      });

      responseData["results"] = dataToReturn;
    } catch (error) {
      return messageError(
        error,
        response,
        `Error al obtener los contratos del proyecto con ID: ${id}`
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
