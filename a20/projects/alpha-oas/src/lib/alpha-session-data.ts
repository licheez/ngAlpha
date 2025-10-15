/**
 * Represents the session token data for OAuth authentication.
 *
 * Responsibilities:
 * - Stores, retrieves, and clears session token and metadata in browser storage.
 * - Tracks token reception and expiration timestamps for validity checks.
 * - Provides static methods for managing session token lifecycle.
 * - Used by authentication services to persist and access session tokens securely.
 *
 * Usage:
 * - Call `store()` to persist the session token and metadata in storage.
 * - Use `retrieve()` to get the session token and metadata from storage.
 * - Use `clear()` to remove the session token and metadata from storage on sign-out.
 * - Use `isExpiredOrExpiring` to check if the token is near expiration.
 * - Use `getTimestamps()` to calculate reception and expiration timestamps from expiry duration.
 */
export class AlphaSessionData {
  /**
   * Storage key for the rememberMe flag.
   */
  private static readonly rememberMeFieldName = 'alphaRememberMe';
  /**
   * Storage key for the access token.
   */
  private static readonly accessTokenFieldName = 'alphaAccessToken';
  /**
   * Storage key for the token reception timestamp.
   */
  private static readonly receptionTsFieldName = 'alphaReceptionTs';
  /**
   * Storage key for the token expiration timestamp.
   */
  private static readonly expirationTsFieldName = 'alphaExpirationTs';

  /**
   * Indicates if the user chose "remember me" during authentication.
   */
  rememberMe: boolean;
  /**
   * The access token string.
   */
  accessToken: string;
  /**
   * Timestamp of token reception in milliseconds.
   */
  receptionTs: number;
  /**
   * Timestamp of token expiration in milliseconds.
   */
  expirationTs: number;

  /**
   * Returns true if the token is expired or will expire within 60 seconds.
   */
  get isExpiredOrExpiring(): boolean {
    const nowTs = new Date().getTime();
    return this.expirationTs - nowTs < 60000;
  }

  /**
   * Constructs a new AlphaSessionData instance with the given properties.
   * @param rememberMe - Indicates if "remember me" was selected.
   * @param accessToken - The access token string.
   * @param receptionTs - Timestamp of token reception in ms.
   * @param expirationTs - Timestamp of token expiration in ms.
   */
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

  /**
   * Calculates reception and expiration timestamps from expiry duration in seconds.
   * @param expiresIn - Expiry duration in seconds.
   * @returns Object containing receptionTs and expirationTs in ms.
   */
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

  /**
   * Retrieves the session data from storage and returns an AlphaSessionData instance.
   * @param mStorage - Storage object to use (default: browser sessionStorage).
   * @returns AlphaSessionData instance if data exists, otherwise null.
   */
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

  /**
   * Removes the session data from storage.
   * @param mStorage - Storage object to use (default: browser sessionStorage).
   */
  static clear(mStorage: Storage = sessionStorage): void {
    mStorage.removeItem(AlphaSessionData.rememberMeFieldName);
    mStorage.removeItem(AlphaSessionData.accessTokenFieldName);
    mStorage.removeItem(AlphaSessionData.receptionTsFieldName);
    mStorage.removeItem(AlphaSessionData.expirationTsFieldName);
  }

  /**
   * Stores the session data in storage.
   * @param mStorage - Storage object to use (default: browser sessionStorage).
   */
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
