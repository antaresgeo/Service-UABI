import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.group(() => {
    // GET
    Route.get("/", async (ctx) => {
      const { default: PersonalInformation } = await import(
        "App/Controllers/Http/PersonalInformationsController"
      );

      return new PersonalInformation().show(ctx);
    });

    // POST
    Route.post("/", async (ctx) => {
      const { default: PersonalInformation } = await import(
        "App/Controllers/Http/PersonalInformationsController"
      );

      return new PersonalInformation().create(ctx);
    });

    // PUT
    Route.put("/", async (ctx) => {
      const { default: PersonalInformation } = await import(
        "App/Controllers/Http/PersonalInformationsController"
      );

      return new PersonalInformation().update(ctx);
    });

    // DELETE
    Route.delete("/", async (ctx) => {
      const { default: PersonalInformation } = await import(
        "App/Controllers/Http/PersonalInformationsController"
      );

      return new PersonalInformation().destroy(ctx);
    });
  }).prefix("/personal-information");
})
  .prefix(apiVersion)
  .middleware(["logRegistered", "verifyToken"]);
