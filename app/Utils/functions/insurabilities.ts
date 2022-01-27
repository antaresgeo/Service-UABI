import moment from "moment";

export const validateDate = (vigencyEnd: number) => {
  let dateNow = moment().valueOf();
  var discharge = moment(vigencyEnd);
  const diff = discharge.diff(dateNow, "days");

  return diff < 0 ? "Vencida" : "Vigente";
};
