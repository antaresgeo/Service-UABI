import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RealEstateOwner from "App/Models/RealEstateOwner";
import OcupationRealEstate from "./../../Models/OcupationRealEstate";
import PhysicalInspection from "./../../Models/PhysicalInspection";
import PublicService from "./../../Models/PublicService";
import RealEstateProperty from "./../../Models/RealEstateProperty";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { getToken } from "App/Utils/functions";

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
    if (!id)
      return response
        .status(400)
        .json({ message: "Ingrese el ID del Bien Inmueble." });

    const dataBody = request.body();

    // OCUPATION VARIABLES
    const newOcupation = JSON.parse(dataBody.ocupation);
    let ocupation: OcupationRealEstate, updatedOcupation: OcupationRealEstate;

    // PHYSICAL INSPECTION VARIABLES
    const newPhysicalInspection = JSON.parse(dataBody.physical_inspection);
    let physicalInspection: PhysicalInspection,
      updatedPhysicalInspection: PhysicalInspection;

    // PUBLIC SERVICES VARIABLES
    const newPublicServices = JSON.parse(dataBody.public_services);
    let publicServices: PublicService[],
      updatedPublicServices: PublicService[] = [];

    // RE PROPERTIES VARIABLES
    const newProperties = JSON.parse(dataBody.properties);
    let properties: RealEstateProperty[],
      updatedProperties: RealEstateProperty[] = [];

    // RE OWNER VARIABLES
    const newOwner = JSON.parse(dataBody.owner);
    let owner: RealEstateOwner, updatedOwner: RealEstateOwner;

    // PHOTOGRAPHIC REGISTER
    const images = request.files("image");
    console.log(images);
    // return images

    const token = getToken(request.headers());

    // Update Ocupation
    try {
      ocupation = await OcupationRealEstate.findByOrFail("real_estate_id", id);

      const auditTrail = new AuditTrail(token, ocupation["audit_trail"]);
      await auditTrail.update(newOcupation, ocupation);

      updatedOcupation = await ocupation
        .merge({ ...newOcupation, audit_trail: auditTrail.getAsJson() })
        .save();
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al actualizar la Ocupación actual de la inspección.\nRevisar Terminal.",
      });
    }

    // Update Physical Inspection
    try {
      physicalInspection = await PhysicalInspection.findByOrFail(
        "real_estate_id",
        id
      );

      const auditTrail = new AuditTrail(
        token,
        physicalInspection["audit_trail"]
      );
      await auditTrail.update(newPhysicalInspection, physicalInspection);

      updatedPhysicalInspection = await physicalInspection
        .merge({
          ...newPhysicalInspection,
          audit_trail: auditTrail.getAsJson(),
        })
        .save();
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al actualizar la Inspección Física actual de la inspección.\nRevisar Terminal.",
      });
    }

    // Update Public Services
    try {
      publicServices = await PublicService.query().where(
        "physical_inspection_id",
        physicalInspection["id"]
      );

      await Promise.all(
        publicServices.map((publicService) => {
          newPublicServices.map(async (newPublicService) => {
            console.log(newPublicService);
            console.log(publicService);

            if (publicService["name"] === newPublicService["name"]) {
              const auditTrail = new AuditTrail(
                token,
                publicService["audit_trail"]
              );
              await auditTrail.update(newPublicService, publicService);

              updatedPublicServices.push(
                await publicService
                  .merge({
                    ...newPublicService,
                    audit_trail: auditTrail.getAsJson(),
                  })
                  .save()
              );
            }
          });
        })
      );
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al actualizar los Servicios Públicos actuales de la inspección.\nRevisar Terminal.",
      });
    }

    // Update Properties
    try {
      properties = await RealEstateProperty.query().where(
        "physical_inspection_id",
        physicalInspection["id"]
      );

      await Promise.all(
        properties.map((property) => {
          newProperties.map(async (newProperty) => {
            if (property["name"] === newProperty["name"]) {
              const auditTrail = new AuditTrail(token, property["audit_trail"]);
              await auditTrail.update(newProperties, property);

              updatedProperties.push(
                await property
                  .merge({
                    ...newProperty,
                    audit_trail: auditTrail.getAsJson(),
                  })
                  .save()
              );
            }
          });
        })
      );
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al actualizar las Características del Bien Inmueble actual de la inspección.\nRevisar Terminal.",
      });
    }

    // Update Owner
    try {
      owner = await RealEstateOwner.findByOrFail("real_estate_id", id);

      const auditTrail = new AuditTrail(token, owner["audit_trail"]);
      await auditTrail.update(newOwner, owner);

      updatedOwner = await owner
        .merge({ ...newOwner, audit_trail: auditTrail.getAsJson() })
        .save();
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Error inesperado al actualizar el Propietario actual de la inspección.\nRevisar Terminal.",
      });
    }

    try {
      return response.json({
        message: "Inspección del BI actualizada.",
        results: {
          updated_ocupation: updatedOcupation["$attributes"],
          physical_inspection: {
            ...updatedPhysicalInspection["$attributes"],
            updatedPublicServices,
            updatedProperties,
          },
          owner: updatedOwner["$attributes"],
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Error Inesperado" });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
