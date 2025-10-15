export class AlphaRefreshData {

  private static readonly refreshTokenFieldName = 'alphaRefreshToken';

  refreshToken: string;

  constructor(
    refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  static retrieve(mStorage: Storage = localStorage): AlphaRefreshData | null {
    const rt = mStorage
      .getItem(AlphaRefreshData.refreshTokenFieldName);
    if (rt == null) {
      return null;
    }
    return new AlphaRefreshData(rt);
  }

  static clear(mStorage: Storage = localStorage): void {
    mStorage.removeItem(AlphaRefreshData.refreshTokenFieldName);
  }

  store(mStorage: Storage = localStorage): void {
    mStorage.setItem(
      AlphaRefreshData.refreshTokenFieldName,
      this.refreshToken);
  }

}
