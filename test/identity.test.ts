import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { difference, readIdentity, serverOrigin, tokenSubject } from '../src/identity.ts';

const jwt = (claims: unknown): string => `${Buffer.from('{"alg":"none"}').toString('base64url')}.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;

describe('tokenSubject', () => {
  it('reads the user id an access token names', () => {
    assert.equal(tokenSubject(jwt({ sub: 'user-42', email: 'me@example.com' })), 'user-42');
    assert.equal(tokenSubject(jwt({ sub: 42 })), '42');
  });

  it('gives nothing for a token without one, or for something that is no JWT', () => {
    assert.equal(tokenSubject(jwt({ email: 'me@example.com' })), null);
    assert.equal(tokenSubject(jwt({ sub: ' ' })), null);
    assert.equal(tokenSubject('opaque-token'), null);
    assert.equal(tokenSubject('a.b.c'), null);
  });
});

describe('identity of a state', () => {
  const mine = { enduo: 'https://api.enduo.app', enduoAccount: 'account-a', smartworkoutAccount: 'user-1' };

  it('takes the origin of the server from its address', () => {
    assert.equal(serverOrigin('https://API.enduo.app/mcp'), 'https://api.enduo.app');
    assert.equal(serverOrigin('https://api.enduo.ddev.site:8443/mcp'), 'https://api.enduo.ddev.site:8443');
  });

  it('says what makes a state another one\'s', () => {
    assert.equal(difference(mine, { ...mine }), null);
    assert.equal(difference(mine, { ...mine, enduo: 'https://api.enduo.ddev.site' }), 'Enduo server');
    assert.equal(difference(mine, { ...mine, enduoAccount: 'account-b' }), 'Enduo account');
    assert.equal(difference(mine, { ...mine, smartworkoutAccount: 'user-2' }), 'SmartWorkout account');
  });

  it('reads only a complete identity', () => {
    assert.deepEqual(readIdentity({ ...mine, extra: 1 }), mine);
    assert.equal(readIdentity({ enduo: mine.enduo }), null);
    assert.equal(readIdentity('account-a'), null);
  });
});
