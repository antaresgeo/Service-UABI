import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RealEstate from "App/Models/RealEstate";
import AuditTrail from "App/Utils/classes/AuditTrail";
import {
  IAuditTrail,
  IProjectAttributes,
  IUpdatedValues,
} from "App/Utils/interfaces";
import Project from "./../../Models/Project";

export default class ProjectsController {
  private sum(num1: number, num2: number): number {
    return num1 + num2;
  }

  // GET
  /**
   * index
   */
  public async getList(ctx: HttpContextContract) {
    const { filters, page, pageSize } = ctx.request.qs();
    let results: Project[] | null = null,
      data: any[] = [],
      tmpPage: number,
      tmpPageSize: number,
      projects;

    if (!pageSize) tmpPageSize = 10;
    else tmpPageSize = pageSize;

    if (!page) tmpPage = 1;
    else tmpPage = parseInt(page);

    let count: number = tmpPage * tmpPageSize - tmpPageSize;

    try {
      if (filters) {
        if (typeof filters.q === "string")
          results = await Project.query()
            .from("projects as p")
            .innerJoin("status as s", "p.status", "s.id")
            .select("*")
            .select("p.name as project_name")
            .select("p.id as project_id")
            .select("s.name as status_name")
            .where("status", 1)
            .whereRaw(`'name' LIKE '%${filters.q}%'`)
            .orderBy("p.id", "asc")
            .limit(tmpPageSize)
            .offset(count);
      } else {
        results = await Project.query()
          .from("projects as p")
          .innerJoin("status as s", "p.status", "s.id")
          .select("*")
          .select("p.name as project_name")
          .select("p.id as project_id")
          .select("s.name as status_name")
          .where("status", 1)
          .orderBy("p.id", "asc")
          .limit(tmpPageSize)
          .offset(count);
      }

      results = results === null ? [] : results;
      console.log(results);

      results.map((realEstate) => {
        data.push({
          ...realEstate["$original"],
          id: realEstate["$extras"]["project_id"],
          name: realEstate["$extras"]["project_name"],
          status: realEstate["$extras"]["status_name"],
        });
      });

      try {
        projects = await Project.query().where("status", 1);
      } catch (error) {
        console.error(error);
        return ctx.response.status(500).json({
          message: "Error al traer la lista de todos los Bienes Inmuebles.",
        });
      }

      count = results.length;
      console.log(results["$extras"]);

      let next_page: number | null =
        tmpPage * tmpPageSize < projects.length
          ? this.sum(parseInt(tmpPage + ""), 1)
          : null;
      console.log(tmpPage);
      console.log(tmpPage - 1);

      let previous_page: number | null = tmpPage - 1 > 0 ? tmpPage - 1 : null;

      return ctx.response.json({
        message: "List of all Real Estates",
        results: data,
        page: tmpPage,
        count: results.length,
        next_page,
        previous_page,
        total_results: projects.length,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Projects failed!" });
    }
  }

  /**
   * index
   */
  public async getOne(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();
    let project: Project | null;

    try {
      project = await Project.find(id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "Project error" });
    }

    const data = project === null ? {} : project;

    return ctx.response.json({ message: "Project", results: data });
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    const {
      name,
      description,
      dependency,
      subdependency,
      management_center,
      cost_center,
    } = ctx.request.body();

    const auditTrail: AuditTrail = new AuditTrail();

    const dataToCreate: IProjectAttributes = {
      name: name.toUpperCase(),
      description,
      dependency: dependency.toUpperCase(),
      subdependency: subdependency.toUpperCase(),
      management_center,
      cost_center,

      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };

    try {
      const project = await Project.create({
        ...dataToCreate,
      });

      return ctx.response.status(200).json({
        message: "Proyecto creado satisfactoriamente.",
        results: project,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Hubo un error al crear el Proyecto." });
    }
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

        let tmpData: Project = project;
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
          updated_on: new Date().getTime(),
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
            message: `Proyecto ${project.name} actualizado satisfactoriamente`,
            results: project,
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

      return { success: true, results: tmpProject };
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
        .json({ message: "Colocar el ID del proyecto a inactivar." });

    if (id === "0")
      return ctx.response
        .status(400)
        .json({ message: "Este proyecto no puede ser activado." });

    const res = await this.changeStatus(id);
    console.log(res);

    if (res["success"] === true) {
      const IDProject = res["results"]["$attributes"]["id"];

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
            res["results"].status === 1 ? "activado" : "inactivado"
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

          realEstatesController.changeStatus(realEstate.id, 2);
        });
        return ctx.response.status(200).json({
          message: `Proyecto ${
            res["results"].status === 1 ? "activado" : "inactivado"
          }.\n\n${data.length} bienes inmuebles desasociados.`,
        });
      }
    } else {
      return ctx.response.status(500).json({
        message: "Error al inactivar el proyecto.",
        error: res["results"],
      });
    }
  }
}
