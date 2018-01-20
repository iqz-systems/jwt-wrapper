import { VerifyOptions, verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

import { JwtBase } from './jwt-base';
import { InvalidInitPropertyError } from "./errors";
import { IJwtParams } from "./jwt-params.interface";
import { MalformedJwtError } from "./errors";

export class JwtVerify extends JwtBase {

  protected jwtOptions: VerifyOptions;
  protected jwtSecret: string | Buffer;

  private static _instance: JwtVerify;

  private constructor() {
    super();
    this.jwtOptions.algorithms = ['RS256'];
  }

  /**
   * Call this method to initialize the JWT verify utility.
   * @method init
   * @param  {IJwtParams} params An object containing the properties required
   * for configuring the JWT Verify utility.
   */
  public init(params: IJwtParams): void {
    try {
      if (!params.verify) {
        throw new InvalidInitPropertyError(params);
      }

      this.Issuer = params.issuer;
      this.Subject = params.subject;
      this.jwtSecret = fs.readFileSync(params.verify.publicKeyFile);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Returns an instance of JwtVerify.
   * @method Instance
   * @return {JwtVerify} A JwtVerify instance.
   */
  public static get Instance(): JwtVerify {
    return JwtVerify._instance || (JwtVerify._instance = new JwtVerify());
  }

  /**
   * Verifies if a JwtToken is valid or not. Throws an error if invalid.
   * The error can be of types JsonWebTokenError, NotBeforeError or
   * TokenExpiredError.
   * @method verifyToken
   * @param  {string}          token The JwtToken string.
   * @param  {string | string[]} audience A string or list of strings or regular expression denoting the audience.
   * @return {Promise<object>}       A Promise wrapping the decoded token.
   */
  async verifyToken(token: string, audience: string | string[]): Promise<object> {
    if (!this.jwtSecret) {
      throw new Error('JwtSign not initialized. Make sure you are calling init() before calling this method. You only need to do this once in your app.');
    }

    try {
      return await this._verifyToken(token, audience);
    } catch (error) {
      throw error;
    }
  }

  private _verifyToken(token: string, audience: string | string[]): Promise<object> {
    this.jwtOptions.audience = audience;

    return new Promise((resolve, reject) => {
      verify(token, this.jwtSecret, this.jwtOptions, (err: JsonWebTokenError | NotBeforeError | TokenExpiredError, decoded: object | string) => {
        if (err) {
          reject(err);
        } else if (decoded instanceof String) {
          let payload = JSON.parse(decoded)['payload'];
          if (!payload) { reject(new MalformedJwtError()); }
          resolve(payload);
        } else {
          let payload = decoded['payload'];
          if (!payload) { reject(new MalformedJwtError()); }
          resolve(payload);
        }
      });
    });
  }
}
