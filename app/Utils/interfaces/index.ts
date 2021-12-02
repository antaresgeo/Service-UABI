export interface IResponseData {
  message: string;
  results?: any;
  status: number;
  error?: any;
  page?: number;
  count?: number;
  next_page?: number;
  previous_page?: number;
  total_results?: number;
}

export interface IDataToken {
  id: number;
  iat: number;
}

export interface IUpdatedValues {
  oldest?: IUpdatedValues | object;
  lastest?: IUpdatedValues | object;
  new: IUpdatedValues | object;
}

export interface IAuditTrail {
  created_by?: string;
  created_on?: number;
  updated_by: string | null;
  updated_on: number | null;
  updated_values: IUpdatedValues | null;
}

export interface ISupportsDocuments {
  id: string;
  name: string;
  path: string;
}

export interface IDataUser {
  id: number;
  name: string;
}

export interface IResponseData {
  message: string;
  results?: any;
  error?: any;
  total?: number;
}

export * from "./project.interfaces";
export * from "./realEstate.interfaces";
export * from "./adquisitions.interfaces";
export * from "./detailsUser";
export * from "./inspection";
