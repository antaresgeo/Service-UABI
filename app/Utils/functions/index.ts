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

// private decodeJWT() {
//   try {
//     let decode = jwt.verify(this.token, "your-256-bit-secret");
//     console.log(decode);
//     return decode;
//   } catch (error) {
//     console.error(error);
//   }
// }
