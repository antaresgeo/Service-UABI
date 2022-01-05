import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProjectContract from "./../../Models/ProjectContract";

// ******* UTILS *******
// CLASSES
import AuditTrail from "App/Utils/classes/AuditTrail";

// FUNCTIONS
import {
  capitalize,
  getCostCenterID,
  getToken,
  validatePagination,
  messageError,
  sum,
  getWhereRaw,
  // getToken,
  // getDataUser,
} from "App/Utils/functions";

// INTERFACES
import {
  IPaginationValidated,
  IPayloadProject,
  IProjectAttributes,
  IResponseData,
} from "App/Utils/interfaces";

// MODELS
// import RealEstate from "App/Models/RealEstate";
import Project from "App/Models/Project";
import RealEstatesProject from "App/Models/RealEstatesProject";
import CreateProjectValidator from "App/Validators/CreateProjectValidator";
import CostCenter from "App/Models/CostCenter";

export default class ProjectsController {
  // GET

  /**
   * showAll
   */
  public async showAll({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de Usuarios completa. | Sin paginación.",
      status: 200,
    };

    const { page, pageSize, key, value, only } = request.qs();

    let pagination: IPaginationValidated = { page: 0, pageSize: 1000000 };
    if (request.qs().with && request.qs().with === "pagination") {
      pagination = validatePagination(key, value, page, pageSize);
      responseData["message"] = "Lista de Usuarios completa. | Con paginación.";
    }
    let results: any[] = [],
      data: any[] = [];
    let count: number =
      pagination["page"] > 0
        ? pagination["page"] * pagination["pageSize"] - pagination["pageSize"]
        : 0;

    try {
      results = await Project.query()
        .from("projects as p")
        .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
        .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
        .select(["p.id as project_id", "p.name", "*"])
        .orderBy("p.id", "desc");

      if (only) {
        const num = only === "active" ? 1 : 0;
        results = await Project.query()
          .from("projects as p")
          .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
          .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
          .select(["p.id as project_id", "p.name", "*"])
          .where("status", num)
          .orderBy("p.id", "desc");
      }

      if (pagination["page"] !== 0) {
        const whereRaw = getWhereRaw("projects", pagination["search"]!);

        results = await Project.query()
          // .preload("status_info")
          .from("projects as p")
          .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
          .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
          .select(["p.id as project_id", "p.name", "*"])
          .whereRaw(whereRaw)
          // .where(
          //   pagination["search"]!["key"],
          //   "LIKE",
          //   `%${pagination["search"]!["value"]}%`
          // )
          .orderBy("p.id", "desc")
          .limit(pagination["pageSize"])
          .offset(count);

        if (only) {
          const num = only === "active" ? 1 : 0;
          results = await Project.query()
            .from("projects as p")
            .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
            .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
            .select(["p.id as project_id", "p.name", "*"])
            .where("status", num)
            .whereRaw(whereRaw)
            .orderBy("p.id", "desc")
            .limit(pagination["pageSize"])
            .offset(count);
        }
      }
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al obtener todos los Proyectos.",
        400
      );
    }

    results.map((project) => {
      data.push({
        id: project["$extras"]["project_id"],
        name: String(project["$attributes"]["name"]).capitalize(),
        dependency: project["$extras"]["dependency"],
        subdependency: project["$extras"]["subdependency"],
        management_center: project["$extras"]["management_center"],
        cost_center: project["$extras"]["cost_center"],
        status: project["$attributes"]["status"] === 1 ? "Activo" : "Inactivo",
        audit_trail: project["$attributes"]["audit_trail"],
      });
    });

