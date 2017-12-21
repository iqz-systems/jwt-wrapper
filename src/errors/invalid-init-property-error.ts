import { ErrorBase } from "./error-base";
import { IJwtParams } from "../jwt-params.interface";

export class InvalidInitPropertyError extends ErrorBase {
  constructor(param: IJwtParams) {
    super('One or more required properties is missing in the init() parameter.', 'ERR_MISSING_PROPERTY_FOR_INIT');
    this.name = this.constructor.name;
    this.extra = param;
  }
}
