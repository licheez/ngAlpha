export class AlphaSessionData {

  private static readonly rememberMeFieldName = 'alphaRememberMe';
  private static readonly accessTokenFieldName = 'alphaAccessToken';
  private static readonly receptionTsFieldName = 'alphaReceptionTs';
  private static readonly expirationTsFieldName = 'alphaExpirationTs';

  rememberMe: boolean;
  accessToken: string;
  /** timestamp of token reception in ms */
  receptionTs: number;
  /** timestamp of token expiration in ms */
  expirationTs: number;

  get isExpiredOrExpiring(): boolean {
    const nowTs = new Date().getTime();
    return this.expirationTs - nowTs < 60000;
  }

  constructor(
    rememberMe: boolean,
    accessToken: string,
    receptionTs: number, // timestamp of token reception in ms
    expirationTs: number) {
    this.rememberMe = rememberMe;
    this.accessToken = accessToken;
    this.receptionTs = receptionTs;
    this.expirationTs = expirationTs;
  }

  // expiresIn is expressed in seconds
  static getTimestamps(expiresIn: number): {
    receptionTs: number,
    expirationTs: number
  } {
    const receptionTs = new Date().getTime();
    const expirationTs = receptionTs + expiresIn * 1000;
    return {
      receptionTs,
      expirationTs
    };
  }

  static retrieve(mStorage: Storage = sessionStorage): AlphaSessionData | null {
    const rmString = mStorage
      .getItem(AlphaSessionData.rememberMeFieldName);
    if (rmString == null) return null;

    const rm = rmString === 'true';

    const at = mStorage
      .getItem(AlphaSessionData.accessTokenFieldName) ?? '';

    const rTsString = mStorage
      .getItem(AlphaSessionData.receptionTsFieldName) ?? '0';
    const rTs = parseInt(rTsString, 10);

    const xTsString = mStorage
      .getItem(AlphaSessionData.expirationTsFieldName) ?? '0';
    const xTs = parseInt(xTsString, 10);

    return new AlphaSessionData(rm, at, rTs, xTs);
  }

  static clear(mStorage: Storage = sessionStorage): void {
    mStorage.removeItem(AlphaSessionData.rememberMeFieldName);
    mStorage.removeItem(AlphaSessionData.accessTokenFieldName);
    mStorage.removeItem(AlphaSessionData.receptionTsFieldName);
    mStorage.removeItem(AlphaSessionData.expirationTsFieldName);
  }

  store(mStorage: Storage = sessionStorage): void {
    mStorage.setItem(
      AlphaSessionData.rememberMeFieldName, this.rememberMe.toString());
    mStorage.setItem(
      AlphaSessionData.accessTokenFieldName, this.accessToken);
    mStorage.setItem(
      AlphaSessionData.receptionTsFieldName, this.receptionTs.toString());
    mStorage.setItem(
      AlphaSessionData.expirationTsFieldName, this.expirationTs.toString());
  }

}
