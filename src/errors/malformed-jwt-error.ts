import { ErrorBase } from './error-base';

export class MalformedJwtError extends ErrorBase {
  constructor() {
    super('Malformed JWT.', 'ERR_MALFORMED_JWT');
    this.name = this.constructor.name;
  }
}
