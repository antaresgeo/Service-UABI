import crypto from "crypto";
import bcrypt from "bcrypt";
import moment from "moment";
import { IAuditTrail } from "./../interfaces";

export const newAuditTrail = (token: string = ""): IAuditTrail => {
  if (token === "") {
    let auditTrail: IAuditTrail = {
      created_by: "Administrador",
      created_on: String(new Date().getTime()),
      updated_by: null,
      updated_on: null,
      updated_values: null,
    };
    return auditTrail;
  }
  return {
    created_by: "Administrador",
    created_on: String(new Date().getTime()),
    updated_by: null,
    updated_on: null,
    updated_values: null,
  };
};

// Authentification
export const authenticationUme = () => {
  // cadena

  let hexdec = "10681D4015638022C919FCB3A8A996B75997C66B"

    .toString()

    .toUpperCase();

  let dateNow = moment(new Date(), "YYYY-MM-DD'T'HH:mm:ssZ")
    // .add(-5, "hours")

    .toString();

  // contraseña

  // let password = ConfigEnv.UME_PASSWORD;
  let password = "6tC8dvgfr@C";

  let passwordbas = base64encode(password).toString();

  //usuario

  // let user = ConfigEnv.UME_USER;
  let user = "USR_UABI_UME";

  let userBase64 = base64encode(user).toString();

  // llave

  let key = `${hexdec}${dateNow}${passwordbas}`;

  let encryption = sha256(key).toUpperCase();

  let keybas = base64encode(encryption).toString();

  const Authorization = {
    fecha: dateNow,
    usuario: userBase64,
    llave: keybas,
    cadena: hexdec,
  };

  return Authorization;
};

export const base64encode = async (string: string) => {
  // create a buffer
  const buff = Buffer.from(string, "utf-8");

  // decode buffer as Base64
  return buff.toString("base64");
};

function sha256(str: string) {
  // secret or salt to be hashed with
  const secret = "4xc3lS0fTw4r3.*";

  // create a sha-256 hasher
  const sha256Hasher = crypto.createHmac("sha256", secret);

  // hash the string
  // and set the output format
  return sha256Hasher.update(str).digest("hex");
}

export const bcryptEncode = async (passwordNaked: string): Promise<string> => {
  const saltRounds = 10;
  try {
    console.log("line 96 works");
    const hash = await bcrypt.hash(passwordNaked, saltRounds);

    // Store hash in your password DB.
    console.log(hash);
    return hash;
  } catch (error) {
    console.log(error);

    return Promise.reject("Error hashing the password");
  }
};

export const bcryptCompare = async (password, hash) => {
  try {
    const flag = bcrypt.compare(password, hash);
    console.log(flag);

    return flag;
  } catch (error) {
    console.error(error);
    return false;
  }
};
