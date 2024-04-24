import {IAlphaPrincipal, AlphaAuthStatusEnum, IAlphaUser} from "@pvway/alpha-common";

export class AlphaPrincipal implements IAlphaPrincipal {

  private mStatus: AlphaAuthStatusEnum;
  get status(): AlphaAuthStatusEnum {
    return this.mStatus;
  }
  setStatus(status: AlphaAuthStatusEnum): void {
    this.mStatus = status;
  }

  private mUser: IAlphaUser | null;
  get user(): IAlphaUser | null {
    return this.mUser;
  }
  setUser(user: IAlphaUser): void {
    this.mUser = user;
    this.setSessionLanguageCode(user.languageCode);
  }
  setSessionLanguageCode(lc: string) {
    // interceptor will use this value for inserting
    // the language-code header on each outgoing request
    sessionStorage.setItem('alphaLanguageCode', lc);
  }
  clearUser(): void {
    this.mUser = null;
    sessionStorage.removeItem('alphaLanguageCode');
  }

  get languageCode(): string {
    if (this.mUser) {
      return this.mUser.languageCode;
    }
    const lsLc = sessionStorage.getItem('alphaLanguageCode');
    if (lsLc) {
      return lsLc;
    }
    const nav = window.navigator as any;
    const userLang = (nav.language || nav.userLanguage) as string;
    return userLang
      ? userLang.substring(0, 2).toLowerCase()
      : 'en';
  }

  get isAuthenticated(): boolean {
    return this.mStatus === AlphaAuthStatusEnum.Authenticated;
  }

  get isAnonymous(): boolean {
    return this.mStatus === AlphaAuthStatusEnum.Undefined
      || this.mStatus === AlphaAuthStatusEnum.Anonymous;
  }

  get isAuthenticating(): boolean {
    return this.mStatus === AlphaAuthStatusEnum.Authenticating
      || this.mStatus === AlphaAuthStatusEnum.Refreshing;
  }

  constructor() {
    this.mStatus = AlphaAuthStatusEnum.Undefined;
    this.mUser = null;
  }

}
