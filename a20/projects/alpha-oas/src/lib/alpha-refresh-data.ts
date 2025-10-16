/**
 * Represents the refresh token data for OAuth authentication.
 *
 * Responsibilities:
 * - Stores, retrieves, and clears the refresh token in browser storage.
 * - Provides static methods for managing refresh token lifecycle.
 * - Used by authentication services to persist and access refresh tokens securely.
 *
 * Usage:
 * - Call `store()` to persist the refresh token in storage.
 * - Use `retrieve()` to get the refresh token from storage.
 * - Use `clear()` to remove the refresh token from storage on sign-out.
 */
export class AlphaRefreshData {
  /**
   * The key used to store the refresh token in browser storage.
   */
  private static readonly refreshTokenFieldName = 'alphaRefreshToken';

  /**
   * The refresh token string.
   */
  refreshToken: string;

  /**
   * Constructs a new AlphaRefreshData instance with the given refresh token.
   * @param refreshToken - The refresh token string.
   */
  constructor(
    refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  /**
   * Retrieves the refresh token from storage and returns an AlphaRefreshData instance.
   * @param mStorage - Storage object to use (default: browser localStorage).
   * @returns AlphaRefreshData instance if token exists, otherwise null.
   */
  static retrieve(mStorage: Storage = localStorage): AlphaRefreshData | null {
    const rt = mStorage
      .getItem(AlphaRefreshData.refreshTokenFieldName);
    if (rt == null) {
      return null;
    }
    return new AlphaRefreshData(rt);
  }

  /**
   * Removes the refresh token from storage.
   * @param mStorage - Storage object to use (default: browser localStorage).
   */
  static clear(mStorage: Storage = localStorage): void {
    mStorage.removeItem(AlphaRefreshData.refreshTokenFieldName);
  }

  /**
   * Stores the refresh token in storage.
   * @param mStorage - Storage object to use (default: browser localStorage).
   */
  store(mStorage: Storage = localStorage): void {
    mStorage.setItem(
      AlphaRefreshData.refreshTokenFieldName,
      this.refreshToken);
  }

}
