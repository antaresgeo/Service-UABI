import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// ******* UTILS *******
// CLASSES
import AuditTrail from "App/Utils/classes/AuditTrail";

// FUNCTIONS
import {
  sum,
  capitalize,
  getCostCenterID,
  getToken,
  validatePagination,
  // getToken,
  // getDataUser,
} from "App/Utils/functions";

// INTERFACES
import { IPayloadProject, IProjectAttributes } from "App/Utils/interfaces";

// MODELS
// import RealEstate from "App/Models/RealEstate";
import Project from "App/Models/Project";
import RealEstatesProject from "App/Models/RealEstatesProject";
import CreateProjectValidator from "App/Validators/CreateProjectValidator";
import CostCenter from "App/Models/CostCenter";

export default class ProjectsController {
  // GET
  /**
   * index
   */
  public async showAllWithPagination({
    request,
    response,
  }: HttpContextContract) {
    const { q, page, pageSize } = request.qs();
    const pagination = validatePagination(q, page, pageSize);
    let results: Project[] | null = null,
      data: any[] = [],
      projects;

    // const token: string = getToken(request.headers());
    // await getDataUser(token);
    let count: number =
      pagination["page"] * pagination["pageSize"] - pagination["pageSize"];

    try {
      results = await Project.query()
        .from("projects as p")
        .innerJoin("status as s", "p.status", "s.id")
        .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
        .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
        .select(["p.id as project_id", "*"])
        .where("status", 1)
        .where("name", "LIKE", `%${pagination["q"]}%`)
        .orderBy("p.id", "desc")
        .limit(pagination["pageSize"])
        .offset(count);

      results = results === null ? [] : results;

      results.map((realEstate) => {
        let tmpNewData: any = {
          ...realEstate["$original"],
          id: realEstate["$extras"]["project_id"],

          name: capitalize(realEstate["$original"]["name"]),
          status: realEstate["$extras"]["status_name"],
          dependency: realEstate["$extras"]["dependency"],
          subdependency: realEstate["$extras"]["subdependency"],
          management_center: realEstate["$extras"]["management_center"],
          cost_center: realEstate["$extras"]["cost_center"],
          fixed_assets: realEstate["$extras"]["fixed_assets"],
        };

        delete tmpNewData.cost_center_id;
        data.push(tmpNewData);
      });

      // Total Results
      try {
        projects = await Project.query().where("status", 1);
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message: "Error al traer la lista de todos los Bienes Inmuebles.",
        });
      }
      const total_results = projects.length;

      // Count
      count = results.length;

      // Next Page
      let next_page: number | null =
        pagination["page"] * pagination["pageSize"] < projects.length
          ? sum(parseInt(pagination["page"] + ""), 1)
          : null;

      // Previous Page
      let previous_page: number | null =
        pagination["page"] - 1 > 0 ? pagination["page"] - 1 : null;

      const lastElement = data.pop();
      const res = [lastElement, ...data];

