export interface IUpdatedValues {
  oldest?: IUpdatedValues | object;
  lastest?: IUpdatedValues | object;
  new: IUpdatedValues | object;
}

export interface IAuditTrail {
  created_by?: string;
  created_on?: string;
  updated_by: string | null;
  updated_on: string | null;
  updated_values: IUpdatedValues | null;
}

export interface ISupportsDocuments {
  id: string;
  name: string;
  path: string;
}

export * from "./project.interfaces";
export * from "./realEstate.interfaces";
export * from "./adquisitions.interfaces";
