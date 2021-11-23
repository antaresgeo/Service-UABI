import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";

export const decodeJWT = (token: string) => {
  try {
    let payload = jwt.verify(token, Env.get("APP_KEY_AUTH") || "secret");
    return payload;
  } catch (error) {
    console.error(error);
  }
};

export const getToken = (headers): string => {
  let tmpToken: string = "";

  if (headers.authorization) {
    let tmp = headers.authorization?.split("Bearer ").pop()?.trim();
    if (typeof tmp !== "undefined") tmpToken = tmp;
  }

  return tmpToken;
};
