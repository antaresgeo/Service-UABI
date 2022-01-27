import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";
import { IDataToken } from "../interfaces";
import { messageError } from ".";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export const decodeJWT = (token: string, { response }: HttpContextContract) => {
  try {
    let payload = jwt.verify(token, Env.get("APP_KEY_AUTH") || "secret");
    return payload;
  } catch (error) {
    return messageError(error, response, "Token expirado.", 401);
    console.error(error);
  }
};

export const getToken = (
  headers,
  { response }: HttpContextContract
): { token: string; headerAuthorization: string; payloadToken: IDataToken } => {
  let token: string = "";
  let headerAuthorization = headers.authorization ? headers.authorization : "";

  if (headerAuthorization !== "") {
    token = headerAuthorization.replace("Bearer ", "").trim();
  }

  const payloadToken: IDataToken = decodeJWT(token, {
    response,
  } as HttpContextContract);

  return { token, headerAuthorization, payloadToken };
};
