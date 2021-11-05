import moment from "moment";
export const sum = (num1: number, num2: number): number => {
  return num1 + num2;
};

export const validateDate = (vigencyEnd: number) => {
  let dateNow = moment().valueOf();
  var discharge = moment(vigencyEnd);
  const diff = discharge.diff(dateNow, "days");

  return diff < 0 ? "Vencida" : "Vigente";
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
