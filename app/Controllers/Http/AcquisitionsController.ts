import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Acquisition from "App/Models/Acquisition";
import AuditTrail from "./../../Utils/classes/AuditTrail";

export default class AdquisitionsController {
  /**
   * create Acquisition
   */
  public async create(ctx: HttpContextContract) {
    let dataAdquisition = ctx.request.body();
    let newAcquisitions: any[] = [];

    let data = dataAdquisition.data;

    data.map(async (act) => {
      try {
        // Creation: Data of audit trail
        let auditTrail: AuditTrail = new AuditTrail();
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
  public async changeStatus(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();

    try {
      const project = await Acquisition.findOrFail(id);

      project.status = project.status === 1 ? 0 : 1;

      await project.save();
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Project update failed!" });
    }

    return ctx.response
      .status(200)
      .json({ message: "Project updated successfully!" });
  }
}
// export const update = async (ctx.request: ctx.requestuest, ctx.response: ctx.responseponse) => {
// 	const newData: IRealEstateAttributes = ctx.request.body;
// 	const { id } = ctx.request.query;

// 	try {
// 		if (typeof id === 'string') {
// 			const data: any = await getRealEstate(id);

// 			let updatedValues: IUpdatedValues = {
// 				lastest: {
// 					registry_number: data.dataValues.registry_number,
// 					active_type: data.dataValues.active_type,
// 					name: data.dataValues.name,
// 					description: data.dataValues.description,
// 					addctx.responses: data.dataValues.addctx.responses,
// 					destination: data.dataValues.destination,
// 					acquisition_type: data.dataValues.acquisition_type,
// 					act_number: data.dataValues.act_number,
// 					acquisition_date: data.dataValues.acquisition_date,
// 					notary: data.dataValues.notary,
// 					notary_addctx.responses: data.dataValues.notary_addctx.responses,
// 					patrimonial_value: data.dataValues.patrimonial_value,
// 					commertial_value: data.dataValues.commertial_value,
// 					area: data.dataValues.area,
// 					acquired_percentage: data.dataValues.acquired_percentage,
// 					society: data.dataValues.society,
// 					account: data.dataValues.account,
// 					property_type: data.dataValues.property_type,
// 					cbml: data.dataValues.cbml,
// 					project_id: data.dataValues.project_id,
// 				},
// 				new: newData,
// 			};

// 			let tmpData: IRealEstateAttributes = data.dataValues;
// 			if (tmpData.audit_trail?.updated_values)
// 				if (!tmpData.audit_trail.updated_values.oldest)
// 					updatedValues.oldest =
// 						data.dataValues.audit_trail.updated_values.lastest;
// 				else updatedValues.oldest = tmpData.audit_trail.updated_values.oldest;

// 			let auditTrail: IAuditTrail = {
// 				created_by: tmpData.audit_trail?.created_by,
// 				created_on: tmpData.audit_trail?.created_on,
// 				updated_by: 'UABI',
// 				updated_on: String(new Date().getTime()),
// 				updated_values: updatedValues,
// 			};

// 			// newData.audit_trail = auditTrail;

// 			let query = await updateRealEstate(
// 				{ ...newData, audit_trail: auditTrail },
// 				id
// 			);

// 			ctx.response.status(200).json({ message: 'Updated successfully!', results: data: query });
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		ctx.response.status(500).json({ message: 'Error interno: Servidor', error });
// 	}
// };

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
