import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Insurability from "App/Models/Insurability";
// import RealEstate from "App/Models/RealEstate";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { getToken, sum, validateDate } from "App/Utils/functions";
import { IAuditTrail, IUpdatedValues } from "App/Utils/interfaces";
import RealEstate from "./../../Models/RealEstate";
export default class InsurabilitiesController {
  //   POST
  /**
   * create Acquisition
   */
  public async create(ctx: HttpContextContract) {
    const token = getToken(ctx.request.headers());

    let dataInsurability = ctx.request.body();

    let dataToCreate = {
      ...dataInsurability,
    };
    delete dataToCreate.real_estate_id;
    delete dataToCreate.insurance_companies;
    delete dataToCreate.registry_number;

    try {
      // Creation: Data of audit trail
      let auditTrail: AuditTrail = new AuditTrail(token);
      dataToCreate.audit_trail = auditTrail.getAsJson();
      dataToCreate.status = 1;

      // Service consumption
      const newInsurability = await Insurability.create(dataToCreate);
      if (typeof newInsurability === "number")
        return ctx.response
          .status(500)
          .json({ message: "¡Error al crear el bien inmueble!" });

      try {
        const { default: RealEstatesController } = await import(
          "App/Controllers/Http/RealEstatesController"
        );
        return new RealEstatesController().update(ctx, {
          id: dataInsurability.real_estate_id,
          data: { policy_id: newInsurability.id },
          dataToShow: newInsurability,
        });
      } catch (error) {}

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
  public async showAllPagination({ response, request }: HttpContextContract) {
    const { /*q,*/ page, pageSize } = request.qs();
    let /*results,*/ tmpPage: number, tmpPageSize: number;

    if (!pageSize) tmpPageSize = 10;
    else tmpPageSize = pageSize;

    if (!page) tmpPage = 1;
    else tmpPage = page;

    try {
      const results = await Insurability.query()
        // .select("re.name as name_real_estate")
        .select("*")
        .where("status", 1)
        .orderBy("id", "desc");

      let data: any[] = [];
      results.map(async (re) => {
        // const realEstates = await RealEstate.query().where("policy_id", re.id);
        let tmp: any = {
          ...re["$attributes"],
          // real_estate: {
          //   name: re["$extras"]["name_real_estate"],
          //   id: re["$attributes"].real_estate_id,
          // },
          // real_estates: realEstates.length,
          status: validateDate(parseInt(re["$attributes"]["vigency_end"])),
        };

        data.push(tmp);
        // if (tmp.status === "Vigente") data.push(tmp);
      });

      return response.status(200).json({
        message: "All Insurabilities",
        results: data,

        page: tmpPage,
        count: data.length,
        next_page:
          data.length - tmpPage * tmpPageSize !== 10 &&
          data.length - tmpPage * tmpPageSize > 0
            ? sum(parseInt(tmpPage + ""), 1)
            : null,
        previous_page: tmpPage - 1 < 0 ? tmpPage - 1 : null,
        total_results: data.length,
      });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
  }

  /**
   * getByRealEstate
   */
  public async getByRealEstate(ctx: HttpContextContract) {
    try {
      const { policy_id } = ctx.request.qs();

      let realEstates: RealEstate[] = [];
      if (typeof policy_id === "string")
        realEstates = await RealEstate.query()
          .where("policy_id", policy_id)
          .where("status", 1)
          .orderBy("id", "desc");
      console.log(realEstates);

      // insurabilities = await Insurability.query()
      //   .where("real_estate_id", real_estate_id)
      //   .where("status", 1)

      if (realEstates.length === 0) {
        return ctx.response
          .status(404)
          .json({ error: "No insurability Found" });
      }

      let data: any[] = [];
      realEstates.map((re) => {
        let tmp = {
          ...re["$attributes"],
          // status: validateDate(parseInt(re["$attributes"]["vigency_end"])),
          status: re["$attributes"]["status"] === 1 ? "Activo" : "Inactivo",
        };
        data.push(tmp);
      });

      ctx.response.status(200).json({
        message: `Bienes Inmuebles de la póliza ${policy_id}`,
        results: data,
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

    const data =
      insurability === null
        ? {}
        : {
            ...insurability["$attributes"],
            status: validateDate(
              parseInt(insurability["$attributes"]["vigency_end"])
            ),
          };

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
  // private async changeStatus(id: string | number) {
  //   try {
  //     const project = await Insurability.findOrFail(id);

  //     project.status = project.status === 1 ? 0 : 1;

  //     const tmpProject = await project.save();

  //     return { success: true, results: tmpProject };
  //   } catch (error) {
  //     console.error(`Error changing status:\n${error}`);
  //     return { success: false, results: error };
  //   }
  // }
}
