import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { IResponseData } from "./../../Utils/interfaces/index";
import CostCenter from "App/Models/CostCenter";
import { messageError } from "App/Utils/functions";
import Dependency from "App/Models/Dependency";

export default class DependenciesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async list({ response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de Dependencias.",
      status: 200,
    };
    let dependencies: Dependency[],
      costCenters: CostCenter[],
      data: any[] = [];

    try {
      dependencies = await Dependency.query().orderBy("id", "asc");
      // const dependencies = await CostCenter.query().where('status', 1)
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al obtener las Dependencias",
        500
      );
    }

    await Promise.all(
      dependencies.map(async (dependency) => {
        try {
          costCenters = await CostCenter.query().where(
            "dependency_id",
            Number(dependency["$attributes"]["id"])
          );
          // responseData["results"] = dependency;
          // const dependencies = await dependency.query().where('status', 1)
        } catch (error) {
          return messageError(
            error,
            response,
            "Error al obtener los Centros de Costos",
            500
          );
        }

        data.push({
          ...dependency["$attributes"],
          subs: costCenters,
        });
      })
    );

    responseData["results"] = data;

    return response.status(responseData["status"]).json(responseData);
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
