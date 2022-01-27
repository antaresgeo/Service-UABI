import moment from "moment";
import { Manager } from "../enums";

export class Logger {
  private date: string;
  private ipv4: string;
  private manager: Manager;

  private _log: string;

  constructor(ip: string, manager: Manager) {
    this.date = "";
    this.ipv4 = ip;
    this.manager = manager;
    this._log = "";
  }

  // PUBLIC METHODS
  /**
   * register
   */
  public register(line: number, method?: string, path?: string): string | void {
    this.date = moment().format("MMMM Do YYYY, h:mm:ss a");
    this._log += `${this.date} |  ${this.ipv4} | ${this.manager} | Line ${line}`;

    if (method && path) {
      this._log += ` | ${method} | ${path}\n`;
      return `[ ${moment().format("MMMM Do YYYY, h:mm:ss a")} | ${
        this.ipv4
      } ]\t-> ${method}:\t${path}`;
    }
    this._log += "\n";
  }

  /**
   * log
   */
  public log(text: any, line?: number | string) {
    console.log(
      `\n[ ${moment().format("MMMM Do YYYY, h:mm:ss a")} | ${this.manager}${
        line ? `:${line}` : ""
      } ]  =>  ${
        typeof text === "object" ? JSON.stringify(text) : String(text)
      }`
    );
  }

  /**
   * getLog
   */
  public getLog(): string {
    return this._log;
  }

  // PRIVATE METHODS
}
