import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { decodeJWT } from "App/Utils/functions/jwt";
import axios from "axios";
import Env from "@ioc:Adonis/Core/Env";

export default class VerifyToken {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    let payload;
    const token = request.headers()["authorization"]?.replace("Bearer ", "");

    console.log(token);
    if (token) payload = decodeJWT(token);
    console.log(payload);

    if (payload === undefined)
      return response.unauthorized({
        error: "Debe de ingresar para realizar esta acción",
      });

    // Consulting
    try {
      // User.findOrFail(payload.id);
      await axios.get(
        `${Env.get("URI_SERVICE_AUTH")}${Env.get("API_AUTH_VERSION")}/users`,
        {
          params: { id: payload.id },
        }
      );
    } catch (error) {
      console.error(error);
      return response.unauthorized({
        error: "Debe de ingresar para realizar esta acción",
      });
    }

    await next();
  }
}
