import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { IResponseData } from "App/Utils/interfaces";

export default class DispositionsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {

    // const uso_publico = {
    //   // info general
    //   boundaries: 'Descripción de linderos',
    //   destination_realEstate: 'Destinación de bien Inmueble',
    //   environmental_risk: 'riesgos ambientales',
    //   contract_period: 2,
    //   business_type: 'tipo de negocio',
    //   lockable_base: 10,
    //   prediation_date: '2022-01-04',
    //   registration_date: '2022-01-30',
    //
    //   leader: {
    //     type_society: 'Persona Natural',
    //     post: 'cargo lider',
    //     dependence: 'GERENCIA DE CORREGIMIENTOS',
    //     secretary: 'GERENCIA DE CORREGIMIENTOS',
    //   },
    //   detailsLeader: 5,
    //   location_leader: 5,
    //   applicant: {
    //     type_society: 'Persona Juridica',
    //     id_type: 4,
    //     id_number: 5465465,
    //     company_name: 'Nombre de la empresa',
    //     email: 'empresa@correo.com',
    //     phone_number: 65465465,
    //   },
    //   location_applicant: 5,
    //   representative: { type_society: 'Persona Natural' },
    //   detailsRepresentative: {
    //     id: 10,
    //     document_type: 'CC',
    //     document_number: 1007788713,
    //     first_name: 'karen',
    //     last_name: 'Daiana',
    //   },
    //   approved: { name: 'nombre aprobo', post: 'cargo aprobo', email: 'nombre aprobo' },
    //   elaborated: { name: 'nombre elaboro', post: 'cargo elaboro', email: 'correo elaboro' },
    //   revised: { name: 'nombre reviso', post: 'cargo reviso ', email: 'correo reviso' },
    //   operational_risk: {
    //     degree_occurrence: 'MEDIO',
    //     impact_degree: 'MEDIO',
    //     responsable: 'Contratista',
    //     mitigation_mechanism:
    //       'Realizar visitas trimestrales al bien inmueble obj…y evaluación al desarrollo del objeto contractual',
    //   },
    //   regulatory_risk: {
    //     degree_occurrence: 'MEDIO',
    //     impact_degree: 'MEDIO',
    //     responsable: 'Contratista',
    //     mitigation_mechanism: 'Ejercer un control y vigilancia estrictos al contrato por parte del supervisor.',
    //   },
    //   // ------------------------
    //
    //   cadastral_value: 254000,
    //
    //   contract_value: 1450000,
    //
    //   obligations: [{ id: 18, obligation: 'obligacion 1' }],
    //   prohibitions: [{ id: 12, prohibition: 'prohibición 1' }],
    //   prediation_number: 1234569,
    // };

  }

  public async store({}: HttpContextContract) {}

  public async list({ request, response }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de BI por Activo Fijo",
      status: 200,
    };

    const {} = request.qs();

    return response.status(responseData["status"]).json(responseData);
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
