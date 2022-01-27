import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/list/contracts", async (ctx) => {
      const { default: ProjectContractsController } = await import(
        "App/Controllers/Http/ProjectContractsController"
      );

      return new ProjectContractsController().showByProject(ctx);
    });

    Route.get("/list", async (ctx) => {
      const { default: ProjectsController } = await import(
        "App/Controllers/Http/ProjectsController"
      );

      return new ProjectsController().list(ctx);
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
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
