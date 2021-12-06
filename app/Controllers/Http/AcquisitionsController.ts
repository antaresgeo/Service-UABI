import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Acquisition from "App/Models/Acquisition";
import AuditTrail from "./../../Utils/classes/AuditTrail";
import CreateAcquisitionValidator from "./../../Validators/CreateAcquisitionValidator";
import { IAdquisitionAttributes } from "./../../Utils/interfaces/adquisitions.interfaces";
import { getToken, messageError } from "App/Utils/functions";
import { IResponseData } from "App/Utils/interfaces";

export default class AdquisitionsController {
  /**
   * create Acquisition
   */
  public async create({ request, response }: HttpContextContract) {
    const { token } = getToken(request.headers());
    let dataAdquisition = await request.validate(CreateAcquisitionValidator),
      newAdquisition;

    let data: IAdquisitionAttributes = { ...dataAdquisition };

    try {
      // Creation: Data of audit trail
      let auditTrail: AuditTrail = new AuditTrail(token);
      await auditTrail.init();

      data.audit_trail = auditTrail.getAsJson();
      data.status = 1;

      // Service consumption
      newAdquisition = await Acquisition.create(data);
      // if (typeof newAdquisition === "number")
      //   return ctx.response
      //     .status(500)
      //     .json({ message: "¡Error al crear el bien inmueble!" });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }

    return response.status(200).json({
      message: "¡Nuevas Adquisiciones creadas satisfactoriamente!",
      results: newAdquisition,
    });
  }

  /**
   * create Acquisition
   */
  public async createMany(ctx: HttpContextContract, _newAcquisitions?: any[]) {
    const { token } = getToken(ctx.request.headers());

    let dataAdquisition = ctx.request.body();
    let newAcquisitions: any[] = [];
    let auditTrail: AuditTrail = new AuditTrail(token);
    let dataToCreate: any[] = [];

    if (_newAcquisitions) {
      await Promise.all(
        _newAcquisitions.map(async (acquisition) => {
          await auditTrail.init();
          dataToCreate.push({
            ...acquisition,
            status: 1,
            audit_trail: auditTrail.getAsJson(),
          });
        })
      );

      try {
        newAcquisitions = await Acquisition.createMany(dataToCreate);
        return newAcquisitions;
        return ctx.response.status(200).json({
          message: `Nuevas adquisiciones creadas satisfactoriamente. [ ${newAcquisitions.length} ]`,
          results: newAcquisitions,
        });
      } catch (error) {
        return messageError(
          error,
          ctx.response,
          "Error inesperado al crear las nuevas adquisiciones. [ Multiple ]"
        );
      }
    }

    let data = dataAdquisition.data;

    data.map(async (act) => {
      try {
        // Creation: Data of audit trail

        await auditTrail.init();

        act.audit_trail = auditTrail.getAsJson();
        act.status = 1;

        // Service consumption
        const newAdquisition = await Acquisition.create(act);
        // if (typeof newAdquisition === "number")
        //   return ctx.response
        //     .status(500)
        //     .json({ message: "¡Error al crear el bien inmueble!" });
        newAcquisitions.push(newAdquisition["$attributes"]);
      } catch (error) {
        console.error(error);
        return ctx.response
          .status(500)
          .json({ message: "Error interno: Servidor", error });
      }
    });

    return ctx.response.status(200).json({
      message: "¡Nuevas Adquisiciones creadas satisfactoriamente!",
      results: newAcquisitions,
    });
  }

  // GET
  public async getAll(ctx: HttpContextContract) {
    try {
      const results: any = await Acquisition.query().where("status", 1);

      return ctx.response
        .status(200)
        .json({ message: "All adquisitions", results });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
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
        newAcquisitionsCreated = await this.createMany(ctx, newAcquisitions);
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
