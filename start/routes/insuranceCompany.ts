import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: InsuranceCompaniesController } = await import(
        "App/Controllers/Http/InsuranceCompaniesController"
      );

      return new InsuranceCompaniesController().showAll(ctx);
    });

    Route.get("/list", async (ctx) => {
      const { default: InsuranceCompaniesController } = await import(
        "App/Controllers/Http/InsuranceCompaniesController"
      );

      return new InsuranceCompaniesController().list(ctx);
    });

    Route.get("/:id", async (ctx) => {
      const { default: InsuranceCompaniesController } = await import(
        "App/Controllers/Http/InsuranceCompaniesController"
      );

      if (ctx.request.params().id)
        return new InsuranceCompaniesController().show(
          ctx,
          parseInt(ctx.request.params().id)
        );
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: InsuranceCompaniesController } = await import(
        "App/Controllers/Http/InsuranceCompaniesController"
      );
      return new InsuranceCompaniesController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: InsuranceCompaniesController } = await import(
        "App/Controllers/Http/InsuranceCompaniesController"
      );
      return new InsuranceCompaniesController().update(ctx);
    });

    Route.patch("/:id", async (ctx) => {
      const { default: InsuranceCompaniesController } = await import(
        "App/Controllers/Http/InsuranceCompaniesController"
      );
      return new InsuranceCompaniesController().inactivate(ctx);
    });
  }).prefix("/insurance-companies");
}).prefix("v1");
