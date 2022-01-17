import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { IResponseData } from "App/Utils/interfaces";

export default class DispositionsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async list({ request, response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de BI por Activo Fijo",
      status: 200,
    };

    const {} = request.qs();

    return response.status(responseData["status"]).json(responseData);
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
