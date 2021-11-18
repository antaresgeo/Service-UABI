import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Project from "App/Models/Project";
import RealEstatesProject from "App/Models/RealEstatesProject";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { sum } from "App/Utils/functions";
import {
  IAuditTrail,
  IRealEstateAttributes,
  IUpdatedValues,
} from "App/Utils/interfaces";
import RealEstate from "./../../Models/RealEstate";
import CreateRealEstate from "./../../Validators/CreateRealEstateValidator";
import { createSAPID } from "./../../Utils/functions/index";

export default class RealEstatesController {
  // GET
  /**
   * index
   */
  public async getList(ctx: HttpContextContract) {
    const { q, page, pageSize, allStates } = ctx.request.qs();
    let results,
      tmpPage: number,
      tmpPageSize: number,
      realEstates,
      tmpAllStates: boolean;

    if (!pageSize) tmpPageSize = 10;
    else tmpPageSize = pageSize;

    if (!page) tmpPage = 1;
    else tmpPage = page;

    if (!allStates) tmpAllStates = false;
    else tmpAllStates = allStates;
    console.log(tmpAllStates);

    let count: number = tmpPage * tmpPageSize - tmpPageSize;

    try {
      if (!q) {
        results = await RealEstatesProject.query()
          .from("real_estates_projects as a")
          .innerJoin("projects as p", "a.project_id", "p.id")
          .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
          .innerJoin("status as s", "re.status", "s.id")
          .innerJoin("cost_centers as cc", "re.cost_center_id", "cc.id")
          .select([
            "p.name as project_name",
            "re.name as re_name",
            "re.id as re_id",
          ])
          .select("*")
          .where("re.status", 1)
          .orderBy("re.id", "desc")
          .limit(tmpPageSize)
          // .withAggregate('real_estates_projects', (query) => {
          //   query.array
          // })
          .offset(count);
      } else {
        results = await RealEstatesProject.query()
          .from("real_estates_projects as a")
          .where("status", 1)
          .where("registry_number", q)
          .orderBy("id", "desc")
          .limit(tmpPageSize)
          .offset(count);
      }
      results = results === null ? [] : results;

      let data: any[] = [];

      // let tmpLastRealEstate: RealEstate = results[0],
      //   j = 1;
      console.log(results);

      results.map((re) => {
        let tmp = {
          ...re["$extras"],
          project: {
            id: re["project_id"],
            name: re["$extras"]["project_name"],
          },
          status: re["$extras"]["name"],
          name: re["$extras"]["re_name"],
          id: re["$extras"]["re_id"],
          materials: re["$extras"]["materials"].split(","),
        };

        delete tmp["project_name"];
        delete tmp["project_description"];
        delete tmp["re_name"];
        delete tmp["re_id"];

        data.push(tmp);
      });

      // for (let i = 0; i < results.length; i++) {
      //   if (j !== results.length)
      //     if (tmpLastRealEstate["$extras"].id === results[j]["$extras"].id) {
      //       if (typeof results[j]["$extras"]["project_name"] === "string")
      //         results[j]["$extras"]["project_name"] = [
      //           {
      //             id: tmpLastRealEstate["$attributes"]["project_id"],
      //             name: tmpLastRealEstate["$extras"]["project_name"],
      //           },
      //           {
      //             id: results[j]["$attributes"]["project_id"],
      //             name: results[j]["$extras"]["project_name"],
      //           },
      //         ];
      //       else
      //         results[j]["$extras"]["project_name"].push(
      //           results[j]["$extras"]["project_name"]
      //         );
      //       if (j !== results.length) tmpLastRealEstate = results[j];
      //     } else {
      //       let tmp = {
      //         ...tmpLastRealEstate["$extras"],
      //         name: tmpLastRealEstate["$extras"]["re_name"],
      //         status: tmpLastRealEstate["$extras"]["name"],
      //       };
      //       delete tmp["re_name"];

      //       data.push(tmp);
      //       if (j !== results.length) tmpLastRealEstate = results[j];
      //     }
      //   else {
      //     let tmp = {
      //       ...tmpLastRealEstate["$extras"],
      //       name: tmpLastRealEstate["$extras"]["re_name"],
      //       status: tmpLastRealEstate["$extras"]["name"],
      //     };

      //     delete tmp["re_name"];
      //     data.push(tmp);
      //   }

      //   j++;
      // }

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
        results: data,
        page: tmpPage,
        count: data.length,
        next_page:
          realEstates.length - tmpPage * tmpPageSize !== 10 &&
          realEstates.length - tmpPage * tmpPageSize > 0
            ? sum(parseInt(tmpPage + ""), 1)
            : null,
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
      list = await RealEstatesProject.query()
        .from("real_estates_projects as a")
        .innerJoin("projects as p", "a.project_id", "p.id")
        .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
        .innerJoin("cost_centers as cc", "re.cost_center_id", "cc.id")
        .select([
          "p.name as project_name",
          "p.description as project_description",
          "cc.dependency as re_dependency",
          "cc.subdependency as re_subdependency",
          "cc.management_center as re_management_center",
          "cc.cost_center as re_cost_center",
        ])
        .select("*")
        .where("a.project_id", parseInt(id))
        .orderBy("a.project_id", "desc");

      console.log(list);
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Real Estates failed!" });
    }
    const data: any[] = [];

    list.map((re) => {
      data.push(re["$extras"]);
    });

    return ctx.response.json({
      message: "List of all Real Estates",
      results: data,
      total: data.length,
    });
  }

