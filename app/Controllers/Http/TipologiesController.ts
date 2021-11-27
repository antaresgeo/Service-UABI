import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Tipology from "./../../Models/Tipology";

export default class TipologiesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

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
      return response
        .status(500)
        .json({
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
