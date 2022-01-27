import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// MODELS
import Project from "App/Models/Project";
import RealEstateOwner from "./../../Models/RealEstateOwner";
import RealEstatesProject from "App/Models/RealEstatesProject";
import RealEstateProperty from "./../../Models/RealEstateProperty";
import PublicService from "./../../Models/PublicService";
import PhysicalInspection from "./../../Models/PhysicalInspection";
import OcupationRealEstate from "./../../Models/OcupationRealEstate";
import Dependency from "App/Models/Dependency";
import RealEstate from "./../../Models/RealEstate";

// VALIDATORS
import CreateRealEstate from "./../../Validators/CreateRealEstateValidator";
import CreateManyRealeEstateValidator from "App/Validators/CreateManyRealeEstateValidator";

// SERVICES
import { getAddressById } from "App/Services";

// UTILS
// Classes
import { AuditTrail, Logger } from "App/Utils/classes";
// Functions
import {
  getCostCenterID,
  getToken,
  messageError,
  sum,
  validatePagination,
  createSAPID,
  createXLSXFromInventoryRegister,
} from "App/Utils/functions";
// Interfaces
import {
  IPaginationValidated,
  IPayloadManyRealEstates,
  IPayloadRealEstate,
  IRealEstateAttributes,
  IResponseData,
} from "App/Utils/interfaces";
import { Manager } from "App/Utils/enums";

export default class RealEstatesController {
  private logger: Logger;
  private responseData: IResponseData;
  constructor(ip: string) {
    this.logger = new Logger(ip, Manager.RealEstatesController);
    this.responseData = { message: "", status: 200 };
  }

  // GET
  /**
   * Index: Currently create the excel with all data of RE
   */
  public async index(ctx: HttpContextContract) {
    await createXLSXFromInventoryRegister(ctx, "UABI");

    return ctx.response.download("tmp/Registro de Inventario.xlsx");
  }

  /**
   * historic
   */
  public async historic(ctx: HttpContextContract) {
    const realEstates = await RealEstatesProject.query()
      .from("real_estates_projects as a")
      .innerJoin("projects as p", "a.project_id", "p.id")
      .innerJoin("cost_centers as ccp", "p.cost_center_id", "ccp.id")
      .innerJoin("dependencies as dp", "ccp.dependency_id", "dp.id")
      .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
      .innerJoin("cost_centers as cc", "re.cost_center_id", "cc.id")
      .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
      .innerJoin("tipologies as t", "re.tipology_id", "t.id")
      // .innerJoin("tipologies as t", "re.tipology_id", "t.id")
      .select([
        "p.name as project_name",
        "p.cost_center_id as project_cost_center_id",
        "re.name as re_name",
        "*",
      ])
      .orderBy("re.id", "desc");

    console.log(realEstates);

    return ctx.response.json({ results: {} });
  }

