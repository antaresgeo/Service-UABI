import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class InspectionsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ response, request }: HttpContextContract) {
    const { id } = request.qs();
    const dataBody = request.body();
    const ocupation = JSON.parse(dataBody.ocupation);
    const physicalInspection = JSON.parse(dataBody.physical_inspection);

    const images = request.file("image");
    console.log(images);
    // return images

    if (!id)
      return response
        .status(400)
        .json({ message: "Ingrese el ID del Bien Inmueble." });

    try {
      return response.json({ ocupation, physicalInspection });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Error Inesperado" });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
