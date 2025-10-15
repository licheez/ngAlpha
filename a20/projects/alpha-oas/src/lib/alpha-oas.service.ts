import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AlphaPrincipal} from "./alpha-principal";
import {catchError, map, mergeMap, Observable, Subscriber, throwError} from "rxjs";
import {AlphaSessionData} from "./alpha-session-data";
import {AlphaRefreshData} from "./alpha-refresh-data";
import {AlphaAuthEnvelopFactory} from "./alpha-auth-envelop";
import {AlphaUserFactory} from "./alpha-user";
import {
  AlphaAuthStatusEnum, IAlphaAuthEnvelop,
  IAlphaPrincipal, IAlphaUser
} from "./alpha-oas-abstractions";

/**
 * AlphaOasService provides authentication and authorization logic for OAuth-based flows.
 * Handles sign-in, token refresh, user retrieval, and principal state management.
 *
 * Key Features:
 * - Supports custom implementations for sign-in, refresh, and authorize via injection methods.
 * - Manages session and refresh tokens using browser storage.
 * - Emits principal updates and error logs via callback functions.
 * - Designed for use as a singleton service (providedIn: 'root').
 *
 * Usage:
 * - Call `init()` to initialize the service with required URLs, HttpClient, and optional callbacks/storage.
 * - Use `signIn()`, `refresh()`, and `getMe()` for authentication flows.
 * - Use `authorize()` to wrap protected HTTP requests.
 * - Listen for principal updates via the `onPrincipalUpdated` callback.
 */
@Injectable({
  providedIn: 'root'
})
export class AlphaOasService {
  /**
   * HttpClient instance for making HTTP requests. Set via init().
   */
  private mHttp: HttpClient | undefined;
  /**
   * Service context string for error logging.
   */
  private readonly mContext = 'OAuthService';
  /**
   * Principal representing the current authenticated user and status.
   */
  private readonly mPrincipal: AlphaPrincipal;
  /**
   * OAuth endpoint URLs. Set via init().
   */
  private mSignInUrl: string | undefined;
  private mRefreshUrl: string | undefined;
  private mGetMeUrl: string | undefined;
  /**
   * Storage objects for session and refresh tokens. Default to browser storage, can be injected.
   */
  private mSessionStorage: Storage = sessionStorage;
  private mLocalStorage: Storage = localStorage;
  /**
   * Callback for principal updates. Set via init().
   */
  private mOnPrincipalUpdated: (principal: AlphaPrincipal) => any = () => {};
  /**
   * Callback for error logging. Set via init().
   */
  private mPostErrorLog: (context: string, method: string, error: string) => any = () => {};

  /**
   * Returns the current principal (user and status).
   */
  get principal(): IAlphaPrincipal {
    return this.mPrincipal;
  }

  /**
   * Constructs the service and initializes the principal.
   */
  constructor() {
    this.mPrincipal = new AlphaPrincipal();
  }

  /**
   * Initializes the service with required dependencies and URLs.
   * Determines authentication state from session/refresh storage, or sets anonymous mode.
   *
   * @param httpClient - Angular HttpClient instance.
   * @param getMeUrl - URL for retrieving user info.
   * @param refreshUrl - URL for token refresh.
   * @param signInUrl - URL for sign-in.
   * @param postErrorLog - Optional error logging callback.
   * @param onPrincipalUpdated - Optional principal update callback.
   * @param sStorage - Optional session storage (default: browser sessionStorage).
   * @param lStorage - Optional local storage (default: browser localStorage).
   * @returns Observable emitting the result of initialization.
   */
  init(
    httpClient: HttpClient,
    getMeUrl?: string,
    refreshUrl?: string,
    signInUrl?: string,
    postErrorLog?: (context: string, method: string, error: string) => any,
    onPrincipalUpdated?: (principal: IAlphaPrincipal) => any,
    sStorage: Storage = sessionStorage,
    lStorage: Storage = localStorage
  ): Observable<string> {

    this.mHttp = httpClient;
    this.mSignInUrl = signInUrl;
    this.mRefreshUrl = refreshUrl;
    this.mGetMeUrl = getMeUrl;
    this.initStorage(sStorage, lStorage);

    if (postErrorLog) {
      this.mPostErrorLog = postErrorLog;
    }
    if (onPrincipalUpdated) {
      this.mOnPrincipalUpdated = onPrincipalUpdated;
    }

    // let's first see if there is still a session data
    const sd = AlphaSessionData.retrieve(sStorage);
    if (sd != null) {
      return this.initFromSd();
    }

    // then check if there is a refresh data available
    const rd = AlphaRefreshData.retrieve(lStorage);
    if (rd != null) {
      return this.initFromRd();
    }

    // no sd and no rd found let's start as anonymous
    return this.initAsAnonymous();
  }

