/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import "reflect-metadata";
import sourceMapSupport from "source-map-support";
import { Ignitor } from "@adonisjs/core/build/standalone";

declare global {
  interface Array<T> {
    diff(arr: T[]): { oldItems: T[] };
  }

  interface String {
    capitalize(): String;
  }
}

if (!Array.prototype.diff)
  Array.prototype.diff = function (a) {
    let oldItems = this.filter(function (i) {
      return a.indexOf(i) < 0;
    });
    // this.
    return { oldItems };
  };

if (!String.prototype.capitalize) {
  String.prototype.capitalize = function () {
    return this.trim()
      .toLowerCase()
      .replace(
        /\w\S*/g,
        (w) =>
          (w && w.replace(/^\w/, (c) => (c && c.toUpperCase()) || "")) || ""
      );
  };
}

sourceMapSupport.install({ handleUncaughtExceptions: false });

new Ignitor(__dirname).httpServer().start();
