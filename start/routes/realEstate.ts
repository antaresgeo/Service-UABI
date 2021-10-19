import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/lists", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().getList(ctx);
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
      return new RealEstatesController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().update(ctx);
    });

    Route.put("/alt-status", async (ctx) => {
      const { default: RealEstatesController } = await import(
        "App/Controllers/Http/RealEstatesController"
      );
      return new RealEstatesController().changeStatus(ctx);
    });
  }).prefix("/real-estates");
}).prefix("v1");
