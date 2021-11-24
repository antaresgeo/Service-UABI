import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: InsurabilitiesController } = await import(
        "App/Controllers/Http/InsurabilitiesController"
      );

      if (ctx.request.qs().policy_id)
        return new InsurabilitiesController().getByRealEstate(ctx);

      if (ctx.request.qs().id)
        return new InsurabilitiesController().getOne(ctx);

      if (ctx.request.qs().with)
        return new InsurabilitiesController().showAllPagination(ctx);

      // return new InsurabilitiesController().showAll(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: InsurabilitiesController } = await import(
        "App/Controllers/Http/InsurabilitiesController"
      );
      return new InsurabilitiesController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: InsurabilitiesController } = await import(
        "App/Controllers/Http/InsurabilitiesController"
      );
      return new InsurabilitiesController().update(ctx);
    });

    // Route.put("/alt-status", async (ctx) => {
    //   const { default: InsurabilitiesController } = await import(
    //     "App/Controllers/Http/InsurabilitiesController"
    //   );
    //   return new InsurabilitiesController().changeStatus(ctx);
    // });
  }).prefix("/insurabilities");
})
  .prefix(apiVersion)
  .middleware(["logRegistered"]);
