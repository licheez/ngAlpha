export class AlphaRefreshData {

  private static readonly refreshTokenFieldName = 'alphaRefreshToken';

  refreshToken: string;

  constructor(
    refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  static retrieve(): AlphaRefreshData | null {
    const rt = localStorage
      .getItem(AlphaRefreshData.refreshTokenFieldName);
    if (rt == null) {
      return null;
    }
    return new AlphaRefreshData(rt);
  }

  static clear(): void {
    localStorage.removeItem(AlphaRefreshData.refreshTokenFieldName);
  }

  store(): void {
    localStorage.setItem(
      AlphaRefreshData.refreshTokenFieldName,
      this.refreshToken);
  }

}
