import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    // Route.get("/", async (ctx) => {
    //   const { default: InspectionsController } = await import(
    //     "App/Controllers/Http/InspectionsController"
    //   );

    //   if (ctx.request.qs().id) return new InspectionsController().show(ctx);

    //   //   if (ctx.request.qs().with)
    //   //     return new InspectionsController().showAllPagination(ctx);

    //   // return new InspectionsController().showAll(ctx);
    // });

    // POST
    Route.post("/", async (ctx) => {
      const { default: ContractsController } = await import(
        "App/Controllers/Http/ContractsController"
      );
      return new ContractsController().create(ctx);
    });

    // PUT
    // Route.put("/", async (ctx) => {
    //   const { default: InspectionsController } = await import(
    //     "App/Controllers/Http/InspectionsController"
    //   );
    //   return new InspectionsController().update(ctx);
    // });

    // Route.put("/alt-status", async (ctx) => {
    //   const { default: InspectionsController } = await import(
    //     "App/Controllers/Http/InspectionsController"import ContractsController from './../../app/Controllers/Http/ContractsController';

    //   );
    //   return new InspectionsController().changeStatus(ctx);
    // });
  }).prefix("/contracts");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
