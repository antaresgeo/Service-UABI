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
  // GET
  /**
   * index
   */
  public async getList(ctx: HttpContextContract) {
    const { page, pageSize } = ctx.request.qs();

    let list;
    try {
      list = await RealEstate.query()
        .where("status", 1)
        .orderBy("id", "desc")
        .limit(pageSize);
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Real Estates failed!" });
    }
    const data = list === null ? [] : list;

    return ctx.response.json({ message: "List of all Real Estates", data });
  }

  public async filter(ctx: HttpContextContract) {
    const { q, page, pageSize } = ctx.request.qs();

    if (q && page && pageSize) {
      let list;
      try {
        list = await RealEstate.query()
          .where("status", 1)
          .where("registry_number", q)
          .orderBy("id", "desc")
          .limit(pageSize);
      } catch (error) {
        console.error(error);
        return ctx.response
          .status(500)
          .json({ message: "Request to Real Estates failed!" });
      }
      const data: IRealEstateAttributes[] = list === null ? [] : list;

      // const next_page =

      return ctx.response.json({
        message: "List of all Real Estates",
        data,
        page,
        count: pageSize,
        next_page: data.length / pageSize < 0 ? page + 1 : null,
        previous_page: page - 1 < 0 ? page - 1 : null,
        total_results: data.length,
      });
    } else {
      return ctx.response.json({
        message: "Complete the query params.",
        error: true,
      });
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

    return ctx.response.json({ message: "List of all Real Estates", data });
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

    return ctx.response.json({ message: "Real Estate", data });
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    // const data: any = ctx.request.body();
    const payload: IRealEstateAttributes = await ctx.request.validate(
      CreateRealEstate
    );

    console.log(payload);

    const auditTrail: IAuditTrail = newAuditTrail();

    try {
      await RealEstate.create({
        ...payload,
        status: 1,
        audit_trail: auditTrail,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Project create failed!" });
    }

    return ctx.response
      .status(200)
      .json({ message: "Project created successfully!" });
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
        const project = await RealEstate.findOrFail(_id);

        let updatedValues: IUpdatedValues = {
          lastest: {
            name: project.name,
            description: project.description,
            dependency: project.dependency,
            status: project.status,
          },
          new: newData,
        };

        let tmpData: IRealEstateAttributes = project;
        if (tmpData.audit_trail?.updated_values)
          if (!tmpData.audit_trail.updated_values.oldest)
            updatedValues.oldest = {
              name: project.name,
              description: project.description,
              dependency: project.dependency,
              status: project.status,
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
          await project
            .merge({
              ...newData,
              audit_trail: auditTrail,
            })
            .save();

          return ctx.response
            .status(200)
            .json({ message: "Updated successfully!" });
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

      return { success: true, data: tmpRealEstate };
    } catch (error) {
      console.error(`Error changing status:\n${error}`);
      return { success: false, data: error };
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
        id: IDProject,
      });
    } else {
      return ctx.response.status(500).json({
        message: "Error al inactivar el proyecto.",
        error: res["data"],
      });
    }
  }
}
