import {AlphaAuthEnvelopFactory} from "./alpha-auth-envelop";

describe('AlphaAuthEnvelop', () => {
  it('should factorFromDso', () => {
    const dso: any = {
      access_token: 'accessToken',
      expires_in: 14400,
      refresh_token: 'refreshToken',
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'en',
        userProperties: {
          firstName: 'firstName',
          lastName: 'lastName'
        }
      }
    };
    const oEnv = AlphaAuthEnvelopFactory
      .factorFromDso(dso);
    expect(oEnv).toBeTruthy();
    expect(oEnv.accessToken).toEqual('accessToken');
    expect(oEnv.expiresIn).toEqual(14400);
    expect(oEnv.refreshToken).toEqual('refreshToken');
    expect(oEnv.user).toBeTruthy();
  });
});