  /**
   * Sets the session and local storage objects used for token management.
   * @param sStorage - Session storage.
   * @param lStorage - Local storage.
   */
  initStorage(sStorage: Storage, lStorage: Storage): void {
    this.mSessionStorage = sStorage;
    this.mLocalStorage = lStorage;
  }

  /**
   * Initializes authentication from session data (if present).
   * @returns Observable emitting result string.
   */
  private initFromSd(): Observable<string> {
    console.log('Sd found... calling getMe');
    return new Observable(
      (subscriber: Subscriber<string>) => {
        this.getMe().subscribe({
          next: () => subscriber.next('principal reloaded'),
          error: e => subscriber.error(e)
        });
      });
  }

  /**
   * Initializes authentication from refresh data (if present).
   * @returns Observable emitting result string.
   */
  private initFromRd(): Observable<string> {
    return new Observable(
      (subscriber: Subscriber<string>) => {
        console.log('rd active... calling refresh');
        this.mPrincipal.setStatus(AlphaAuthStatusEnum.Refreshing);
        this.refresh().subscribe({
          next: refreshed => {
            if (refreshed) {
              subscriber.next('identity refreshed');
            } else {
              this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
              subscriber.next('refresh failed');
            }
          },
          error: (e: any) => {
            subscriber.error(e);
          }
        });
      });
  }

  /**
   * Initializes authentication in anonymous mode (no session/refresh data).
   * @returns Observable emitting result string.
   */
  private initAsAnonymous(): Observable<string> {
    return new Observable(
      (subscriber: Subscriber<string>) => {
        this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
        subscriber.next('anonymous');
      });
  }

  /**
   * Allows injection of a custom sign-in implementation.
   * @param signIn - Function implementing sign-in logic.
   */
  useSignIn(
    signIn: (
      userName: string,
      password: string,
      rememberMe: boolean
    ) => Observable<IAlphaAuthEnvelop>
  ): void {
    this.internalSignIn = signIn;
  }

  /**
   * Allows injection of a custom refresh implementation.
   * @param refresh - Function implementing refresh logic.
   */
  useRefresh(refresh: (refreshToken: string) => Observable<IAlphaAuthEnvelop>) {
    this.internalRefresh = refresh;
  }

  /**
   * Allows injection of a custom authorize implementation.
   * @param authorize - Function implementing authorization logic.
   */
  useAuthorize(authorize: (request: Observable<any>) => Observable<any>): void {
    this.internalAuthorize = authorize;
  }

