import fs from "fs";
import moment from "moment";
import { writeFile, utils, WorkBook } from "xlsx";

export const createXLSXFromInventoryRegister = async (
  ctx,
  author: string
  //   data: any[]
) => {
  let ws: WorkBook = utils.book_new();
  ws.Props = {
    Title: "Registro de Inventario",
    Subject: "Registro de Inventario",
    Author: author,
    CreatedDate: moment().toDate(),
  };

  ws.SheetNames.push("Bienes Inmuebles");
  ws.SheetNames.push("Adquisiciones");

  const { default: RealEstatesController } = await import(
    "App/Controllers/Http/RealEstatesController"
  );

  // if (!ctx.request.qs().q) return new RealEstatesController().getList(ctx);
  const data = await new RealEstatesController(ctx.request.ip()).list(
    ctx,
    true
  );
  console.log(data);

  let nb_data = [
    [
      "PROYECTO",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "BIEN INMUEBLE",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "DIRECCIÓN",
    ],
    [
      "Nombre",
      "Descripción",
      "Dependencia",
      "Subdependencia",
      "Centro Gestor",
      "Centro de Costos",
      "Valor Presupuestal",
      "",
      "Número de Matricula",
      "Nombre",
      "Descripción",
      "Dependencia",
      "Subdependencia",
      "Centro Gestor",
      "Centro de Costos",
      "Valor Presupuestal",
      "Código Activo (SAP ID)",
      "Tipología",
      "Cuenta Contable",
      "Tipo de Destinación",
      "Valor Patrimonial",
      "Valor de Reconstrucción",
      "Área Total",
      "Porcentaje Total",
      "Materiales",
      "Área Lote",
      "Área Construcción",
      "Zona",
      "Dirección",
      "Tipo de Activo",
      "Sociedad",
      "Importe Contabilidad",
      "Periodo Contable",
      "Contrapartida",
      "Asignaciones",
      "Valor Aprovechamiento",
      "Valor de Autorización",
      "Valor del Canon",
      "Tipo Disposición",
      "",
      "Pais",
      "Departamento",
      "Ciudad",
      "Comuna",
      "Barrio",
      "Manzana",
      "Lote",
      "Estrato Social",
      "Tipo",
      "Primer Número",
      "Primer Apéndice",
      "Primera Orientación",
      "Segundo Número",
      "Segundo Apéndice",
      "Segunda Orientación",
      "Identificador",
      "Indicaciones",
      "Caso Especial",
    ],
  ];

  data?.map((re) => {
    nb_data.push([
      re.id,
      re.project.name,
      re.name,
      re.description,
      re.dependency,
      re.subdependency,
      re.management_center,
      re.cost_center,
      re.budget_value,
      re.sap_id,
      re.tipology,
      re.accounting_account,
      re.destination_type,
      re.registry_number,
      re.patrimonial_value,
      re.reconstruction_value,
      re.total_area,
      re.total_percentage,
      re.materials.join(", "),
      re.plot_area,
      re.construction_area,
      re.zone,
      re.address.address,
      re.active_type,
      "FIMM",
      re.accounting_amount === null ? "" : re.accounting_amount,
      String(moment(re.audit_trail.created_on).month())
        .replace("1", "Enero")
        .replace("2", "Febrero")
        .replace("3", "Marzo")
        .replace("4", "Abril")
        .replace("5", "Mayo")
        .replace("6", "Junio")
        .replace("7", "Julio")
        .replace("8", "Agosto")
        .replace("9", "Septiembre")
        .replace("10", "Octubre")
        .replace("11", "Noviembre")
        .replace("12", "Diciembre"),
      re.counterpart === null ? "" : re.counterpart,
      re.assignments === null ? "" : re.assignments,
      re.exploitation_value === null ? "" : re.exploitation_value,
      re.authorization_value === null ? "" : re.authorization_value,
      re.canyon_value === null ? "" : re.canyon_value,
      re.disposition_type === null ? "" : re.disposition_type,
      re.status,
    ]);
  });

  let nb = utils.aoa_to_sheet(nb_data);
  ws.Sheets["Bienes Inmuebles"] = nb;

  // Save file
  writeFile(ws, "Registro de Inventario.xlsx", {
    bookType: "xlsx",
    type: "binary",
  });
  // Move file to temp folder
  fs.rename(
    "Registro de Inventario.xlsx",
    "tmp/Registro de Inventario.xlsx",
    (err) => {
      if (err) throw err;
    }
  );
};