  /**
   * index
   */
  public async getOne(ctx: HttpContextContract) {
    const { id } = ctx.request.qs();
    console.log(id);

    let results;

    try {
      results = await RealEstatesProject.query()
        .from("real_estates_projects as a")
        .innerJoin("projects as p", "a.project_id", "p.id")
        .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
        .innerJoin("cost_centers as cc", "re.cost_center_id", "cc.id")
        .select("p.name as project_name")
        .select("re.id as re_id")
        .select("*")
        .where("re.id", id);
      console.log(results);

      // .orderBy("re.id", "desc")
      // .limit(tmpPageSize)
      // .offset(count);
      // realEstate = await RealEstate.find(id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "Real Estate error" });
    }

    // Esto no sé de donde sale. Se elimina ya que es innecesario :)
    // if (
    //   results[0]["$extras"][
    //     "tipology;accounting_account;destination_type;registry_number;na"
    //   ] === null
    // )
    //   delete results[0]["$extras"][
    //     "tipology;accounting_account;destination_type;registry_number;na"
    //   ];

    let data: any[] = [];

    let tmpLastRealEstate: RealEstate = results[0],
      j = 1;
    for (let i = 0; i < results.length; i++) {
      if (j !== results.length)
        if (tmpLastRealEstate["$extras"].id === results[j]["$extras"].id) {
          console.log(tmpLastRealEstate["$extras"]);

          if (typeof results[j]["$extras"]["project_name"] === "string")
            results[j]["$extras"]["projects_name"] = [
              {
                id: tmpLastRealEstate["$attributes"]["project_id"],
                name: tmpLastRealEstate["$extras"]["project_name"],
              },
              {
                id: results[j]["$attributes"]["project_id"],
                name: results[j]["$extras"]["project_name"],
              },
            ];
          else
            results[j]["$extras"]["project_name"].push(
              results[j]["$extras"]["project_name"]
            );
          if (j !== results.length) tmpLastRealEstate = results[j];
        } else {
          console.log(tmpLastRealEstate["$extras"]);
          let tmp = {
            ...tmpLastRealEstate["$extras"],
            projects: {
              id: tmpLastRealEstate["$original"]["project_id"],
              name: results["$extras"]["project_name"],
            },
          };
          delete tmp["project_name"];
          data.push(tmpLastRealEstate["$extras"]);
          if (j !== results.length) tmpLastRealEstate = results[j];
        }
      else {
        let tmp = {
          ...tmpLastRealEstate["$extras"],
          id: tmpLastRealEstate["$extras"]["re_id"],
          projects: [
            {
              id: tmpLastRealEstate["$original"]["project_id"],
              name: tmpLastRealEstate["$extras"]["project_name"],
            },
          ],
        };
        delete tmp["project_name"];
        delete tmp["re_id"];

        data.push(tmp);
      }

      j++;
    }

    console.log(data);

    data[0]["supports_documents"] =
      data[0]["supports_documents"] === null
        ? []
        : data[0]["supports_documents"].split(",");

    return ctx.response.json({ message: "Real Estate", results: data[0] });
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    const { response, request } = ctx;
    const payload: any = await request.validate(CreateRealEstate);
    let project: Project | any;

    const auditTrail: AuditTrail = new AuditTrail();

    try {
      let dataRealEstate: IRealEstateAttributes = { ...payload };
      if (payload.projects_id) {
        try {
          // project = await Project.findOrFail(payload.projects_id[0]);
          const { default: ProjectsController } = await import(
            "App/Controllers/Http/ProjectsController"
          );

          if (typeof dataRealEstate.projects_id !== "undefined") {
            project = await new ProjectsController().show(
              ctx,
              dataRealEstate.projects_id[0]
            );

            if (typeof project !== "undefined")
              dataRealEstate["cost_center_id"] = project.cost_center_id;
            console.log(project);
          }
        } catch (error) {
          console.error(error);
          return response.status(402).json({
            message:
              "El Proyecto al que quiere relacionar no existe, crearlo antes de asignar.",
          });
        }
      }

      delete dataRealEstate.projects_id;
      dataRealEstate.status = 1;
      dataRealEstate.audit_trail = auditTrail.getAsJson();
      dataRealEstate["sap_id"] = createSAPID(
        project.fixed_assets,
        (await RealEstate.all()).length,
        dataRealEstate.active_type
      );

      const realEstate = await RealEstate.create({
        ...dataRealEstate,
      });

      if (payload.projects_id)
        await this.createRelation(payload.projects_id, realEstate);
      else await this.createRelation([0], realEstate);

      return response.status(200).json({
        message: "Bien Inmueble creado correctamente.",
        results: { ...realEstate["$attributes"], project: project },
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "A ocurrido un error inesperado al crear el Bien Inmueble.\nRevisar Terminal.",
        error,
      });
    }
  }

