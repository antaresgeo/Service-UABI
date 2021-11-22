import CostCenter from "App/Models/CostCenter";
import moment from "moment";
import AuditTrail from "../classes/AuditTrail";

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
  action: Action
) => {
  try {
    const data = await model.findOrFail(id);

    const auditTrail = new AuditTrail(undefined, data.audit_trail);

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
  consecutive: number,
  activeType: string
) => {
  activeType = activeType.replace(/mejora/gi, "MJ").replace(/lote/gi, "L");
  return `${activeCode}${numberWithZeros(String(consecutive), 4)}${activeType}`;
};

export const numberWithZeros = (numAsString: string, cantZeros: number) => {
  let tmpCode: string = "";

  cantZeros = cantZeros - numAsString.length;
  for (let i = 0; i < cantZeros; i++) {
    tmpCode += "0";
    tmpCode += numAsString;
  }

  return tmpCode;
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
      .select("cc.id")
      .where("d.dependency", dependency)
      .where("cc.subdependency", subdependency)
      .where("d.management_center", management_center)
      .where("cc.cost_center", cost_center);

    return { status: 200, result: String(costCenterID[0]["id"]) };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      result: "Error obteniendo el ID del Centro de Costos",
    };
  }
};

// private decodeJWT() {
//   try {
//     let decode = jwt.verify(this.token, "your-256-bit-secret");
//     console.log(decode);
//     return decode;
//   } catch (error) {
//     console.error(error);
//   }
// }
