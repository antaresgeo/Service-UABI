import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";

export default class LogRequest {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (Env.get("NODE_ENV") === "development")
      console.log(`-> ${request.method()}: ${request.url()} (${request.ip()})`);
    await next();
  }
}
