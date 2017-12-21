# IQZ JWT Wrapper

A minimal configuration wrapper for [jsonwebtoken][link-jsonwebtoken]. Uses **only RS256** algorithm to sign the token, and hence requires a key pair.

## Installation

```
npm install -S @iqz/jwt-wrapper
```

## Usage

Import the utilities.

```typescript
import { JwtSign, JwtVerify, IJwtParams } from '@iqz/jwt-wrapper';
```

Initalize them as early in your app as possible.

```typescript
// Do the following where you'd like to sign your tokens.
JwtSign.Instance.init({
    sign: {
        privateKeyFile: 'path/to/private/key'
        expiryTimeSeconds: 60 * 60
    },
    issuer: 'Your domain',
    subject: 'Test Subject'
});

// Do the following where you'd like to verify your tokens.
JwtVerify.Instance.init({
    verify: {
        publicKeyFile: 'path/to/public/key.pub'
    },
    issuer: 'Your domain',
    subject: 'Test Subject'
});
```

Sign your tokens...

```typescript
let token = await JwtSign.Instance.getToken({ payload: 'Some string' }, 'testAud');
```

... and verify them!

```typescript
let payload = await JwtVerify.Instance.verifyToken(token, 'testAud'); // Returns { payload: 'Some string' } on successful verification.
```

[link-jsonwebtoken]: https://github.com/auth0/node-jsonwebtoken
