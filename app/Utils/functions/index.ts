import CostCenter from "App/Models/CostCenter";
import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";

import moment from "moment";
import AuditTrail from "../classes/AuditTrail";
import { decodeJWT } from "./jwt";
import Tipology from "./../../Models/Tipology";

export const sum = (num1: number, num2: number): number => {
  return num1 + num2;
};

export const validateDate = (vigencyEnd: number) => {
  let dateNow = moment().valueOf();
  var discharge = moment(vigencyEnd);
  const diff = discharge.diff(dateNow, "days");

  return diff < 0 ? "Vencida" : "Vigente";
};

type Action = "inactivate" | "terminate" | "activate";

export const changeStatus = async (
  model: any,
  id: string | number,
  action: Action,
  token: string
) => {
  try {
    const data = await model.findOrFail(id);

    const auditTrail = new AuditTrail(token, data.audit_trail);

    if (action === "inactivate") {
      if (data.status != 0) data.status = 0;
      else
        return {
          success: false,
          results: {
            name: "Already inactivate",
            message:
              "Already inactivate, please defore inactivate, activate it.",
          },
        };
    }

    if (action === "activate") data.status = 1;

    auditTrail.update("Administrador", { status: data.status }, data);
    const tmpModel = await data.save();

    return { success: true, results: tmpModel };
  } catch (error) {
    console.error(`Error changing status:\n${error}`);
    return { success: false, results: error };
  }
};

export const capitalize = (str) => {
  if (typeof str === "string") {
    return str
      .trim()
      .toLowerCase()
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  } else {
    return "";
  }
};

export const createSAPID = (
  activeCode: string,
  lastConsecutive: number,
  activeType: string
) => {
  activeType = activeType.replace(/mejora/gi, "MJ").replace(/lote/gi, "L");
  return `${activeCode}${String(sum(lastConsecutive, 1))
    .padStart(4, "0")
    .trim()}${activeType}`;
};

export const getCostCenterID = async (
  dependency: string,
  subdependency: string,
  management_center: number,
  cost_center: number
) => {
  try {
    const costCenterID = await CostCenter.query()
      .from("cost_centers as cc")
      .innerJoin("dependencies as d", "cc.dependency_id", "d.id")
      .select(["cc.id", "d.fixed_assets"])
      .where("d.dependency", dependency)
      .where("cc.subdependency", subdependency)
      .where("d.management_center", management_center)
      .where("cc.cost_center", cost_center);

    return {
      status: 200,
      results: {
        id: String(costCenterID[0]["id"]),
        last_consecutive: costCenterID[0]["last_consecutive"],
        fixed_assets: String(costCenterID[0]["fixed_assets"]),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      result: "Error obteniendo el ID del Centro de Costos",
    };
  }
};

export const getTipologyID = async (
  tipology: string,
  accounting_account: string
) => {
  try {
    const tipologyID = await Tipology.query()
      .select("id")
      .where("tipology", tipology)
      .where("accounting_account", accounting_account);

    return { status: 200, result: String(tipologyID[0]["id"]) };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      result: "Error obteniendo el ID de la Tipología",
    };
  }
};

export const getDataUser = async (token: string) => {
  const { id } = decodeJWT(token);

  // Consulting
  try {
    // User.findOrFail(payload.id);
    const axiosResponse = await axios.get(
      `${Env.get("URI_SERVICE_AUTH")}${Env.get("API_AUTH_VERSION")}/users`,
      {
        params: { id },
      }
    );
    return axiosResponse.data.results.detailsUser;
  } catch (error) {
    console.error(error);
    // return response.unauthorized({
    //   error: "Debe de ingresar para realizar esta acción",
    // });
  }

  // try {
  //   const detailsUser = await DetailsUser.query().where("user_id", id);

  //   return detailsUser[0];
  // } catch (error) {
  //   console.error(error);
  // }
};

export * from "./jwt";
