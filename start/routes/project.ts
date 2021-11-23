import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/lists", async (ctx) => {
      const { default: ProjectsController } = await import(
        "App/Controllers/Http/ProjectsController"
      );

      if (ctx.request.qs().with === "pagination")
        return new ProjectsController().showAllWithPagination(ctx);

      return new ProjectsController().showAll(ctx);
    });

    Route.get("/", async (ctx) => {
      const { default: ProjectsController } = await import(
        "App/Controllers/Http/ProjectsController"
      );
      return new ProjectsController().show(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: ProjectsController } = await import(
        "App/Controllers/Http/ProjectsController"
      );
      return new ProjectsController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: ProjectsController } = await import(
        "App/Controllers/Http/ProjectsController"
      );
      return new ProjectsController().update(ctx);
    });

    // DELETE
    Route.delete("/delete", async (ctx) => {
      const { default: ProjectsController } = await import(
        "App/Controllers/Http/ProjectsController"
      );
      return new ProjectsController().delete(ctx);
    });
  }).prefix("/projects");
})
  .prefix("v1")
  .middleware(["logRegistered", "verifyToken"]);
