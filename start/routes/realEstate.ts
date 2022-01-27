import Route from "@ioc:Adonis/Core/Route";

import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.get("/historic", async (ctx) => {
    const { default: RealEstatesController } = await import(
      "App/Controllers/Http/RealEstatesController"
    );
    return new RealEstatesController(ctx.request.ip()).historic(ctx);
  });
  Route.group(() => {
    // GET
    Route.get("/index", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController(ctx.request.ip()).index(ctx);
    });
    Route.get("/list", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );

      // if (!ctx.request.qs().q) return new RealEstatesController(ctx.request.ip()).getList(ctx);
      return new RealEstatesController(ctx.request.ip()).list(ctx);

      // return new RealEstatesController(ctx.request.ip()).filter(ctx);
    });

    Route.get("/project", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController(ctx.request.ip()).getByProject(ctx);
    });

    Route.get("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController(ctx.request.ip()).getOne(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );

      if (ctx.request.qs().action === "many")
        return new RealEstatesController(ctx.request.ip()).createMany(ctx);

      return new RealEstatesController(ctx.request.ip()).create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController(ctx.request.ip()).update(ctx);
    });

    // DELETE
    Route.delete("/delete", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController(ctx.request.ip()).delete(ctx);
    });
  })
    .prefix("/real-estates")
    .middleware(["verifyToken"]);
})
  .prefix(apiVersion)
  .middleware(["logRegistered"]);
