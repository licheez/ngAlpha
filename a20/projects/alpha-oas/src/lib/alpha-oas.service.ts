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

@Injectable({
  providedIn: 'root'
})
export class AlphaOasService {

  private mHttp: HttpClient | undefined;
  private readonly mContext = 'OAuthService';
  private readonly mPrincipal: AlphaPrincipal;
  private mSignInUrl: string | undefined;
  private mRefreshUrl: string | undefined;
  private mGetMeUrl: string | undefined;
  private mSessionStorage: Storage = sessionStorage;
  private mLocalStorage: Storage = localStorage;

  private mOnPrincipalUpdated:
    (principal: AlphaPrincipal) => any =
    () => {
    };

  private mPostErrorLog:
    (context: string, method: string, error: string) => any =
    () => {
    };

  get principal(): IAlphaPrincipal {
    return this.mPrincipal;
  }

  constructor() {
    this.mPrincipal = new AlphaPrincipal();
  }

  /**
   * Initializes the authentication process by retrieving session data, refresh data, or setting authentication to anonymous mode.
   *
   * @param httpClient - need to inject the httpClient here
   * @param {string} [getMeUrl] - The URL for retrieving user information.
   * @param {string} [refreshUrl] - The URL for refreshing authentication.
   * @param {string} [signInUrl] - The URL for signing in.
   * @param {function} [postErrorLog] - A function that handles error logging.
   *   It accepts three parameters: context, method, and error.
   * @param {function} [onPrincipalUpdated] - A function that will be triggered whenever the principal is updated.
   *   It accepts one parameter: principal of type IAlphaPrincipal.
   *
   * @param sStorage
   * @param lStorage
   * @return {Observable} - An Observable that emits the result of the initialization process.
   */
  init(httpClient: HttpClient,
       getMeUrl?: string,
       refreshUrl?: string,
       signInUrl?: string,
       postErrorLog?: (context: string, method: string, error: string) => any,
       onPrincipalUpdated?: (principal: IAlphaPrincipal) => any,
       sStorage: Storage = sessionStorage,
       lStorage: Storage = localStorage): Observable<string> {

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

  initStorage(sStorage: Storage, lStorage: Storage): void {
    this.mSessionStorage = sStorage;
    this.mLocalStorage = lStorage;
  }

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

  private initAsAnonymous(): Observable<string> {
    return new Observable(
      (subscriber: Subscriber<string>) => {
        this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
        subscriber.next('anonymous');
      });
  }

  /**
   * Inject your own signIn method */
  useSignIn(
    signIn: (
      userName: string,
      password: string,
      rememberMe: boolean) => Observable<IAlphaAuthEnvelop>): void {
    this.internalSignIn = signIn;
  }

  /**
   * Inject your own refresh method */
  useRefresh(refresh: (
    refreshToken: string) => Observable<IAlphaAuthEnvelop>) {
    this.internalRefresh = refresh;
  }

  /** Inject your own authorize method */
  useAuthorize(authorize: (request: Observable<any>) => Observable<any>): void {
    this.internalAuthorize = authorize;
  }

  internalSignIn: (
    userName: string,
    password: string,
    rememberMe: boolean) =>
    Observable<IAlphaAuthEnvelop> =
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
   * default implementation of refresh
   * this implementation can be overridden by calling useRefresh
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
   * refreshes the accessToken from the refreshToken
   * found in the local storage data
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

  signOut(): void {
    AlphaSessionData.clear(this.mSessionStorage);
    AlphaRefreshData.clear(this.mLocalStorage);
    this.mPrincipal.clearUser();
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
    this.mOnPrincipalUpdated(this.mPrincipal);
  }

  /**
   * checks that the accessToken is not expired or
   * expiring (expirationTime - 1 minute).
   * if still valid fires the request directly else inserts a
   * refresh before firing the request
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
   * checks the accessToken and eventually refreshes it
   * before calling the request
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

  private populatePrincipal(user: IAlphaUser) {
    this.mPrincipal.setUser(user);
    console.log('principal user is set');
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Authenticated);
    this.mOnPrincipalUpdated(this.mPrincipal);
  }

}
