import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaLbsService} from "@pvway/alpha-lbs";
import {AlphaPrincipal} from "./alpha-principal";
import {catchError, map, mergeMap, Observable, Observer, Subscriber, throwError} from "rxjs";
import {AlphaSessionData} from "./alpha-session-data";
import {AlphaRefreshData} from "./alpha-refresh-data";
import {AlphaAuthStatusEnum} from "./alpha-auth-status-enum";
import {AlphaAuthEnvelopFactory, IAlphaAuthEnvelop} from "./alpha-auth-envelop";
import {AlphaUserFactory, IAlphaUser} from "./alpha-user";

@Injectable({
  providedIn: 'root'
})
export class AlphaOasService {

  private readonly mContext = 'OAuthService';
  private readonly mPrincipal: AlphaPrincipal;
  private mSignInUrl: string | undefined;
  private mRefreshUrl: string | undefined;
  private mGetMeUrl: string | undefined;

  get principal(): AlphaPrincipal {
    return this.mPrincipal;
  }

  constructor(
    private mHttp: HttpClient,
    private mLbs: AlphaLbsService,
    private mLs: AlphaLsService) {
    this.mPrincipal = new AlphaPrincipal();
  }

  /**
   * Initializes the authentication process by retrieving session data, refresh data, or setting authentication to anonymous mode.
   *
   * @param {string} [signInUrl] - The URL for signing in.
   * @param {string} [refreshUrl] - The URL for refreshing authentication.
   * @param {string} [getMeUrl] - The URL for retrieving user information.
   * @return {Observable<any>} - An Observable that emits the result of the initialization process.
   */
  init(getMeUrl?: string,
       refreshUrl?: string,
       signInUrl?: string): Observable<any> {

    this.mSignInUrl = signInUrl;
    this.mRefreshUrl = refreshUrl;
    this.mGetMeUrl = getMeUrl;

    return new Observable(
      (observer: Observer<any>) => {
        const sd = AlphaSessionData.retrieve();
        if (sd != null) {
          console.log('Sd found... calling getMe');
          this.getMe().subscribe({
            next: () => observer.next('principal reloaded'),
            error: e => observer.error(e)
          });
        } else {
          const rd = AlphaRefreshData.retrieve();
          if (rd != null) {
            console.log('rd active... calling refresh');
            this.mPrincipal.setStatus(AlphaAuthStatusEnum.Refreshing);
            this.refresh().subscribe({
              next: () => {
                observer.next('identity refreshed')
              },
              error: (e: any) => {
                console.error(e);
                observer.error(e);
              }
            });
          } else {
            this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
            observer.next('anonymous');
          }
        }
      });
  }

  useSignIn(
    signIn: (
      userName: string,
      password: string,
      rememberMe: boolean) => Observable<IAlphaAuthEnvelop>): void {
    this._signIn = signIn;
  }

  useRefresh(refresh: (
    refreshToken: string) => Observable<IAlphaAuthEnvelop>) {
    this._refresh = refresh;
  }

  /** overrides the builtin authorize method */
  useAuthorize(authorize: (request: Observable<any>) => Observable<any>): void {
    this._authorize = authorize;
  }

  private _signIn: (userName: string, password: string, rememberMe: boolean) =>
    Observable<IAlphaAuthEnvelop> = (username: string, password: string) => {

    const body = 'grant_type=password' +
      '&username=' + encodeURIComponent(username) +
      '&password=' + encodeURIComponent(password);

    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded');

    const url = this.mSignInUrl!;
    return this.mHttp
      .post<any>(url, body, { headers: headers })
      .pipe(map(dso => AlphaAuthEnvelopFactory.factorFromDso(dso)));
  }

  /**
   * on successful login call storeIdentity
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
        this._signIn(username, password, rememberMe)
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
                this.mLs.postErrorLog(
                  'OAuthService', 'login', JSON.stringify(e));
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
  private _refresh: (refreshToken: string) => Observable<IAlphaAuthEnvelop> =
    (refreshToken: string) => {

      const body = 'grant_type=refresh_token' +
        '&refresh_token=' + encodeURIComponent(refreshToken);

      const headers = new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded');

      const url = this.mRefreshUrl!;
      return this.mHttp.post<any>(url, body, { headers: headers })
        .pipe(map(dso => AlphaAuthEnvelopFactory.factorFromDso(dso)));
    }

  /**
   * refreshes the accessToken from the refreshToken
   * found in the local storage data
   */
  private refresh(): Observable<boolean> {
    const rd = AlphaRefreshData.retrieve();
    if (rd == null) {
      throw new Error('rd should not be null');
    }

    return new Observable<boolean>(
      (subscriber: Subscriber<boolean>) => {
        this._refresh(rd.refreshToken)
          .subscribe({
            next: (token: IAlphaAuthEnvelop) => {
              this.storeIdentity(token, true);
              subscriber.next(true);
            },
            error: (e: HttpErrorResponse) => {
              this.signOut();
              if (e.status === 401) {
                subscriber.next(false);
              } else {
                this.mLs.postErrorLog('OAuthService', 'refresh',
                  JSON.stringify(e));
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
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));

    return this.authorize(call);
  }

  editUserInfo(
    firstName: string,
    lastName: string,
    languageCode: string) {
    if (!this.mPrincipal.user) {
      throw new Error("user should not be null");
    }
    this.mPrincipal.user.username = firstName + " " + lastName;
    this.mPrincipal.user.languageCode = languageCode;

    this.mLbs.publish(this.mPrincipal,
      AlphaPrincipal.PRINCIPAL_UPDATED);
  }

  signOut(): void {
    AlphaSessionData.clear();
    AlphaRefreshData.clear();
    this.mPrincipal.clearUser();
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
    this.mLbs.publish(
      this.mPrincipal, AlphaPrincipal.PRINCIPAL_UPDATED);
  }

  /**
   * checks that the accessToken is not expired or
   * expiring (expirationTime - 1 minute).
   * if still valid fires the request directly else inserts a
   * refresh before firing the request
   */
  private _authorize(httpRequest: Observable<any>): Observable<any> {
    const sd = AlphaSessionData.retrieve();
    if (sd == null || sd.isExpiredOrExpiring) {
      return this.refresh()
        .pipe(
          mergeMap(() => httpRequest),
          catchError(error => throwError(()=>error)));
    } else {
      return httpRequest;
    }
  }

  /**
   * checks the accessToken and eventually refreshes it
   * before calling the request
   */
  authorize(httpRequest: Observable<any>): Observable<any> {
    return this._authorize(httpRequest);
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
    sd.store();
    console.log('sd populated');

    if (rememberMe) {
      const rd = new AlphaRefreshData(authEnvelop.refreshToken);
      rd.store();
      console.log('rd populated');
    }

    this.populatePrincipal(authEnvelop.user);
  }

  private populatePrincipal(user: IAlphaUser) {
    this.mPrincipal.setUser(user);
    console.log('principal user is set');
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Authenticated);
    this.mLbs.publish(this.mPrincipal,
      AlphaPrincipal.PRINCIPAL_UPDATED);
  }

}