  /**
   * Default sign-in implementation. Can be overridden via useSignIn().
   * @param username - User name.
   * @param password - User password.
   * @param rememberMe - Whether to persist refresh token.
   * @returns Observable emitting authentication envelope.
   */
  internalSignIn: (
    userName: string,
    password: string,
    rememberMe: boolean
  ) => Observable<IAlphaAuthEnvelop> =
    (username: string, password: string) => {

      if (this.mHttp === undefined) {
        throw new Error('service is not initialized');
      }

      const body = 'grant_type=password' +
        '&username=' + encodeURIComponent(username) +
        '&password=' + encodeURIComponent(password);

      const headers = new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded');

      const url = this.mSignInUrl!;
      return this.mHttp!
        .post<any>(url, body, {headers: headers})
        .pipe(
          map(dso =>
            AlphaAuthEnvelopFactory.factorFromDso(dso)),
          catchError(error => {
            this.mPostErrorLog(this.mContext,
              '_signIn', JSON.stringify(error));
            return throwError(() => error);
          }));
    }

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
    rememberMe: boolean): Observable<boolean> {

    return new Observable<boolean>(
      (subscriber: Subscriber<boolean>) => {
        this.internalSignIn(username, password, rememberMe)
          .subscribe({
            next: (token: IAlphaAuthEnvelop) => {
              this.storeIdentity(token, rememberMe);
              subscriber.next(true);
            },
            error: (e: HttpErrorResponse) => {
              this.signOut();
              if (e.status === 400 || e.status === 401) {
                subscriber.next(false);
              } else {
                this.mPostErrorLog(
                  this.mContext, 'login', JSON.stringify(e))
                subscriber.error(e);
              }
            }
          });
        return;
      });
  }

  /**
   * Default refresh implementation. Can be overridden via useRefresh().
   * @param refreshToken - Refresh token string.
   * @returns Observable emitting authentication envelope.
   */
  internalRefresh: (refreshToken: string) => Observable<IAlphaAuthEnvelop> =
    (refreshToken: string) => {

      if (this.mHttp === undefined) {
        throw new Error('service is not initialized');
      }

      const body = 'grant_type=refresh_token' +
        '&refresh_token=' + encodeURIComponent(refreshToken);

      const headers = new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded');

      const url = this.mRefreshUrl!;
      return this.mHttp!.post<any>(url, body, {headers: headers})
        .pipe(
          map(dso =>
            AlphaAuthEnvelopFactory.factorFromDso(dso)));
    }

  /**
   * Refreshes the access token using the refresh token from local storage.
   * Emits true on success, false on authentication error, or errors for other failures.
   * @returns Observable emitting boolean result.
   */
  refresh(): Observable<boolean> {

    const rd =
      AlphaRefreshData.retrieve(this.mLocalStorage);
    if (rd == null) {
      this.mPostErrorLog(this.mContext,
        'refresh', 'rd should not be null');
      return throwError(
        () => 'rd should not be null');
    }

    return new Observable<boolean>(
      (subscriber: Subscriber<boolean>) => {
        this.internalRefresh(rd.refreshToken)
          .subscribe({
            next: (token: IAlphaAuthEnvelop) => {
              this.storeIdentity(token, true);
              subscriber.next(true);
            },
            error: (e: HttpErrorResponse) => {
              this.signOut();
              if (e.status == 401) {
                subscriber.next(false);
              } else {
                this.mPostErrorLog(this.mContext,
                  'refresh', JSON.stringify(e));
                subscriber.error(e);
              }
            }
          });
      });
  }

  /**
   * called from the init() method when the session data is present
   */
  getMe(): Observable<IAlphaUser> {
    if (!this.mHttp) {
      throw new Error('service is not initialized');
    }
    const url = this.mGetMeUrl!;
    const call = this.mHttp.get<any>(url)
      .pipe(
        map(
          dso => {
            const user = AlphaUserFactory.factorFromDso(dso);
            this.populatePrincipal(user);
            return user;
          }),
        catchError((error: HttpErrorResponse) => {
          this.mPostErrorLog(this.mContext, url,
            JSON.stringify(error));
          return throwError(() => error);
        }));

    return this.authorize(call);
  }

  /**
   * Edits the principal's user info and emits principal update.
   * @param firstName - New first name.
   * @param lastName - New last name.
   * @param languageCode - New language code.
   */
  editUserInfo(
    firstName: string,
    lastName: string,
    languageCode: string): void {
    if (!this.mPrincipal.user) {
      return;
    }
    this.mPrincipal.user.username = firstName + " " + lastName;
    this.mPrincipal.user.languageCode = languageCode;

    this.mOnPrincipalUpdated(this.mPrincipal)
  }

  /**
   * Signs out the user, clears tokens and principal, and emits principal update.
   */
  signOut(): void {
    AlphaSessionData.clear(this.mSessionStorage);
    AlphaRefreshData.clear(this.mLocalStorage);
    this.mPrincipal.clearUser();
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
    this.mOnPrincipalUpdated(this.mPrincipal);
  }

  /**
   * Default authorization implementation. Can be overridden via useAuthorize().
   * Checks token validity and refreshes if needed before firing request.
   * @param httpRequest - Observable HTTP request to authorize.
   * @returns Observable emitting the result of the request.
   */
  internalAuthorize(
    httpRequest: Observable<any>): Observable<any> {
    const sd =
      AlphaSessionData.retrieve(this.mSessionStorage);
    if (sd == null || sd.isExpiredOrExpiring) {
      return this.refresh()
        .pipe(
          mergeMap(() => httpRequest),
          catchError(error => {
              this.mPostErrorLog(this.mContext,
                '_authorize', JSON.stringify(error));
              return throwError(() => error)
            }
          ));
    } else {
      return httpRequest;
    }
  }

  /**
   * Wraps a protected HTTP request with authorization logic.
   * @param httpRequest - Observable HTTP request to authorize.
   * @returns Observable emitting the result of the request.
   */
  authorize(
    httpRequest: Observable<any>): Observable<any> {
    return this.internalAuthorize(httpRequest);
  }

  /**
   * (1) stores the access token in the session storage
   * (2) stores the refresh token in the local storage
   * (3) populates the principal using the user info
   */
  storeIdentity(
    authEnvelop: IAlphaAuthEnvelop,
    rememberMe: boolean): void {

    const ts = AlphaSessionData
      .getTimestamps(authEnvelop.expiresIn);

    const sd = new AlphaSessionData(
      true, authEnvelop.accessToken,
      ts.receptionTs, ts.expirationTs);
    sd.store(this.mSessionStorage);
    console.log('sd populated');

    if (rememberMe) {
      const rd = new AlphaRefreshData(
        authEnvelop.refreshToken);
      rd.store(this.mLocalStorage);
      console.log('rd populated');
    }

    this.populatePrincipal(authEnvelop.user);
  }

  /**
   * Populates the principal with user info and emits principal update.
   * @param user - User object.
   */
  private populatePrincipal(user: IAlphaUser) {
    this.mPrincipal.setUser(user);
    console.log('principal user is set');
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Authenticated);
    this.mOnPrincipalUpdated(this.mPrincipal);
  }

}
