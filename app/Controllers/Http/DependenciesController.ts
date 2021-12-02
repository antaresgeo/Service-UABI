import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { IResponseData } from "./../../Utils/interfaces/index";

export default class DependenciesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async list({ response }: HttpContextContract) {
    let responseData: IResponseData = { message: "", status: 200 };

    try {
      // const costCenter
      return response.status(responseData["status"]);
    } catch (error) {
      responseData["status"] = 500;
      return response.status(responseData["status"]);
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
