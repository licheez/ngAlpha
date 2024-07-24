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

  static retrieve(): AlphaSessionData | null {
    const rmString = sessionStorage
      .getItem(AlphaSessionData.rememberMeFieldName);
    if (rmString == null) return null;

    const rm = rmString === 'true';

    const at = sessionStorage
      .getItem(AlphaSessionData.accessTokenFieldName) ?? '';

    const rTsString = sessionStorage
      .getItem(AlphaSessionData.receptionTsFieldName) ?? '0';
    const rTs = parseInt(rTsString, 10);

    const xTsString = sessionStorage
      .getItem(AlphaSessionData.expirationTsFieldName) ?? '0';
    const xTs = parseInt(xTsString, 10);

    return new AlphaSessionData(rm, at, rTs, xTs);
  }

  static clear(): void {
    sessionStorage.removeItem(AlphaSessionData.rememberMeFieldName);
    sessionStorage.removeItem(AlphaSessionData.accessTokenFieldName);
    sessionStorage.removeItem(AlphaSessionData.receptionTsFieldName);
    sessionStorage.removeItem(AlphaSessionData.expirationTsFieldName);
  }

  store(): void {
    sessionStorage.setItem(
      AlphaSessionData.rememberMeFieldName, this.rememberMe.toString());
    sessionStorage.setItem(
      AlphaSessionData.accessTokenFieldName, this.accessToken);
    sessionStorage.setItem(
      AlphaSessionData.receptionTsFieldName, this.receptionTs.toString());
    sessionStorage.setItem(
      AlphaSessionData.expirationTsFieldName, this.expirationTs.toString());
  }

}
