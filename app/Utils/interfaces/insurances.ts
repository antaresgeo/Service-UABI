import { IAuditTrail } from ".";

interface IContactInformation {
  name: string;
  email: string;
  phone: string;
}

interface IPayloadInsuranceBroker {
  name: string;
  nit: number;
  location_id: string;
  phone: string;
  contact_information?: IContactInformation;
}

interface IPayloadInsuranceCompany {
  name: string;
  nit: number;
  location_id: string;
  phone: string;
}

interface IInsuranceBroker {
  id?: number;

  name: string;
  nit: number;
  location_id: string;
  phone: string;

  contact_information?: IContactInformation;

  status?: number;
  audit_trail?: IAuditTrail;
}

interface IInsuranceCompany {
  id?: number;

  name: string;
  nit: number;
  location_id: string;
  phone: string;

  status?: number;
  audit_trail?: IAuditTrail;
}

export {
  IContactInformation,
  IPayloadInsuranceBroker,
  IInsuranceBroker,
  IPayloadInsuranceCompany,
  IInsuranceCompany,
};
