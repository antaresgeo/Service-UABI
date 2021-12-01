import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RealEstateOwner from "App/Models/RealEstateOwner";
import OcupationRealEstate from "./../../Models/OcupationRealEstate";
import PhysicalInspection from "./../../Models/PhysicalInspection";
import PublicService from "./../../Models/PublicService";
import RealEstateProperty from "./../../Models/RealEstateProperty";

export default class InspectionsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ response, request }: HttpContextContract) {
    const { id } = request.qs();
    let ocupation: OcupationRealEstate,
      physicalInspection: PhysicalInspection,
      publicServices: PublicService[],
      attrPublicServices: any[] = [],
      realEstateProperties: RealEstateProperty[],
      attrRealEstateProperties: any[] = [],
      owner: RealEstateOwner;

    if (!id)
      return response
        .status(400)
        .json({ message: "Ingrese el ID del Bien Inmueble." });

    // Ocupation
    try {
      ocupation = await OcupationRealEstate.findByOrFail("real_estate_id", id);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al obtener la Ocupación actual de la inspección.\nRevisar Terminal.",
      });
    }

    // Physical Inspection
    try {
      physicalInspection = await PhysicalInspection.findByOrFail(
        "real_estate_id",
        id
      );
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al obtener la Inspección Física actual de la inspección.\nRevisar Terminal.",
      });
    }

    // Public Services
    try {
      publicServices = await PublicService.query().where(
        "physical_inspection_id",
        physicalInspection["id"]
      );
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al obtener los Servicios Públicos actual de la inspección.\nRevisar Terminal.",
      });
    }

    publicServices.map((publicService) => {
      attrPublicServices.push(publicService["$attributes"]);
    });

    // Real Estate Properties
    try {
      realEstateProperties = await RealEstateProperty.query().where(
        "physical_inspection_id",
        physicalInspection["id"]
      );
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al obtener las Propiedades / Características del Bien Inmueble actual de la inspección.\nRevisar Terminal.",
      });
    }

    realEstateProperties.map((realEstateProperty) => {
      attrRealEstateProperties.push(realEstateProperty["$attributes"]);
    });

    // Data Owoner
    try {
      owner = await RealEstateOwner.findByOrFail("real_estate_id", id);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al obtener el Propietario actual de la inspección.\nRevisar Terminal.",
      });
    }

    return response.status(200).json({
      message: `Información de Ocupación, Inspección Física, Poseedor y Registro Fotográfico del Bien Inmueble con ID: ${id}`,
      results: {
        ocupation,
        physical_inspection: {
          ...physicalInspection["$attributes"],
          inspection_date:
            physicalInspection["$attributes"]["inspection_date"] === null
              ? "No realizada"
              : physicalInspection["$attributes"]["inspection_date"],
          public_services: attrPublicServices,
          properties: attrRealEstateProperties,
        },
        owner,
      },
    });
  }

  public async edit({}: HttpContextContract) {}

  public async update({ response, request }: HttpContextContract) {
    const { id } = request.qs();
    const dataBody = request.body();
    const ocupation = JSON.parse(dataBody.ocupation);
    const physicalInspection = JSON.parse(dataBody.physical_inspection);

    const images = request.files("image");
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
