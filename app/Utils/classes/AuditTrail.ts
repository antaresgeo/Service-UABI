export default class AuditTrail {
  protected createdBy: string;
  protected createdOn: string;
  private token: string | null;

  constructor(token?: string) {
    this.token = token ? token : null;

    this.createdBy = "";
    this.createdOn = "";
  }

  /**
   * registry
   */
  public registry() {}

  // export const newAuditTrail = (token: string = ""): IAuditTrail => {
  //     if (token === "") {
  //       let auditTrail: IAuditTrail = {
  //         created_by: "Administrador",
  //         created_on: String(new Date().getTime()),
  //         updated_by: null,
  //         updated_on: null,
  //         updated_values: null,
  //       };
  //       return auditTrail;
  //     }
  //     return {
  //       created_by: "Administrador",
  //       created_on: String(new Date().getTime()),
  //       updated_by: null,
  //       updated_on: null,
  //       updated_values: null,
  //     };
  //   };
}
