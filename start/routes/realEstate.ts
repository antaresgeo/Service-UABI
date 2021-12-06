import Route from "@ioc:Adonis/Core/Route";

import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/list", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );

      // if (!ctx.request.qs().q) return new RealEstatesController().getList(ctx);
      return new RealEstatesController().getList(ctx);

      // return new RealEstatesController().filter(ctx);
    });

    Route.get("/project", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().getByProject(ctx);
    });

    Route.get("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().getOne(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );

      if (ctx.request.qs().action === "many")
        return new RealEstatesController().createMany(ctx);

      return new RealEstatesController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().update(ctx);
    });

    // DELETE
    Route.delete("/delete", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().delete(ctx);
    });
  }).prefix("/real-estates");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
