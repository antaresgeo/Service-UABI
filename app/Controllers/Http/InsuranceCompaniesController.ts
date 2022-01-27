import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { AuditTrail } from "App/Utils/classes";
import {
  IInsuranceCompany,
  IPayloadInsuranceCompany,
} from "App/Utils/interfaces/insurances";
import CreateInsuranceCompanyValidator from "./../../Validators/CreateInsuranceCompanyValidator";
import InsuranceCompany from "./../../Models/InsuranceCompany";
import { changeStatus, getToken, sum } from "App/Utils/functions";

export default class InsuranceCompaniesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);

    const payload: IPayloadInsuranceCompany = await request.validate(
      CreateInsuranceCompanyValidator
    );
    const auditTrail: AuditTrail = new AuditTrail(token);
    await auditTrail.init();

    try {
      let dataInsuranceCompany: IInsuranceCompany = { ...payload };
      dataInsuranceCompany.status = 1;
      dataInsuranceCompany.audit_trail = auditTrail.getAsJson();

      const insuranceCompany = await InsuranceCompany.create({
        ...dataInsuranceCompany,
      });

      return response.status(200).json({
        message: "Compañía Aseguradora creada correctamente.",
        results: insuranceCompany,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "A ocurrido un error inesperado al crear la Compañía Aseguradora.",
        error,
      });
    }
  }

  /**
   * list
   */
  public async list({ response }: HttpContextContract) {
    try {
      const insuranceCompanies = await InsuranceCompany.query()
        .where("status", 1)
        .orderBy("id", "desc");

      return response.status(200).json({
        message: "Lista de Compañías Aseguradoras.",
        results: insuranceCompanies,
      });
    } catch (error) {
      console.error(error);
      return response.status(200).json({
        message:
          "A ocurrido un error inesperado al obtener la lista de Compañías Aseguradoras.",
        error,
      });
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({ response }: HttpContextContract, id: number) {
    try {
      const insuranceBroker = await InsuranceCompany.findOrFail(id);

      return response.status(200).json({
        message: `Compañía Aseguradora con ID: ${insuranceBroker.id}.`,
        results: insuranceBroker,
      });
    } catch (error) {
      let message: string =
          "A ocurrido un error inesperado al obtener la Compañía Aseguradora.",
        status: number = 500;

      console.error(error.message);
      console.error(error);
      if (error.message === "E_ROW_NOT_FOUND: Row not found") {
        message =
          "No se ha encontrado una Compañía Aseguradora para el ID buscado.";
        status = 400;
      }
      return response.status(status).json({
        message,
        error: { name: error.name },
      });
    }
  }

  public async showAll({ response, request }: HttpContextContract) {
    const { /*q,*/ page, pageSize } = request.qs();
    let tmpPage: number, tmpPageSize: number;

    if (!pageSize) tmpPageSize = 10;
    else tmpPageSize = pageSize;

    if (!page) tmpPage = 1;
    else tmpPage = page;

    let count: number = tmpPage * tmpPageSize - tmpPageSize;

    try {
      const insuranceCompanies = await InsuranceCompany.query()
        .where("status", 1)
        .orderBy("id", "desc")
        .limit(tmpPageSize)
        .offset(count);

      return response.status(200).json({
        message: "Lista con paginación de Compañías Aseguradoras.",
        results: insuranceCompanies,
        page: tmpPage,
        count: insuranceCompanies.length,
        next_page:
          insuranceCompanies.length - tmpPage * tmpPageSize !== 10 &&
          insuranceCompanies.length - tmpPage * tmpPageSize > 0
            ? sum(parseInt(tmpPage + ""), 1)
            : null,
        previous_page: tmpPage - 1 < 0 ? tmpPage - 1 : null,
        total_results: insuranceCompanies.length,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "A ocurrido un error inesperado al obtener la lista de Compañías Aseguradoras.",
        error,
      });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ response, request }: HttpContextContract, alt?: any) {
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);

    let newData, _id;

    if (alt) {
      newData = alt["data"];
      _id = String(alt["id"]);
    } else {
      newData = request.body();
      const { id } = request.qs();
      _id = id;
    }

    try {
      const insuranceBroker = await InsuranceCompany.findOrFail(_id);

      const auditTrail = new AuditTrail(token, insuranceBroker.audit_trail);
      auditTrail.update(newData, insuranceBroker);

      // Updating data
      try {
        const insuranceBrokerUpdated = await insuranceBroker
          .merge({
            ...newData,
            audit_trail: auditTrail.getAsJson(),
          })
          .save();

        return response.status(200).json({
          message: `Compañía Aseguradora ${insuranceBrokerUpdated.name} actualizada satisfactoriamente.`,
          results: insuranceBrokerUpdated,
        });
      } catch (error) {
        console.error(error);
        console.error(error.message);

        return response.status(500).json({
          message: "Error al actualizar: Servidor",
          error: { name: error.name },
        });
      }
    } catch (error) {
      let message: string =
          "A ocurrido un error inesperado al obtener el Compañía Aseguradora.",
        status: number = 500;

      console.error(error.message);
      console.error(error);
      if (error.message === "E_ROW_NOT_FOUND: Row not found") {
        message =
          "No se ha encontrado un Corredor de Seguros para el ID buscado.";
        status = 400;
      }
      return response.status(status).json({
        message,
        error: { name: error.name },
      });
    }
  }

  /**
   * inactivate
   */
  public async inactivate({ request, response }: HttpContextContract) {
    const { token } = getToken(request.headers(), {
      response,
    } as HttpContextContract);

    const { id } = request.params();

    const { success, results } = await changeStatus(
      InsuranceCompany,
      id,
      "inactivate",
      token
    );

    if (success)
      return response.status(200).json({
        message: "Compañía Aseguradora Inactivada",
        results,
      });
    else {
      let message: string =
          "A ocurrido un error inesperado al inactivar la Compañía Aseguradora.",
        status: number = 500;

      console.error(results.message);
      console.error(results);
      if (results.message === "E_ROW_NOT_FOUND: Row not found") {
        message =
          "No se ha encontrado una Compañía Aseguradora para el ID buscado.";
        status = 400;
      }
      return response.status(status).json({
        message,
        error: { name: results.name },
      });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
