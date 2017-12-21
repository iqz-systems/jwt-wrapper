import { VerifyOptions, SignOptions } from 'jsonwebtoken';

export abstract class JwtBase {
  protected abstract jwtSecret: string | Buffer;
  protected abstract jwtOptions: SignOptions | VerifyOptions;

  constructor() {
    this.jwtOptions = {};
    this.jwtOptions.issuer = '';
    this.jwtOptions.subject = '';
  }

  protected set Issuer(issuer: string) {
    this.jwtOptions.issuer = issuer;
  }

  protected set Subject(subject: string) {
    this.jwtOptions.subject = subject;
  }
}
