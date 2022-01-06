import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      // GET
      // Route.get("/lists", async (ctx) => {
      //   const { default: AdquisitionsController } = await import(
      //     "App/Controllers/Http/AdquisitionsController"
      //   );
      //   return new AdquisitionsController().getList(ctx);
      // });

      // Route.get("/project", async (ctx) => {
      //   const { default: AdquisitionsController } = await import(
      //     "App/Controllers/Http/AdquisitionsController"
      //   );
      //   return new AdquisitionsController().getByProject(ctx);
      // });

      Route.get("/", async (ctx) => {
        const { default: AdquisitionsController } = await import(
          "App/Controllers/Http/AcquisitionsController"
        );

        if (ctx.request.qs().real_estate_id)
          return new AdquisitionsController().getByRealEstate(ctx);

        return new AdquisitionsController().getAll(ctx);
      });

      // POST
      Route.post("/", async (ctx) => {
        const { default: AdquisitionsController } = await import(
          "App/Controllers/Http/AcquisitionsController"
        );

        // if (ctx.request.qs().action === "many")
        //   return new AdquisitionsController().createMany(ctx);
        // else if (ctx.request.qs().action === "one")
        return new AdquisitionsController().create(ctx);
      });

      // PUT
      Route.put("/", async (ctx) => {
        const { default: AcquisitionsController } = await import(
          "App/Controllers/Http/AcquisitionsController"
        );
        if (ctx.request.qs().action === "many")
          return new AcquisitionsController().updateMany(ctx);

        return new AcquisitionsController().update(ctx);
      });

      Route.delete("/", async (ctx) => {
        const { default: AcquisitionsController } = await import(
          "App/Controllers/Http/AcquisitionsController"
        );
        return new AcquisitionsController().inactivate(ctx);
      });
    }).prefix("/adquisitions");
  }).prefix("/real-estates");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
