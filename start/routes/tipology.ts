import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: TipologiesController } = await import(
        "App/Controllers/Http/TipologiesController"
      );

      return new TipologiesController().showAll(ctx);
    });
  }).prefix("/tipologies");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