  private async createRelation(projectsId: number[], realEstate: RealEstate) {
    try {
      if (projectsId.length > 0)
        projectsId.map(async (id) => {
          await RealEstatesProject.create({
            project_id: id,
            real_estate_id: realEstate.id,
          });
        });
      else
        await RealEstatesProject.create({
          project_id: 1,
          real_estate_id: realEstate.id,
        });
    } catch (error) {
      console.error(error);
    }
  }

  // PUT
  /**
   * update
   */
  public async update({ response, request }: HttpContextContract, alt?: any) {
    let newData, _id;

    if (alt) {
      newData = alt["data"];
      _id = String(alt["id"]);
    } else {
      newData = request.body();
      const { id } = request.qs();
      _id = id;
    }

    let projects = newData.projects;
    delete newData.projects;

    try {
      if (typeof _id === "string") {
        const realEstate = await RealEstate.findOrFail(_id);

        let updatedValues: IUpdatedValues = {
          lastest: {
            name: realEstate.name,
            description: realEstate.description,
            status: realEstate.status,
          },
          new: newData,
        };

        let tmpData: any = realEstate;
        if (tmpData.audit_trail?.updated_values)
          if (!tmpData.audit_trail.updated_values.oldest)
            updatedValues.oldest = {
              name: realEstate.name,
              description: realEstate.description,
              status: realEstate.status,
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
          const realEstateUpdated = await realEstate
            .merge({
              ...newData,
              audit_trail: auditTrail,
            })
            .save();
          console.log(realEstateUpdated);

          return response.status(200).json({
            message: "Updated successfully!",
            results: {
              ...realEstateUpdated["$attributes"],
              projects,
            },
          });
        } catch (error) {
          console.error(error);
          if (alt) {
            return {
              error: true,
              response: response
                .status(500)
                .json({ message: "Error al actualizar: Servidor", error }),
            };
          }
          return response
            .status(500)
            .json({ message: "Error al actualizar: Servidor", error });
        }
      }
    } catch (error) {
      console.error(error);
      return response
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
      const IDProject = res["results"]["$attributes"]["id"];
      const realEstatesProjects = await RealEstatesProject.query().where(
        "real_estate_id",
        IDProject
      );

      console.log(realEstatesProjects);
      try {
        realEstatesProjects.map((tmp) => {
          tmp.delete();
        });
      } catch (error) {
        return ctx.response.status(500).json({
          message: "Error al eliminar relación con proyecto(s).",
        });
      }

      return ctx.response.status(200).json({
        message: `Bien Inmueble ${
          res["results"].status === 1 ? "activado" : "inactivado"
        }.`,
        results: IDProject,
      });
    } else {
      return ctx.response.status(500).json({
        message: "Error al inactivar el proyecto.",
        error: res["data"],
      });
    }
  }
}
