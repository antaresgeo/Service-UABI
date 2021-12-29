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

      if (ctx.request.qs()["id"]) return new TipologiesController().show(ctx);

      return new TipologiesController().showAll(ctx);
    });
  }).prefix("/tipologies");

  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: DependenciesController } = await import(
        "App/Controllers/Http/DependenciesController"
      );

      if (ctx.request.qs()["id"]) return new DependenciesController().show(ctx);

      return new DependenciesController().list(ctx);
    });
  }).prefix("/dependencies");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
