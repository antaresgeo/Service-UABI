import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: InsurabilitiesController } = await import(
        "App/Controllers/Http/InsurabilitiesController"
      );

      if (ctx.request.qs().real_estate_id)
        return new InsurabilitiesController().getByRealEstate(ctx);

      if (ctx.request.qs().id)
        return new InsurabilitiesController().getOne(ctx);

      if (ctx.request.qs().like)
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
  .prefix("v1")
  .middleware(["logRegistered", "verifyToken"]);
