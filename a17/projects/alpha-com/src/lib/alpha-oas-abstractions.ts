// noinspection JSUnusedGlobalSymbols

import {Observable} from "rxjs";
import {IAlphaLoggerService} from "./alpha-ls-abstractions";

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

export interface IAlphaOAuthService {
  principal: IAlphaPrincipal;

  /**
   * Initializes the authentication process.
   *
   * @param {string} [getMeUrl] - The URL for retrieving user information.
   * @param {string} [refreshUrl] - The URL for refreshing authentication.
   * @param {string} [signInUrl] - The URL for signing in.
   * @param {IAlphaLoggerService} [ls] -
   *  (optional) The logger service used for logging authentication events.
   * @param {(principal: IAlphaPrincipal) => any} [onPrincipalUpdated] -
   *  (optional) A delegate that will be triggered whenever the principal is updated.
   * @return {Observable<any>} - An Observable that emits the result of the initialization process.
   */
  init(getMeUrl?: string,
       refreshUrl?: string,
       signInUrl?: string,
       ls?: IAlphaLoggerService,
       onPrincipalUpdated?: (principal: IAlphaPrincipal) => any): Observable<string>;

  /**
   * Inject your own signIn method */
  useSignIn(
    signIn: (
      userName: string,
      password: string,
      rememberMe: boolean) => Observable<IAlphaAuthEnvelop>): void;

  /**
   * On successful login call storeIdentity.
   * Remark: there is no need to call getMe from signIn as getMe
   * is actually returning the same data as signIn
   * @param username
   * @param password
   * @param rememberMe
   */
  signIn(
    username: string,
    password: string,
    rememberMe: boolean): Observable<boolean>;

  /**
   * called from the init() method when the session data is present
   */
  getMe(): Observable<IAlphaUser>;

  editUserInfo(
    firstName: string,
    lastName: string,
    languageCode: string): void;

  signOut(): void

  /**
   * checks the accessToken and eventually refreshes it
   * before calling the request
   */
  authorize(httpRequest: Observable<any>): Observable<any>;

  storeIdentity(
    authEnvelop: IAlphaAuthEnvelop,
    rememberMe: boolean): void;
}
