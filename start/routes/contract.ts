import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: ContractsController } = await import(
        "App/Controllers/Http/ContractsController"
      );

      if (ctx.request.qs().id) return new ContractsController().show(ctx);
      // if (ctx.request.qs().project) return new ContractsController().showByProject(ctx);

      return new ContractsController().showAll(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: ContractsController } = await import(
        "App/Controllers/Http/ContractsController"
      );
      return new ContractsController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: ContractsController } = await import(
        "App/Controllers/Http/ContractsController"
      );
      return new ContractsController().update(ctx);
    });
  }).prefix("/contracts");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
