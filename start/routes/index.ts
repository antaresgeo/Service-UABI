// import "./project";
// import "./realEstate";
// import "./acquisition";
// import "./insurability";
// import "./insuranceBroker";
// import "./insuranceCompany";
import Route from "@ioc:Adonis/Core/Route";

Route.get("", (ctx) => {
  ctx.response.send("works");
});
