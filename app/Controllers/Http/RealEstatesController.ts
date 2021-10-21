import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { newAuditTrail } from "App/Utils/functions";
import {
  IAuditTrail,
  IRealEstateAttributes,
  IUpdatedValues,
} from "App/Utils/interfaces";
import RealEstate from "./../../Models/RealEstate";
import CreateRealEstate from "./../../Validators/CreateRealEstateValidator";

export default class RealEstatesController {
  private sum (num1: number, num2: number): number {
    return num1 + num2;
  }
  
  // GET
  /**
   * index
   */
  public async getList(ctx: HttpContextContract) {
    const { q, page, pageSize } = ctx.request.qs();
    let results, tmpPage: number, tmpPageSize: number, realEstates;

    if (!pageSize) tmpPageSize = 10;
    else tmpPageSize = pageSize;

    if (!page) tmpPage = 1;
    else tmpPage = page;

    let count: number = tmpPage * tmpPageSize - tmpPageSize;
    console.log(count);

    try {
      if (!q) {
        results = await RealEstate.query()
          .where("status", 1)
          .orderBy("id", "desc")
          .limit(tmpPageSize)
          .offset(count);
      } else {
        results = await RealEstate.query()
          .where("status", 1)
          .where("registry_number", q)
          .orderBy("id", "desc")
          .limit(tmpPageSize)
          .offset(count);
      }

      results = results === null ? [] : results;

      try {
        realEstates = await RealEstate.query().where("status", 1);
      } catch (error) {
        console.error(error);
        return ctx.response.status(500).json({
          message: "Error al traer la lista de todos los Bienes Inmuebles.",
        });
      }

      return ctx.response.json({
        message: "List of all Real Estates",
        results,
        page: tmpPage,
        count: results.length,
        next_page: realEstates.length - tmpPage * tmpPageSize !== 10 ? this.sum(parseInt(tmpPage + ""), 1) : null,
        previous_page: tmpPage - 1 < 0 ? tmpPage - 1 : null,
        total_results: realEstates.length,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Error al traer la lista de los Bienes Inmuebles." });
    }
  }


  /**
   * Get real estates by Project
   */
  public async getByProject(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();

    let list;
    try {
      list = await RealEstate.query()
        .where("project_id", parseInt(id))
        .orderBy("id", "desc");
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Real Estates failed!" });
    }
    const data = list === null ? [] : list;

    return ctx.response.json({ message: "List of all Real Estates", results: data });
  }

  /**
   * index
   */
  public async getOne(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();
    let realEstate;

    try {
      realEstate = await RealEstate.find(id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "Real Estate error" });
    }

    const data = realEstate === null ? {} : realEstate;

    return ctx.response.json({ message: "Real Estate", results: data });
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    const payload: IRealEstateAttributes = await ctx.request.validate(
      CreateRealEstate
    );

    const auditTrail: IAuditTrail = newAuditTrail();

    try {
      const realEstate = await RealEstate.create({
        ...payload,
        status: 1,
        audit_trail: auditTrail,
      });
      return ctx.response.status(200).json({
        message: "Bien Inmueble creado correctamente.",
        results: realEstate,
      });
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({
        message: "A ocurrido un error inesperado al crear el Bien Inmueble.",
        error,
      });
    }
  }

  // PUT
  /**
   * update
   */
  public async update(ctx: HttpContextContract, alt?: any) {
    let newData, _id;

    if (alt) {
      newData = alt["data"];
      _id = String(alt["id"]);
    } else {
      newData = ctx.request.body();
      const { id } = ctx.request.qs();
      _id = id;
    }
    console.log(newData, _id);

    try {
      if (typeof _id === "string") {
        const realEstate = await RealEstate.findOrFail(_id);

        let updatedValues: IUpdatedValues = {
          lastest: {
            name: realEstate.name,
            description: realEstate.description,
            dependency: realEstate.dependency,
            status: realEstate.status,
          },
          new: newData,
        };

        let tmpData: IRealEstateAttributes = realEstate;
        if (tmpData.audit_trail?.updated_values)
          if (!tmpData.audit_trail.updated_values.oldest)
            updatedValues.oldest = {
              name: realEstate.name,
              description: realEstate.description,
              dependency: realEstate.dependency,
              status: realEstate.status,
            };
          else updatedValues.oldest = tmpData.audit_trail.updated_values.oldest;

        let auditTrail: IAuditTrail = {
          created_by: tmpData.audit_trail?.created_by,
          created_on: tmpData.audit_trail?.created_on,
          updated_by: "UABI",
          updated_on: String(new Date().getTime()),
          updated_values: updatedValues,
        };

        // Updating data
        try {
          await realEstate
            .merge({
              ...newData,
              audit_trail: auditTrail,
            })
            .save();

          return ctx.response
            .status(200)
            .json({ message: "Updated successfully!", results:  realEstate });
        } catch (error) {
          console.error(error);
          if (alt) {
            return {
              error: true,
              response: ctx.response
                .status(500)
                .json({ message: "Error al actualizar: Servidor", error }),
            };
          }
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
  public async changeStatus(id: string | number, status?: number) {
    try {
      const realEstate = await RealEstate.findOrFail(id);

      if (status) realEstate.status = 2;
      else realEstate.status = realEstate.status === 1 ? 0 : 1;

      const tmpRealEstate = await realEstate.save();

      return { success: true, results: tmpRealEstate };
    } catch (error) {
      console.error(`Error changing status:\n${error}`);
      return { success: false, results: error };
    }
  }

  // DELETE
  /**
   * delete
   */
  public async delete(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();

    if (!id)
      return ctx.response
        .status(400)
        .json({ message: "Colocar el ID del Bien Inmueble a inactivar." });

    if (id === "0")
      return ctx.response
        .status(400)
        .json({ message: "Este Bien Inmueble no puede ser activado." });

    const res = await this.changeStatus(id);

    if (res["success"] === true) {
      const IDProject = res["data"]["$attributes"]["id"];

      let list;
      try {
        list = await RealEstate.query()
          .where("project_id", parseInt(IDProject))
          .orderBy("id", "desc");
      } catch (error) {
        console.error(error);
        return ctx.response
          .status(500)
          .json({ message: "Request to Real Estates failed!" });
      }

      return ctx.response.status(200).json({
        message: `Bien Inmueble ${
          res["data"].status === 1 ? "activado" : "inactivado"
        }.`,
        results: IDProject
      });
    } else {
      return ctx.response.status(500).json({
        message: "Error al inactivar el proyecto.",
        error: res["data"],
      });
    }
  }
}