  /**
   * Real Estates List.
   */
  public async list(
    { response, request }: HttpContextContract,
    toExcel?: boolean
  ) {
    this.responseData = {
      message: "Lista de Bienes Inmuebles completa. | Sin paginación.",
      status: 200,
    };
    const { headerAuthorization } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
    const { key, value, page, pageSize, to, only, without } = request.qs();

    let data: any[] = [];
    let pagination: IPaginationValidated = { page: 0, pageSize: 1000000 };
    const tmpWith = request.qs().with;
    if (tmpWith && tmpWith === "pagination") {
      pagination = validatePagination(key, value, page, pageSize);
      this.responseData["message"] =
        "Lista de Bienes Inmuebles completa. | Con paginación.";
    }

    let results: any[] = [],
      realEstates;
    let physicalInspection: PhysicalInspection;

    let count: number =
      pagination["page"] > 0
        ? pagination["page"] * pagination["pageSize"] - pagination["pageSize"]
        : 0;

    if (without) {
      if (without === "policy") {
        if (tmpWith && tmpWith === "pagination") {
          return messageError(
            undefined,
            response,
            "Paginación no permitida para esta lista.",
            400
          );
        }

        try {
          results = await RealEstatesProject.query()
            .preload("real_estate_info", (realEstate) => {
              realEstate
                .select(["id", "name", "registry_number"])
                .whereNull("policy_id")
                .where("status", 1);
            })
            .preload("project_info", (project) => {
              project.preload("status_info");
            })
            .orderBy("real_estate_id", "desc")
            .limit(pagination["pageSize"])
            .offset(count);
        } catch (error) {
          return messageError(
            error,
            response,
            "Error al obtener la lista de los Bienes Inmuebles. [ RE ]",
            400
          );
        }
        this.responseData["message"] = "Lista de Bienes Inmuebles sin póliza.";
      }
    } else
      switch (to) {
        case "disposition":
          try {
            results = await RealEstatesProject.query()
              .preload("real_estate_info", (realEstate) => {
                realEstate.preload("status_info").preload("cost_center_info");
              })
              .preload("project_info", (project) => {
                project
                  .select(["id"])
                  .preload("status_info")
                  .preload("cost_center_info");
              })
              .orderBy("real_estate_id", "desc")
              .limit(pagination["pageSize"])
              .offset(count);

            this.logger.log(results[0], 135, true);
          } catch (error) {
            return messageError(
              error,
              response,
              "Error al obtener la lista de los Bienes Inmuebles. [ I ]",
              400
            );
          }
          break;

        default:
          try {
            results = await RealEstatesProject.query()
              .preload("real_estate_info", (realEstate) => {
                realEstate.preload("status_info").preload("cost_center_info");
              })
              .preload("project_info", (project) => {
                project.preload("status_info");
              })
              .orderBy("real_estate_id", "desc")
              .limit(pagination["pageSize"])
              .offset(count);

            if (only) {
              const num = only === "active" ? 1 : 0;
              results = await RealEstatesProject.query()
                .innerJoin(
                  "real_estates as re",
                  "real_estates_projects.real_estate_id",
                  "re.id"
                )
                .preload("real_estate_info", (realEstate) => {
                  realEstate
                    .preload("status_info")
                    .select(["id", "registry_number", "name"]);
                })
                .preload("project_info", (project) => {
                  project.preload("status_info");
                })
                .orderBy("real_estate_id", "desc")
                .limit(pagination["pageSize"])
                .offset(count)
                .where("re.status", num);
            }

            // results.map((result) => {
            //   console.log(result["$preloaded"]);
            // });
          } catch (error) {
            return messageError(
              error,
              response,
              "Error al obtener la lista de los Bienes Inmuebles. [ RE ]",
              400
            );
          }
          break;
      }

    //   if (tmpWith === "pagination")
    //     results = await RealEstatesProject.query()
    //       .from("real_estates_projects as a")
    //       .innerJoin("projects as p", "a.project_id", "p.id")
    //       .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
    //       .innerJoin("status as s", "re.status", "s.id")
    //       .innerJoin("cost_centers as cc", "re.cost_center_id", "cc.id")
    //       .select([
    //         "p.name as project_name",
    //         "re.name as re_name",
    //         "re.id as re_id",
    //       ])
    //       .select("*")
    //       .where("re.status", 1)
    //       // .where(
    //       //   `re.${pagination["search"]?.key}`,
    //       //   "LIKE",
    //       //   "'%" + pagination["search"]?.value + "%'"
    //       // )

    await Promise.all(
      results.map(async (re) => {
        if (re["$preloaded"]["real_estate_info"] !== null) {
          let realEstatesToExport: any;
          if (without && without === "policy") {
            this.logger.log(re["$preloaded"]["real_estate_info"], 270, true);
            realEstatesToExport = {
              id: re["$preloaded"]["real_estate_info"]["id"],
              name: re["$preloaded"]["real_estate_info"]["name"],
              registry_number:
                re["$preloaded"]["real_estate_info"]["registry_number"],
            };
          } else {
            // Get Info Address
            const address: any = await getAddressById(
              Number(
                re["$preloaded"]["real_estate_info"]["$attributes"]["address"]
              ),
              headerAuthorization
            );

            let project = { ...re["$preloaded"]["project_info"] };
            delete project["$attributes"]["audit_trail"]["updated_values"];

            realEstatesToExport = {
              ...re["$preloaded"]["real_estate_info"]["$attributes"],
              address: { ...address },
              project: {
                ...project["$attributes"],
                status: project["$preloaded"]["status_info"]["status_name"],
              },
              // id: re["$extras"]["re_id"],
              // status: re["$extras"]["status_name"],
              // name: re["$extras"]["re_name"],
              // materials: re["$extras"]["materials"].split(","),
            };

            delete realEstatesToExport["project_name"];
            delete realEstatesToExport["status_name"];
            delete realEstatesToExport["project_cost_center_id"];
            delete realEstatesToExport["re_name"];
            delete realEstatesToExport["re_id"];
            if (realEstatesToExport["audit_trail"])
              delete realEstatesToExport["audit_trail"]["updated_values"];
          }

          if (to && to === "inspection") {
            // Physical Inspection
            try {
              physicalInspection = await PhysicalInspection.findByOrFail(
                "real_estate_id",
                realEstatesToExport.id
              );
            } catch (error) {
              return messageError(
                error,
                response,
                "Error inesperado al obtener la Inspección Física actual de la inspección.\nRevisar Terminal."
              );
            }

            realEstatesToExport["inspection_date"] =
              physicalInspection["$attributes"]["inspection_date"] === null
                ? "No realizada"
                : physicalInspection["$attributes"]["inspection_date"];

            realEstatesToExport["status"] =
              re["$extras"]["disposition_type"] === null
                ? "Sin contrato"
                : "Con contrato";
          }

          await data.push(realEstatesToExport);
        }
      })
    );

    try {
      realEstates = await RealEstate.query().where("status", 1);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "Error al traer la lista de todos los Bienes Inmuebles.",
      });
    }

    data = data.sort((a, b) => b.id - a.id);

    this.responseData["results"] = data;
    this.responseData["page"] = pagination["page"];
    this.responseData["count"] = data.length;
    this.responseData["next_page"] =
      realEstates.length - pagination["page"] * pagination["pageSize"] !== 10 &&
      realEstates.length - pagination["page"] * pagination["pageSize"] > 0
        ? sum(parseInt(pagination["page"] + ""), 1)
        : null;
    this.responseData["previous_page"] =
      pagination["page"] - 1 < 0 ? pagination["page"] - 1 : null;
    this.responseData["total_results"] = realEstates.length;

    if (toExcel) return data;
    return response.status(this.responseData["status"]).json(this.responseData);
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
        .innerJoin("dependencies as d", "cc.dependency_id", "d.id")

        .innerJoin("status as s", "re.status", "s.id")
        .select([
          "p.name as project_name",
          "p.description as project_description",
          "cc.subdependency as re_subdependency",
          "cc.cost_center as re_cost_center",
          "re.name as re_name",
          "re.id as re_id",
        ])
        .select("*")
        .where("a.project_id", parseInt(id))
        .orderBy("re.id", "desc");
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Real Estates failed!" });
    }
    let results = list === null ? [] : list;

    const data: any[] = [];

    results.map((re) => {
      let tmp = {
        ...re["$extras"],
        project: {
          id: re["project_id"],
          name: re["$extras"]["project_name"],
        },
        id: re["$extras"]["re_id"],
        status: re["$extras"]["name"],
        dependency: re["$extras"]["dependency"],
        subdependency: re["$extras"]["subdependency"],
        management_center: re["$extras"]["management_center"],
        cost_center: re["$extras"]["cost_center"],
        name: re["$extras"]["re_name"],
        materials: re["$extras"]["materials"].split(","),
      };

      delete tmp["project_name"];
      delete tmp["project_description"];
      delete tmp["re_name"];
      delete tmp["re_id"];

      data.push(tmp);
    });

    // list.map((re) => {
    //   data.push(re["$extras"]);
    // });

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
    const { token } = getToken(ctx.request.headers(), ctx);
    const { id } = ctx.request.qs();

    let results;

    try {
      results = await RealEstatesProject.query()
        .from("real_estates_projects as a")
        .innerJoin("projects as p", "a.project_id", "p.id")
        .innerJoin("real_estates as re", "a.real_estate_id", "re.id")
        .innerJoin("cost_centers as cc", "re.cost_center_id", "cc.id")
        .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
        .innerJoin("status as s", "re.status", "s.id")
        .select([
          "p.name as project_name",
          "re.id as re_id",
          "re.name as re_name",
          "*",
        ])
        .where("re.id", id);
    } catch (error) {
      console.error(error);
      return ctx.response.status(500).json({ message: "Real Estate error" });
    }

    // Get Info Address
    const address: any = await getAddressById(
      Number(results[0]["$extras"]["address"]),
      `Bearer ${token}`
    );

    let project: any = {};

    project = {
      ...results[0]["$extras"],
      project: {
        id: results[0]["$original"]["project_id"],
        name: results[0]["$extras"]["project_name"],
      },
      id: results[0]["$extras"]["re_id"],
      status: results[0]["$extras"]["status_name"],
      name: results[0]["$extras"]["re_name"],
      materials: results[0]["$extras"]["materials"].split(","),
      address: { ...address },
    };

    delete project["project_name"];
    delete project["budget_value"];
    delete project["project_description"];
    delete project["re_name"];
    delete project["re_id"];

    project["supports_documents"] =
      project["supports_documents"] === null
        ? []
        : project["supports_documents"].split(",");

    return ctx.response.json({ message: "Real Estate", results: project });
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    const { response, request } = ctx;
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
    const payload: IPayloadRealEstate = await request.validate(
      CreateRealEstate
    );
    let project: Project | any;

    // Get Id of Dependency and its values
    let costCenterId: any = payload["cost_center_id"]
      ? payload["cost_center_id"]
      : null;

    if (
      payload["dependency"] &&
      payload["subdependency"] &&
      payload["management_center"] &&
      payload["cost_center"]
    ) {
      costCenterId = await getCostCenterID(
        payload["dependency"],
        payload["subdependency"],
        payload["management_center"],
        payload["cost_center"]
      );

      if (costCenterId.status === 500)
        return response
          .status(costCenterId.status)
          .json({ message: costCenterId.results.id });
    }

    const auditTrail: AuditTrail = new AuditTrail(token);
    await auditTrail.init();

    try {
      let dataRealEstate: IRealEstateAttributes = {
        ...payload,
      };
      delete dataRealEstate["tipology"];
      delete dataRealEstate["accounting_account"];

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
            let sapIds: string[] = [];
            dataRealEstate.active_type.split(",").map((activeType) => {
              sapIds.push(
                createSAPID(
                  project.fixed_assets,
                  Number(project.last_consecutive),
                  String(activeType.trim())
                )
              );
            });
            const tipology = await Dependency.find(project.dependency_id);
            tipology
              ?.merge({
                last_consecutive: sum(Number(project.last_consecutive), 1),
              })
              .save();
            dataRealEstate["sap_id"] = sapIds.join(", ");
          }
        } catch (error) {
          console.error(error);
          return response.status(402).json({
            message:
              "El Proyecto al que quiere relacionar no existe, crearlo antes de asignar.",
          });
        }
      } else {
        dataRealEstate.cost_center_id = costCenterId.results.id;
        let sapIds: string[] = [];
        if (dataRealEstate["sap_id"]) {
          dataRealEstate["sap_id"].split(",").map((activeCode) => {
            sapIds.push(activeCode);
          });
        } else {
          dataRealEstate.active_type.split(",").map((activeType) => {
            sapIds.push(
              createSAPID(
                costCenterId.results.fixed_assets,
                costCenterId.results.last_consecutive,
                String(activeType)
              )
            );
          });
          const tipology = await Dependency.find(project.dependency_id);
          tipology
            ?.merge({
              last_consecutive: sum(Number(project.last_consecutive), 1),
            })
            .save();
        }
        dataRealEstate["sap_id"] = sapIds.join(", ");
      }

      delete dataRealEstate.projects_id;
      dataRealEstate.audit_trail = auditTrail.getAsJson();

      dataRealEstate.status = 1;

      const realEstate = await RealEstate.create({
        ...dataRealEstate,
      });

      if (payload.projects_id)
        await this.createRelation(payload.projects_id, realEstate);
      else await this.createRelation([0], realEstate);

      try {
        await OcupationRealEstate.create({
          tenure: "",
          use: "",
          ownership: "",
          contractual: "",

          real_estate_id: Number(realEstate["id"]),

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message: "Error inesperado al crear la ocupación del bien inmueble.",
        });
      }

      let physicalInspectionID: number = 0;
      try {
        const physicalInspection = await PhysicalInspection.create({
          real_estate_id: Number(realEstate["id"]),

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        physicalInspectionID = Number(physicalInspection["id"]);
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message:
            "Error inesperado al crear la inspección física base del bien inmueble.",
        });
      }

      try {
        await PublicService.create({
          name: "Energía",
          subscriber: 0,
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await PublicService.create({
          name: "Gas",
          subscriber: 0,
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await PublicService.create({
          name: "Agua",
          subscriber: 0,
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await PublicService.create({
          name: "Telefono",
          subscriber: 0,
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message:
            "Error inesperado al crear ls servicios públicos de la insepcción física base del bien inmueble.",
        });
      }

      try {
        await RealEstateOwner.create({
          real_estate_id: Number(realEstate["id"]),

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message:
            "Error inesperado al crear el registro del poseedor del bien inmueble.",
        });
      }

      try {
        await RealEstateProperty.create({
          name: "Cerramiento",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Fachada",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Pintura exterior",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Cubierta o techo",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Pisos",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Enchapes de baño y/o cocina",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Pintura interior",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Ventanas",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Puerta principal",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Cerraduras puerta principal",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Puertas interiores",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Cerraduras puertas interiores",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Rejas de seguridad",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Paredes",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Escaleras",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Aparatos sanitarios",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Orinales",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Griferías y abastos",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Lavamanos",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Rejillas desagüe",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Sistema eléctronico",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });

        await RealEstateProperty.create({
          name: "Acometidas eléctricas",
          status_property: "No aplica",
          accountant: 0,

          physical_inspection_id: physicalInspectionID,

          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message:
            "Error inesperado al crear el registro de la inspección física del bien inmueble.",
        });
      }

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

  public async createMany(ctx: HttpContextContract) {
    const { response, request } = ctx;
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);
    const payload: IPayloadManyRealEstates = await request.validate(
      CreateManyRealeEstateValidator
    );
    let project: Project | any;
    let costCenterId: any;
    let realEstatedCreated: any[] = [];

    // Get Id of Dependency and its values
    if (
      payload["dependency"] &&
      payload["subdependency"] &&
      payload["management_center"] &&
      payload["cost_center"]
    ) {
      costCenterId = await getCostCenterID(
        payload["dependency"],
        payload["subdependency"],
        payload["management_center"],
        payload["cost_center"]
      );

      if (costCenterId.status === 500)
        return response
          .status(costCenterId.status)
          .json({ message: costCenterId.results.id });
    }

    const auditTrail: AuditTrail = new AuditTrail(token);
    await auditTrail.init();

    try {
      await Promise.all(
        payload.realEstates.map(async (re) => {
          let dataRealEstate: IRealEstateAttributes = {
            ...re,
            // tipology_id: parseInt(tipologyId.result),
          };
          delete dataRealEstate["tipology"];
          delete dataRealEstate["accounting_account"];

          if (re.projects_id) {
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
                let sapIds: string[] = [];
                dataRealEstate.active_type.split(",").map((activeType) => {
                  sapIds.push(
                    createSAPID(
                      project.fixed_assets,
                      Number(project.last_consecutive),
                      String(activeType.trim())
                    )
                  );
                });
                const tipology = await Dependency.find(project.dependency_id);
                tipology
                  ?.merge({
                    last_consecutive: sum(Number(project.last_consecutive), 1),
                  })
                  .save();
                dataRealEstate["sap_id"] = sapIds.join(", ");
              }
            } catch (error) {
              console.error(error);
              return response.status(402).json({
                message:
                  "El Proyecto al que quiere relacionar no existe, crearlo antes de asignar.",
              });
            }
          } else {
            dataRealEstate.cost_center_id = costCenterId.results.id;
            let sapIds: string[] = [];
            dataRealEstate.active_type.split(",").map((activeType) => {
              sapIds.push(
                createSAPID(
                  costCenterId.results.fixed_assets,
                  costCenterId.results.last_consecutive,
                  String(activeType)
                )
              );
            });
            const tipology = await Dependency.find(project.dependency_id);
            tipology
              ?.merge({
                last_consecutive: sum(Number(project.last_consecutive), 1),
              })
              .save();
            dataRealEstate["sap_id"] = sapIds.join(", ");
          }

          delete dataRealEstate.projects_id;
          dataRealEstate.audit_trail = auditTrail.getAsJson();

          dataRealEstate.status = 1;

          const realEstate = await RealEstate.create({
            ...dataRealEstate,
          });

          if (re.projects_id)
            await this.createRelation(re.projects_id, realEstate);
          else await this.createRelation([0], realEstate);

          try {
            await OcupationRealEstate.create({
              tenure: "",
              use: "",
              ownership: "",
              contractual: "",

              real_estate_id: Number(realEstate["id"]),

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });
          } catch (error) {
            console.error(error);
            return response.status(500).json({
              message:
                "Error inesperado al crear la ocupación del bien inmueble.",
            });
          }

          let physicalInspectionID: number = 0;
          try {
            const physicalInspection = await PhysicalInspection.create({
              real_estate_id: Number(realEstate["id"]),

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            physicalInspectionID = Number(physicalInspection["id"]);
          } catch (error) {
            console.error(error);
            return response.status(500).json({
              message:
                "Error inesperado al crear la inspección física base del bien inmueble.",
            });
          }

          try {
            await PublicService.create({
              name: "Energía",
              subscriber: 0,
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await PublicService.create({
              name: "Gas",
              subscriber: 0,
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await PublicService.create({
              name: "Agua",
              subscriber: 0,
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await PublicService.create({
              name: "Telefono",
              subscriber: 0,
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });
          } catch (error) {
            console.error(error);
            return response.status(500).json({
              message:
                "Error inesperado al crear ls servicios públicos de la insepcción física base del bien inmueble.",
            });
          }

          try {
            await RealEstateOwner.create({
              real_estate_id: Number(realEstate["id"]),

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });
          } catch (error) {
            console.error(error);
            return response.status(500).json({
              message:
                "Error inesperado al crear el registro del poseedor del bien inmueble.",
            });
          }

          try {
            await RealEstateProperty.create({
              name: "Cerramiento",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Fachada",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Pintura exterior",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Cubierta o techo",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Pisos",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Enchapes de baño y/o cocina",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Pintura interior",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Ventanas",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Puerta principal",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Cerraduras puerta principal",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Puertas interiores",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Cerraduras puertas interiores",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Rejas de seguridad",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Paredes",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Escaleras",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Aparatos sanitarios",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Orinales",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Griferías y abastos",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Lavamanos",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Rejillas desagüe",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Sistema eléctronico",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });

            await RealEstateProperty.create({
              name: "Acometidas eléctricas",
              status_property: "No aplica",
              accountant: 0,

              physical_inspection_id: physicalInspectionID,

              status: 1,
              audit_trail: auditTrail.getAsJson(),
            });
          } catch (error) {
            console.error(error);
            return response.status(500).json({
              message:
                "Error inesperado al crear el registro de la inspección física del bien inmueble.",
            });
          }
          realEstatedCreated.push({
            ...realEstate["$attributes"],
            project: project,
          });
        })
      );

      return response.status(200).json({
        message: "Bien Inmueble creado correctamente.",
        results: realEstatedCreated,
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
          let relationREP = await RealEstatesProject.query().where(
            "real_estate_id",
            realEstate.id
          );

          await Promise.all(
            relationREP.map(async (relation) => {
              await relation.delete();
            })
          );

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
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);

    let newData, _id;
    // let costCenterID;

    if (alt) {
      newData = alt["data"];
      _id = String(alt["id"]);
    } else {
      newData = request.body();
      const { id } = request.qs();
      _id = id;
    }

    try {
      if (typeof _id === "string") {
        const realEstate = await RealEstate.findOrFail(_id);
        if (!alt && newData["projects_id"])
          await this.createRelation(newData["projects_id"], realEstate);

        let dataUpdated: IRealEstateAttributes = {
          ...newData,
        };

        if (newData["name"])
          dataUpdated["name"] = newData["name"].toUpperCase().trim();

        if (newData["description"])
          dataUpdated["description"] = newData["description"]
            .toUpperCase()
            .trim();

        delete dataUpdated["projects_id"];

        const auditTrail = new AuditTrail(token, realEstate.audit_trail);
        await auditTrail.update(dataUpdated, realEstate);
        // if (
        //   newData["dependency"] &&
        //   newData["subdependency"] &&
        //   newData["management_center"] &&
        //   newData["cost_center"]
        // )
        //   try {
        //     costCenterID = await CostCenter.query()
        //       .select("id")
        //       .where("dependency", newData["dependency"])
        //       .where("subdependency", newData["subdependency"])
        //       .where("management_center", newData["management_center"])
        //       .where("cost_center", newData["cost_center"]);

        //     // dataUpdated["cost_center_id"] = costCenterID[0]["id"];
        //   } catch (error) {
        //     console.error(error);
        //     return response.status(500).json({
        //       message: "Error obteniendo el ID del Centro de Costos",
        //       error,
        //     });
        //   }

        // Updating data
        try {
          const realEstateUpdated = await realEstate
            .merge({
              ...dataUpdated,
              audit_trail: auditTrail.getAsJson(),
            })
            .save();

          if (alt && alt["dataToShow"])
            return response.status(200).json({
              message: "Updated successfully!",
              results: {
                ...alt["dataToShow"]["$attributes"],
              },
            });
          return response.status(200).json({
            message: "Updated successfully!",
            results: {
              ...realEstateUpdated["$attributes"],
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
