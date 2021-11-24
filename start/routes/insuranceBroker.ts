import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: InsuranceBrokersController } = await import(
        "App/Controllers/Http/InsuranceBrokersController"
      );

      return new InsuranceBrokersController().showAll(ctx);
    });

    Route.get("/:id", async (ctx) => {
      const { default: InsuranceBrokersController } = await import(
        "App/Controllers/Http/InsuranceBrokersController"
      );

      if (ctx.request.params().id)
        return new InsuranceBrokersController().show(
          ctx,
          parseInt(ctx.request.params().id)
        );
    });

    Route.get("/list", async (ctx) => {
      const { default: InsuranceBrokersController } = await import(
        "App/Controllers/Http/InsuranceBrokersController"
      );

      return new InsuranceBrokersController().list(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: InsuranceBrokersController } = await import(
        "App/Controllers/Http/InsuranceBrokersController"
      );
      return new InsuranceBrokersController().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: InsuranceBrokersController } = await import(
        "App/Controllers/Http/InsuranceBrokersController"
      );
      return new InsuranceBrokersController().update(ctx);
    });

    Route.delete("/:id", async (ctx) => {
      const { default: InsuranceBrokersController } = await import(
        "App/Controllers/Http/InsuranceBrokersController"
      );
      return new InsuranceBrokersController().inactivate(ctx);
    });
  }).prefix("/insurance-brokers");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
