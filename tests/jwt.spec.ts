import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as del from 'del';
import * as childProcess from 'child_process';

import { JwtSign, JwtVerify, IJwtParams } from '../src';

const folderRoot = path.join(__dirname, '..');
const keyFolder = path.join(folderRoot, 'res');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('JwtSign', () => {
  it('should throw an error when getToken() is called before calling init()', async () => {
    let err;
    try {
      let result = await JwtSign.Instance.getToken({ test: 'aa' }, 'test');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.not.be.undefined;
    }
  });

  it('should create and return a token when getToken() is called after init()', async () => {
    let err;
    try {
      let result = await initAndGetToken();
      expect(result).to.be.a('string');
    } catch (error) {
      console.error(error);
    }
  });
});

describe('JwtVerify', () => {
  it('should verify a token successfully', async () => {
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ Systems',
        subject: 'Test Subject'
      });
      let token = await initAndGetToken();
      let result = await JwtVerify.Instance.verifyToken(token, 'testAud');
      expect(result).to.be.an('object');
    } catch (error) {
      console.error(error);
    }
  });

  it('should return the payload successfully on successful verification', async () => {
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ Systems',
        subject: 'Test Subject'
      });
      let token = await initAndGetToken();
      let result = await JwtVerify.Instance.verifyToken(token, 'testAud');
      expect(result['payload']).to.be.equal('Some string');
    } catch (error) {
      console.error(error);
    }
  });

  it('should throw an error when getToken() is called before calling init()', async () => {
    let err;
    try {
      let result = await JwtVerify.Instance.verifyToken('test', 'testAud');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.not.be.undefined;
    }
  });

  it('should throw an error on invalid token', async () => {
    let err;
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ Systems',
        subject: 'Test Subject'
      });
      let token = await initAndGetToken();
      let result = await JwtVerify.Instance.verifyToken(token + 'garbage', 'testAud');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.have.property('name', 'JsonWebTokenError');
    }
  });

  it('should throw an error on expired tokens', async () => {
    let err;
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ Systems',
        subject: 'Test Subject'
      });
      let token = await initAndGetToken(1);
      await snooze(1000);
      let result = await JwtVerify.Instance.verifyToken(token, 'testAud');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.have.property('name', 'TokenExpiredError');
    }
  });

  it('should throw an error on mismatched audience', async () => {
    let err;
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ Systems',
        subject: 'Test Subject'
      });
      let token = await initAndGetToken(1);
      let result = await JwtVerify.Instance.verifyToken(token, 'testAud1');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.have.property('name', 'JsonWebTokenError');
    }
  });

  it('should throw an error on mismatched issuer', async () => {
    let err;
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ',
        subject: 'Test Subject'
      });
      let token = await initAndGetToken(1);
      let result = await JwtVerify.Instance.verifyToken(token, 'testAud');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.have.property('name', 'JsonWebTokenError');
    }
  });

  it('should throw an error on mismatched subject', async () => {
    let err;
    try {
      JwtVerify.Instance.init({
        verify: {
          publicKeyFile: path.join(keyFolder, 'jwtRS256.key.pub')
        },
        issuer: 'IQZ Systems',
        subject: 'Test Subject1'
      });
      let token = await initAndGetToken(1);
      let result = await JwtVerify.Instance.verifyToken(token, 'testAud');
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.have.property('name', 'JsonWebTokenError');
    }
  });
});

async function initAndGetToken(expiryTime?: number): Promise<string> {
  JwtSign.Instance.init({
    sign: {
      privateKeyFile: path.join(folderRoot, 'res', 'jwtRS256.key'),
      expiryTimeSeconds: (!expiryTime) ? 60 : expiryTime
    },
    issuer: 'IQZ Systems',
    subject: 'Test Subject'
  });
  return await JwtSign.Instance.getToken({ payload: 'Some string' }, 'testAud');
}
