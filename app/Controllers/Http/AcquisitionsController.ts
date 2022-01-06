import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Acquisition from "App/Models/Acquisition";
import AuditTrail from "./../../Utils/classes/AuditTrail";
import CreateAcquisitionValidator from "./../../Validators/CreateAcquisitionValidator";
import { IAcquisition } from "../../Utils/interfaces/acquisitions";
import { getToken, messageError } from "App/Utils/functions";
import { IResponseData } from "App/Utils/interfaces";
import CreateManyAcquisitionValidator from "App/Validators/CreateManyAcquisitionValidator";

export default class AdquisitionsController {
  /**
   * create Acquisition
   */
  public async create(
    { request, response }: HttpContextContract,
    _newAcquisitions?: any[]
  ) {
    let responseData: IResponseData = {
      message: "Adquisiciones creadas correctamente.",
      status: 200,
    };
    const { token } = getToken(request.headers());
    let dataAcquisition, newAcquisitions: Acquisition[];
    const { action } = request.qs();

    if (action === "one")
      dataAcquisition = await request.validate(CreateAcquisitionValidator);
    if (action === "many")
      dataAcquisition = _newAcquisitions
        ? { data: _newAcquisitions }
        : await request.validate(CreateManyAcquisitionValidator);

    // Creation: Data of audit trail
    let auditTrail: AuditTrail = new AuditTrail(token);
    await auditTrail.init();

    let dataToCreate: any[] = [];

    if (dataAcquisition["data"]) {
      dataAcquisition["data"].map((acquisition) => {
        dataToCreate.push({
          ...acquisition,
          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      });
    } else {
      dataToCreate.push({
        ...dataAcquisition,
        status: 1,
        audit_trail: auditTrail.getAsJson(),
      });
    }

    try {
      // Service consumption
      newAcquisitions = await Acquisition.createMany(dataToCreate);

      responseData["results"] = newAcquisitions;
      if (newAcquisitions.length === 1) {
        responseData["message"] = "Adquisición creada correctamente.";
        responseData["results"] = newAcquisitions[0];
      }
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al crear las adquisiciones.",
        400
      );
    }

    if (_newAcquisitions) return responseData["results"];
    return response.status(responseData["status"]).json(responseData);
  }

  // GET
  public async getAll({ response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de todas las Adquisiciones.",
      status: 200,
    };
    let acquisitions: Acquisition[] = [];

    try {
      acquisitions = await Acquisition.query()
        .preload("status_info")
        .preload("real_estate_info", (res) => {
          res.select(["id", "registry_number"]);
        })
        .where("status", 1);
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al obtener las adquisiones.",
        400
      );
    }

    // Order data to show
    let dataToShow: IAcquisition[] = [];

    acquisitions.map((acquisition) => {
      // console.log(acquisition["$preloaded"]);

      let tmp: any = {
        ...acquisition["$attributes"],
        ...acquisition["$preloaded"],
      };
      delete tmp["status"];

      dataToShow.push({ ...tmp });
    });
    responseData["results"] = dataToShow;

    return response.status(responseData["status"]).json(responseData);
  }

  /**
   * getByRealEstate
   */
  public async getByRealEstate(ctx: HttpContextContract) {
    try {
      const { real_estate_id } = ctx.request.qs();

      let adquisitions;
      if (typeof real_estate_id === "string")
        adquisitions = await Acquisition.query()
          .where("real_estate_id", real_estate_id)
          .where("status", 1);

      if (!adquisitions) {
        ctx.response.status(404).json({ error: "No Real Esate Found" });
        return;
      }

      ctx.response.status(200).json({
        message: `All adquisitions by Real Estate ${real_estate_id}`,
        results: adquisitions,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
  }

  // PUT
  /**
   * changeStatus
   */
  private async changeStatus(id: string | number) {
    try {
      const acquisition = await Acquisition.findOrFail(id);

      acquisition.status = acquisition.status === 1 ? 0 : 1;

      const tmpProject = await acquisition.save();

      return { success: true, results: tmpProject };
    } catch (error) {
      console.error(`Error changing status:\n${error}`);
      return { success: false, results: error };
    }
  }

  /**
   * inactivate
   */
  public async inactivate(ctx: HttpContextContract) {
    try {
      const { id } = ctx.request.qs();

      const { success, results } = await this.changeStatus(id);

      if (success)
        return ctx.response.status(200).json({
          message: `Proyecto ${
            results.status === 1 ? "activado" : "inactivado"
          }.`,
          id: results["$attributes"]["id"],
        });
      else
        return ctx.response
          .status(500)
          .json({ message: "Project update failed!" });
    } catch (error) {
      console.error(error);

      return ctx.response
        .status(500)
        .json({ message: "Project update failed!" });
    }
  }

  /**
   * update
   */
  public async update({}: HttpContextContract, lastAcquisitions?: any[]) {
    console.log(lastAcquisitions);
  }

  /**
   * update
   */
  public async updateMany(ctx: HttpContextContract) {
    let responseData: IResponseData = { message: "", status: 200 };
    const { request, response } = ctx;
    const { token } = getToken(request.headers());

    const { acquisitions } = request.body();

    const newAcquisitions = acquisitions.filter(
      (acquisition) => !acquisition.id
    );

    const oldAcquisitions = acquisitions.filter(
      (acquisition) => acquisition.id
    );

    let newAcquisitionsCreated;
    if (newAcquisitions.length > 0) {
      // Create new acquisitions
      try {
        newAcquisitionsCreated = await this.create(ctx, newAcquisitions);
      } catch (error) {
        return messageError(
          error,
          response,
          "Error inesperado al crear las nuevas adquisiciones."
        );
      }
    }

    // Update acquisitions
    let oldAcquisitionsUpdated: any[] = [];
    try {
      await Promise.all(
        oldAcquisitions.map(async (acquisition) => {
          let actualAcquisition: Acquisition;
          try {
            actualAcquisition = await Acquisition.findOrFail(acquisition.id);
          } catch (error) {
            return messageError(
              error,
              response,
              `ID: ${acquisition.id} no existe, revisar los ids enviados.`
            );
          }

          let dataToUpdate = {
            ...actualAcquisition["$attributes"],
          };

          delete dataToUpdate["id"];
          delete dataToUpdate["status"];
          delete dataToUpdate["audit_trail"];

          const auditTrail = new AuditTrail(
            token,
            actualAcquisition["audit_trail"]
          );

          await auditTrail.update({ ...dataToUpdate }, actualAcquisition);

          dataToUpdate["audit_trail"] = auditTrail.getAsJson();

          const newAcquistion = await actualAcquisition
            .merge(dataToUpdate)
            .save();
          oldAcquisitionsUpdated.push(newAcquistion);
        })
      );
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al actualizar las nuevas adquisiciones."
      );
    }

    responseData["results"] = {
      old_acquisitions: oldAcquisitionsUpdated,
      new_acquisitions: newAcquisitionsCreated,
    };

    responseData["total_results"] =
      oldAcquisitionsUpdated.length + newAcquisitionsCreated.length;

    return response.status(responseData["status"]).json(responseData);
  }
}
