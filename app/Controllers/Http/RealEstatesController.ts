import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RealEstatesProject from "App/Models/RealEstatesProject";
import AuditTrail from "App/Utils/classes/AuditTrail";
import {
  IAuditTrail,
  IRealEstateAttributes,
  IUpdatedValues,
} from "App/Utils/interfaces";
import RealEstate from "./../../Models/RealEstate";
import CreateRealEstate from "./../../Validators/CreateRealEstateValidator";

export default class RealEstatesController {
  private sum(num1: number, num2: number): number {
    return num1 + num2;
  }

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
          .select("p.name as project_name")
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
      console.log(results);

      results = results === null ? [] : results;

      let data: any[] = [];

      let tmpLastRealEstate: RealEstate = results[0],
        j = 1;
      for (let i = 0; i < results.length; i++) {
        if (j !== results.length)
          if (tmpLastRealEstate["$extras"].id === results[j]["$extras"].id) {
            if (typeof results[j]["$extras"]["project_name"] === "string")
              results[j]["$extras"]["project_name"] = [
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
            data.push(tmpLastRealEstate["$extras"]);
            if (j !== results.length) tmpLastRealEstate = results[j];
          }
        else data.push(tmpLastRealEstate["$extras"]);

        j++;
      }

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
            ? this.sum(parseInt(tmpPage + ""), 1)
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
        .select([
          "p.name as project_name",
          "p.description as project_description",
          "p.dependency as project_dependency",
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
    let results;

    try {
      results = await RealEstatesProject.query()
        .from("real_estates_projects as a")
        .innerJoin("projects as p", "a.project_id", "p.id")
        .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
        .select("p.name as project_name")
        .select("*")
        .where("re.id", id);
      // .orderBy("re.id", "desc")
      // .limit(tmpPageSize)
      // .offset(count);
      // realEstate = await RealEstate.find(id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "Real Estate error" });
    }
    let data: any[] = [];

    let tmpLastRealEstate: RealEstate = results[0],
      j = 1;
    for (let i = 0; i < results.length; i++) {
      if (j !== results.length)
        if (tmpLastRealEstate["$extras"].id === results[j]["$extras"].id) {
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
          projects: {
            id: tmpLastRealEstate["$original"]["project_id"],
            name: tmpLastRealEstate["$extras"]["project_name"],
          },
        };
        delete tmp["project_name"];

        data.push(tmp);
      }

      j++;
    }

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
    const payload: any = await ctx.request.validate(CreateRealEstate);

    const auditTrail: AuditTrail = new AuditTrail();

    try {
      let dataRealEstate: IRealEstateAttributes = { ...payload };
      delete dataRealEstate.projects_id;
      dataRealEstate.status = 1;
      dataRealEstate.audit_trail = auditTrail.getAsJson();

      const realEstate = await RealEstate.create({
        ...dataRealEstate,
      });

      if (payload.projects_id)
        await this.createRelation(payload.projects_id, realEstate);
      else await this.createRelation([1], realEstate);

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
          await realEstate
            .merge({
              ...newData,
              audit_trail: auditTrail,
            })
            .save();

          return ctx.response
            .status(200)
            .json({ message: "Updated successfully!", results: realEstate });
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
      console.log(list);

      return ctx.response.status(200).json({
        message: `Bien Inmueble ${
          res["data"].status === 1 ? "activado" : "inactivado"
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