      return response.json({
        message: "Lista de Proyectos",
        results: res,
        page: pagination["page"],
        count,
        next_page,
        previous_page,
        total_results,
      });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Request to Projects failed!" });
    }
  }

  /**
   * showAll
   */
  public async showAll({ response }: HttpContextContract) {
    let projects: Project[];

    try {
      projects = await Project.query()
        .select(["id", "name"])
        .where("status", 1)
        .orderBy("id", "desc");
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "Error al traer la lista de todos los Bienes Inmuebles.",
      });
    }

    const lastElement = projects.pop();
    const res = [lastElement, ...projects];

    return response.json({
      message: "Lista de Proyectos",
      results: res,
      total: projects.length,
    });
  }

  /**
   * index
   */
  public async show({ response, request }: HttpContextContract, id?: number) {
    let results: Project[] | {}, _id: number;

    if (id) _id = id;
    else _id = request.qs().id;

    try {
      results = await Project.query()
        .from("projects as p")
        .innerJoin("status as s", "p.status", "s.id")
        .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
        .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
        .select(["p.id as project_id", "*"])
        .where("status", 1)
        .where("p.id", _id);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Project error" });
    }

    results = results === null ? {} : results[0];

    let tmpNewData: any = {
      ...results["$original"],
      id: results["$extras"]["project_id"],
      name: capitalize(results["$original"]["name"]),
      status: results["$extras"]["status_name"],
      dependency: results["$extras"]["dependency"],
      subdependency: results["$extras"]["subdependency"],
      management_center: results["$extras"]["management_center"],
      cost_center: results["$extras"]["cost_center"],
      last_consecutive: results["$extras"]["last_consecutive"],
      fixed_assets: results["$extras"]["fixed_assets"],
      dependency_id: results["$extras"]["dependency_id"],
    };

    if (id) return tmpNewData;

    return response.json({ message: "Project", results: tmpNewData });
  }

  // POST
  /**
   * @swagger
   * /v1/projects:
   *   post:
   *     tags:
   *       - Proyectos
   *     summary: Crear un Proyecto
   *     parameters:
   *       - name: Valores
   *         description: Valores para crear un Proyecto
   *         in: body
   *         required: true
   *         schema:
   *            properties:
   *              name:
   *                type: string
   *                example: 'Puente de la Madre Laura'
   *                required: true
   *              description:
   *                type: string
   *                example: 'Construcción vial en xxxx con yyyy, llamado honorificamente a Madre Laura'
   *                required: true
   *              dependency:
   *                type: string
   *                example: 'SECRETARIA DE INFRAESTRUCTURA FISICA'
   *                required: true
   *              subdependency:
   *                type: string
   *                example: 'SUBS. CONSTRUCCIÓN Y MANTENIMIENTO'
   *                required: true
   *              management_center:
   *                type: number
   *                example: 74100000
   *                required: true
   *              cost_center:
   *                type: number
   *                example: 74103000
   *                required: true
   *     produces:
   *        - application/json
   *     responses:
   *       200:
   *         description: Response
   *         example:
   *           message: Hello Guess
   */
  public async create({ request, response }: HttpContextContract) {
    let token: string = getToken(request.headers());

    const payloadProject: IPayloadProject = await request.validate(
      CreateProjectValidator
    );

    let dataToCreate: IProjectAttributes, costCenterID: CostCenter[];

    try {
      costCenterID = await CostCenter.query()
        .from("cost_centers as cc")
        .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
        .select("cc.id")
        .where("d.dependency", payloadProject.dependency)
        .where("cc.subdependency", payloadProject.subdependency)
        .where("d.management_center", payloadProject.management_center)
        .where("cc.cost_center", payloadProject.cost_center);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "Error obteniendo el ID del Centro de Costos",
        error,
      });
    }

    const auditTrail: AuditTrail = new AuditTrail(token);
    await auditTrail.init();

    dataToCreate = {
      name: payloadProject.name.toUpperCase(),
      description: payloadProject.description,

      cost_center_id: costCenterID[0]["id"],

      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };

    try {
      const project = await Project.create({
        ...dataToCreate,
      });

      return response.status(200).json({
        message: "Proyecto creado satisfactoriamente.",
        results: project,
      });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Hubo un error al crear el Proyecto." });
    }
  }

  // PUT
  /**
   * update
   */
  public async update({ request, response }: HttpContextContract) {
    const token = getToken(request.headers());

    const newData = request.body();
    const { id } = request.qs();
    let costCenterID;

    try {
      if (typeof id === "string") {
        const project = await Project.findOrFail(id);
        costCenterID;

        let dataUpdated: IProjectAttributes = {
          name: newData["name"].toUpperCase().trim(),
          description: newData["description"].trim(),
          cost_center_id: project.cost_center_id,
        };

        const { status, results } = await getCostCenterID(
          newData["dependency"],
          newData["subdependency"],
          newData["management_center"],
          newData["cost_center"]
        );

        if (status === 200)
          if (results) dataUpdated["cost_center_id"] = parseInt(results.id);
          else
            return response.status(status).json({
              message: results,
            });

        // Update of Audit Trail | Actualización del Registro de Auditoría
        const auditTrail = new AuditTrail(token, project.audit_trail);

        auditTrail.update("Administrador", { ...dataUpdated }, project);
        dataUpdated["audit_trail"] = auditTrail.getAsJson();

        // Updating data
        try {
          await project
            .merge({
              ...dataUpdated,
            })
            .save();

          return response.status(200).json({
            message: `Proyecto ${capitalize(
              project.name
            )} actualizado satisfactoriamente`,
            results: project,
          });
        } catch (error) {
          console.error(error);
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
    const { request, response } = ctx;
    const { id } = request.qs();

    if (!id)
      return response
        .status(400)
        .json({ message: "Colocar el ID del proyecto a inactivar." });

    if (id === "0")
      return response
        .status(400)
        .json({ message: "Este proyecto no puede ser inactivado." });

    const res = await this.changeStatus(id);

    if (res["success"] === true) {
      const IDProject = res["results"]["$attributes"]["id"];

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
        return response.status(500).json({ message: "Real Estate error" });
      }

      // try {
      //   list = await RealEstate.query()
      //     .where("project_id", parseInt(IDProject))
      //     .orderBy("id", "desc");
      // } catch (error) {
      //   console.error(error);
      //   return response
      //     .status(500)
      //     .json({ message: "Request to Real Estates failed!" });
      // }
      const data = results === null ? [] : results;

      if (data === []) {
        return response.status(200).json({
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
        return response.status(200).json({
          message: `Proyecto ${
            res["results"].status === 1 ? "activado" : "inactivado"
          }.\n\n${data.length} bienes inmuebles desasociados.`,
        });
      }
    } else {
      return response.status(500).json({
        message: "Error al inactivar el proyecto.",
        error: res["results"],
      });
    }
  }
}