    // Total Results
    try {
      responseData["total_results"] = (await Project.all()).length;

      if (only) {
        const num = only === "active" ? 1 : 0;
        responseData["total_results"] = (
          await Project.query().where("status", num)
        ).length;
      }
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al obtener la cantidad de usuarios completa.",
        400
      );
    }
    // responseData["total_results"] = detailsUser.length;

    // Count
    count = results.length;

    // Next Page
    responseData["next_page"] =
      pagination["page"] * pagination["pageSize"] <
        responseData["total_results"] && pagination["page"] !== 0
        ? sum(parseInt(pagination["page"] + ""), 1)
        : null;

    // Previous Page
    responseData["previous_page"] =
      pagination["page"] - 1 > 0 && pagination["page"] !== 0
        ? pagination["page"] - 1
        : null;

    // Order by descending
    data = data.sort((a, b) => b.id - a.id);

    responseData["results"] = data;
    responseData["page"] = pagination["page"];
    responseData["count"] = count;

    return response.status(responseData["status"]).json(responseData);
  }

  /**
   * index
   */
  public async show({ response, request }: HttpContextContract, id?: number) {
    let results: Project[] | {}, _id: number;

    if (id) _id = id;
    else _id = request.qs().id;

    try {
      results = (
        await Project.query()
          .from("projects as p")
          .innerJoin("status as s", "p.status", "s.id")
          .innerJoin("cost_centers as cc", "p.cost_center_id", "cc.id")
          .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
          .select(["p.id as project_id", "*"])
          .where("p.id", _id)
      )[0];
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al obtener el proyecto",
        500
      );
    }

    results = results === null ? {} : results;

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
  public async create(ctx: HttpContextContract) {
    let responseData: IResponseData = { message: "", status: 200 };
    let { request, response } = ctx;
    let { token } = getToken(request.headers());

    const payloadProject: IPayloadProject = await request.validate(
      CreateProjectValidator
    );

    let dataToCreate: IProjectAttributes,
      costCenterID: CostCenter[],
      costCenterId: number = 0,
      budgetValue: number = 0;

    if (
      payloadProject.dependency &&
      payloadProject.subdependency &&
      payloadProject.management_center &&
      payloadProject.cost_center
    ) {
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
        return messageError(
          error,
          response,
          "Error al obtener el ID del Centro de Costos"
        );
      }

      costCenterId = costCenterID[0]["id"];
    } else if (payloadProject.cost_center_id)
      costCenterId = Number(payloadProject.cost_center_id);

    const auditTrail: AuditTrail = new AuditTrail(token);
    await auditTrail.init();

    if (payloadProject.budget_value) budgetValue = payloadProject.budget_value;

    dataToCreate = {
      name: payloadProject.name.toUpperCase(),
      description: payloadProject.description,

      budget_value: budgetValue,

      cost_center_id: costCenterId,

      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };

    let project: Project;
    try {
      project = await Project.create({
        ...dataToCreate,
      });

      responseData["message"] = "¡Proyecto creado correctamente!";
      responseData["results"] = project;
    } catch (error) {
      return messageError(
        error,
        response,
        "Hubo un error al crear el Proyecto.",
        400
      );
    }

    if (payloadProject["contracts"]) {
      try {
        this.createContracts(payloadProject["contracts"]);
      } catch (error) {
        return messageError(error, response);
      }
    }
    // await Promise.all(
    //   payloadProject["contracts"].map(async (contract) => {
    //     try {
    //       const { default: ContractsController } = await import(
    //         "App/Controllers/Http/ContractsController"
    //       );
    //       return new ContractsController().create(ctx, contract);
    //     } catch (error) {
    //       return messageError(
    //         error,
    //         response,
    //         "Error al crear los contratos",
    //         500
    //       );
    //     }
    //   })
    // );

    return response.status(responseData["status"]).json(responseData);
  }

  /**
   * createContracts
   */
  public async createContracts(contracts: any[]) {
    let dataToCreate: any[] = [];

    contracts.map((contract) => {
      let tmp = {
        ...contract,
        vigency_start: contract["validity"]["start_date"],
        vigency_end: contract["validity"]["end_date"],
      };
      delete tmp["validity"];
      dataToCreate.push({
        ...tmp,
      });
    });

    try {
      const contractsCreated = await ProjectContract.createMany(dataToCreate);
      return contractsCreated;
    } catch (error) {
      console.error(error);
      return Promise.reject("Error al crear los contratos del Proyecto");
    }
  }

  // PUT
  /**
   * update
   */
  public async update({ request, response }: HttpContextContract) {
    const { token } = getToken(request.headers());

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
          budget_value: newData.budget_value
            ? newData.budget_value
            : project.budget_value,
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

        auditTrail.update({ ...dataUpdated }, project);
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
