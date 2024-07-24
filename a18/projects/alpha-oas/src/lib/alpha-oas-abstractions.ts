export enum AlphaAuthStatusEnum {
  Undefined,
  Anonymous,
  Authenticating,
  Refreshing,
  Authenticated
}

export interface IAlphaUser {
  userId: string;
  username: string;
  languageCode: string;
  properties: Map<string, any>
}

export interface IAlphaAuthEnvelop {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: IAlphaUser;
}

export interface IAlphaPrincipal {
  status: AlphaAuthStatusEnum;
  user: IAlphaUser | null;
  languageCode: string;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isAuthenticating: boolean;
  setSessionLanguageCode(lc: string): void;
}
