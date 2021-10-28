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

export interface IDataToken {
  id: number;
}

export interface IDataUser {
  id: number;
  name: string;
}

export * from "./project.interfaces";
export * from "./realEstate.interfaces";
export * from "./adquisitions.interfaces";
