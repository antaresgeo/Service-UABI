import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RealEstate from "App/Models/RealEstate";
import {
  IAuditTrail,
  IProjectAttributes,
  IUpdatedValues,
} from "App/Utils/interfaces";
import Project from "./../../Models/Project";
import { newAuditTrail } from "./../../Utils/functions";

export default class ProjectsController {
  // GET
  /**
   * index
   */
  public async getList(ctx: HttpContextContract) {
    let list;
    try {
      list = await Project.query().where("status", 1).orderBy("id", "desc");
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Projects failed!" });
    }
    const data = list === null ? [] : list;

    return ctx.response.json({ message: "List of all Projects", data });
  }

  /**
   * index
   */
  public async getOne(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();
    let project;

    try {
      project = await Project.find(id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "Project error" });
    }

    const data = project === null ? {} : project;

    return ctx.response.json({ message: "Project", data });
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    const { name, description, dependency } = ctx.request.body();

    const auditTrail: IAuditTrail = newAuditTrail();

    try {
      await Project.create({
        name: name.toUpperCase(),
        description,
        dependency,
        status: 1,
        audit_trail: auditTrail,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Hubo un error al crear el Proyecto." });
    }

    return ctx.response
      .status(200)
      .json({ message: "Proyecto creado satisfactoriamente." });
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
        const project = await Project.findOrFail(id);

        let updatedValues: IUpdatedValues = {
          lastest: {
            name: project.name,
            description: project.description,
            dependency: project.dependency,
            status: project.status,
          },
          new: newData,
        };

        let tmpData: IProjectAttributes = project;
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
              name: newData.name.toUpperCase(),
              description: newData.description,
              dependency: newData.dependency,
              audit_trail: auditTrail,
            })
            .save();

          return ctx.response.status(200).json({
            message: `Proyecto ${project.name} guardado satisfactoriamente`,
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
      const project = await Project.findOrFail(id);

      project.status = project.status === 1 ? 0 : 1;

      const tmpProject = await project.save();

      return { success: true, data: tmpProject };
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
        .json({ message: "Colocar el ID del proyecto a inactivar." });

    if (id === "0")
      return ctx.response
        .status(400)
        .json({ message: "Este proyecto no puede ser activado." });

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
      const data = list === null ? [] : list;

      if (data === []) {
        return ctx.response.status(200).json({
          message: `Proyecto ${
            res["data"].status === 1 ? "activado" : "inactivado"
          }.`,
          id: IDProject,
        });
      } else {
        const { default: RealEstatesController } = await import(
          "App/Controllers/Http/RealEstatesController"
        );
        const realEstatesController = new RealEstatesController();
        data.map((realEstate) => {
          realEstatesController.update(ctx, {
            data: { project_id: 0 },
            id: realEstate.id,
          });

          // if (resUpdate["error"]) return resUpdate["response"];

          realEstatesController.changeStatus(ctx, realEstate.id, 2);
        });
        return ctx.response.status(200).json({
          message: `Proyecto ${
            res["data"].status === 1 ? "activado" : "inactivado"
          }.\n\n${data.length} bienes inmuebles desasociados.`,
          id: IDProject,
        });
      }
    } else {
      return ctx.response.status(500).json({
        message: "Error al inactivar el proyecto.",
        error: res["data"],
      });
    }
  }
}
