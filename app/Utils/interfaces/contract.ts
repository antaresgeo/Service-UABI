import { IAuditTrail } from "App/Utils/interfaces";

export interface ISecretary {
  name: string;
  id_number: number;
}

export interface IContract {
  id?: number;

  act_number: number;
  contract_decree: string;
  decree_date: string;
  decree_number: number;
  dispose_area: number;
  finish_date: string;
  guarantee: string;
  manager_sabi: string;
  minutes_date: string;
  object_contract: string;
  secretary: ISecretary;
  subscription_date: string;
  type_contract: string;

  status?: number;
  audit_trail?: IAuditTrail;
}
