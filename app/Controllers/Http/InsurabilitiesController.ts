import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Insurability from "App/Models/Insurability";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { newAuditTrail } from "App/Utils/functions";
import { IAuditTrail, IUpdatedValues } from "App/Utils/interfaces";

export default class InsurabilitiesController {
  //   POST
  /**
   * create Acquisition
   */
  public async create(ctx: HttpContextContract) {
    let dataInsurability = ctx.request.body();

    try {
      // Creation: Data of audit trail
      let auditTrail: IAuditTrail = newAuditTrail();
      dataInsurability.audit_trail = auditTrail;
      dataInsurability.status = 1;

      // Service consumption
      const newInsurability = await Insurability.create(dataInsurability);
      if (typeof newInsurability === "number")
        return ctx.response
          .status(500)
          .json({ message: "¡Error al crear el bien inmueble!" });

      return ctx.response.status(200).json({
        message: "¡Nueva Póliza creada satisfactoriamente!",
        results: newInsurability,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
  }

  // GET
  public async getAll(ctx: HttpContextContract) {
    try {
      const results: any = await Insurability.query().where("status", 1);
      const auditTrail = new AuditTrail(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      );
      console.log(auditTrail.getCreatedOn());

      return ctx.response
        .status(200)
        .json({ message: "All Insurabilities", results });
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

      let insurabilities: any | null = null;
      if (typeof real_estate_id === "string")
        insurabilities = await Insurability.query()
          .where("real_estate_id", real_estate_id)
          .where("status", 1);

      if (insurabilities === null) {
        return ctx.response
          .status(404)
          .json({ error: "No insurability Found" });
      }

      ctx.response.status(200).json({
        message: `All insurabilities by Real Estate ${real_estate_id}`,
        results: insurabilities,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
  }

  /**
   * getOne
   */
  public async getOne(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();
    let insurability: Insurability | null;

    try {
      insurability = await Insurability.find(id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "insurability error" });
    }

    const data = insurability === null ? {} : insurability;

    return ctx.response.json({ message: "insurability", results: data });
  }

  // PUT
  /**
   * update
   */
  public async update(ctx: HttpContextContract) {
    const newData = ctx.request.body();
    const { id } = ctx.request.qs();

    try {
      if (typeof id === "string") {
        const insurabilty = await Insurability.findOrFail(id);

        const lastestValues = { ...insurabilty["$attributes"] };
        delete lastestValues["audit_trail"];
        let updatedValues: IUpdatedValues = {
          lastest: {
            ...lastestValues,
          },
          new: newData,
        };

        let tmpData: any = { ...insurabilty["$attributes"] };
        if (tmpData.audit_trail?.updated_values)
          if (!tmpData.audit_trail.updated_values.oldest) {
            const oldestValues = { ...insurabilty["$attributes"] };
            delete oldestValues["audit_trail"];

            updatedValues.oldest = {
              ...oldestValues,
            };
          } else
            updatedValues.oldest = tmpData.audit_trail.updated_values.oldest;

        let auditTrail: IAuditTrail = {
          created_by: tmpData.audit_trail?.created_by,
          created_on: tmpData.audit_trail?.created_on,
          updated_by: "Administrator",
          updated_on: new Date().getTime(),
          updated_values: updatedValues,
        };

        // Updating data
        try {
          const results = await insurabilty
            .merge({
              ...newData,
              audit_trail: auditTrail,
            })
            .save();

          return ctx.response.status(200).json({
            message: `Póliza ${insurabilty.id} actualizada satisfactoriamente`,
            results: results,
          });
        } catch (error) {
          console.error(error);
          return ctx.response
            .status(500)
            .json({ message: "Error al actualizar: Servidor", error });
        }
      }
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
  }

  /**
   * changeStatus
   */
  private async changeStatus(id: string | number) {
    try {
      const project = await Insurability.findOrFail(id);

      project.status = project.status === 1 ? 0 : 1;

      const tmpProject = await project.save();

      return { success: true, results: tmpProject };
    } catch (error) {
      console.error(`Error changing status:\n${error}`);
      return { success: false, results: error };
    }
  }
}
