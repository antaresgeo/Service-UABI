// Generals
import "./generalData";
import "./personalInformation";

// Acquisitions
import "./project";
import "./contract";
import "./realEstate";
import "./acquisition";

// Insurability
import "./insurability";
import "./insuranceBroker";
import "./insuranceCompany";

// Inspection
import "./inspection";

import Route from "@ioc:Adonis/Core/Route";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.get("/", (ctx) => {
  return ctx.response.status(200).json({
    message: "Servicio Core de SABI",
    documentation: "/docs",
    version: apiVersion,
  });
});

Route.get("health", async ({ response }) => {
  const report = await HealthCheck.getReport();

  return report.healthy ? response.ok(report) : response.badRequest(report);
});
