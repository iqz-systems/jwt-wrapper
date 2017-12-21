export interface IJwtSignParams {
  /**
   * The path to the certificate private key.
   * @type {string}
   */
  privateKeyFile: string,
  /**
   * The expiry time of the JWT in seconds.
   * @type {number}
   */
  expiryTimeSeconds: number
}

export interface IJwtVerifyParams {
  /**
   * The path to the certificate public key.
   * @type {string}
   */
  publicKeyFile: string
}

export interface IJwtParams {
  /**
   * Properties to configure JWT Signing options. You can skip this if you are
   * using the library to only verify.
   * @type {IJwtSignParams}
   */
  sign?: IJwtSignParams,
  /**
   * Properties to configure JWT Verifying options. You can skip this if you
   * are using the library to only sign tokens.
   * @type {IJwtVerifyParams}
   */
  verify?: IJwtVerifyParams,
  /**
   * The issuer name for the token.
   * @type {string}
   */
  issuer: string,
  /**
   * The subject name for the token.
   * @type {string}
   */
  subject: string
}
