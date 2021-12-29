export interface IResponseData {
  message: string;
  results?: any;
  status: number;
  error?: any;
  page?: number;
  count?: number;
  next_page?: number | null;
  previous_page?: number | null;
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

export interface ISupportsDocuments {
  id: string;
  name: string;
  path: string;
}

export interface IDataUser {
  id: number;
  name: string;
}

export interface IPaginationValidated {
  search?: { key: string; value: string };
  page: number;
  pageSize: number;
  whereRaw?: string;
}

export * from "./project.interfaces";
export * from "./realEstate.interfaces";
export * from "./acquisitions";
export * from "./detailsUser";
export * from "./inspection";
export * from "./auditTrail";
