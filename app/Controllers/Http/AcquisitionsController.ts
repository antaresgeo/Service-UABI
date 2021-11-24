import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Acquisition from "App/Models/Acquisition";
import AuditTrail from "./../../Utils/classes/AuditTrail";
import CreateAcquisitionValidator from "./../../Validators/CreateAcquisitionValidator";
import { IAdquisitionAttributes } from "./../../Utils/interfaces/adquisitions.interfaces";
import { getToken } from "App/Utils/functions";

export default class AdquisitionsController {
  /**
   * create Acquisition
   */
  public async create({ request, response }: HttpContextContract) {
    const token = getToken(request.headers());
    let dataAdquisition = await request.validate(CreateAcquisitionValidator),
      newAdquisition;

    let data: IAdquisitionAttributes = { ...dataAdquisition };

    try {
      // Creation: Data of audit trail
      let auditTrail: AuditTrail = new AuditTrail(token);
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
  public async createMany(ctx: HttpContextContract) {
    const token = getToken(ctx.request.headers());

    let dataAdquisition = ctx.request.body();
    let newAcquisitions: any[] = [];

    let data = dataAdquisition.data;

    data.map(async (act) => {
      try {
        // Creation: Data of audit trail
        let auditTrail: AuditTrail = new AuditTrail(token);
        act.audit_trail = auditTrail.getAsJson();
        act.status = 1;

        // Service consumption
        const newAdquisition = await Acquisition.create(act);
        // if (typeof newAdquisition === "number")
        //   return ctx.response
        //     .status(500)
        //     .json({ message: "¡Error al crear el bien inmueble!" });
        newAcquisitions.push(newAdquisition);
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
}

// {
// 	acquisition_type,
// 	active_type,
// 	title_type,
// 	title_type_document_id,
// 	act_number,
// 	act_value,

// 	plot_area,
// 	construction_area,
// 	acquired_percentage,
// 	seller,

// 	entity_type,
// 	entity_number,
// 	addctx.responses,
// 	real_estate_id,
// }

// export const _getRealEstate = async (ctx.request: ctx.requestuest, ctx.response: ctx.responseponse) => {
// 	const { id } = ctx.request.query;

// 	try {
// 		const realEstate = await getRealEstate(String(id));

// 		if (!realEstate) {
// 			ctx.response.status(404).json({ error: 'No Real Esate Found' });
// 			return;
// 		}

// 		ctx.response.status(200).json({ message: 'Real Estate', results: data: realEstate });
// 	} catch (error) {
// 		console.error(error);
// 		try {
// 			ctx.response.status(500).json({ message: 'Error interno: Servidor', error });
// 		} catch (error) {
// 			console.error(error);
// 		}
// 		return;
// 	}
