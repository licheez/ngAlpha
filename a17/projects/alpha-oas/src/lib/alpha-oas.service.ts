import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AlphaPrincipal} from "./alpha-principal";
import {catchError, map, mergeMap, Observable, Subscriber, throwError} from "rxjs";
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

  private mNotifyStateChange:
    (principal: AlphaPrincipal, channel: string) => any =
    () => {
    };
  private mPostErrorLog:
    (context: string, method: string, error: string) => any =
    () => {
    };

  get principal(): AlphaPrincipal {
    return this.mPrincipal;
  }

  constructor(
    private mHttp: HttpClient) {
    this.mPrincipal = new AlphaPrincipal();
  }

  /**
   * Initializes the authentication process by retrieving session data, refresh data, or setting authentication to anonymous mode.
   *
   * @param {string} [signInUrl] - The URL for signing in.
   * @param {string} [refreshUrl] - The URL for refreshing authentication.
   * @param {string} [getMeUrl] - The URL for retrieving user information.
   * @param postErrorLog - A delegate method that can post errors towards the server
   * @param notifyStateChange - A delegate method responsible for broadcasting principal state changes
   * @return {Observable<any>} - An Observable that emits the result of the initialization process.
   */
  init(getMeUrl?: string,
       refreshUrl?: string,
       signInUrl?: string,
       postErrorLog?:
         (context: string, method: string, error: string) => any,
       notifyStateChange?:
         (principal: AlphaPrincipal, channel: string) => any): Observable<any> {

    this.mSignInUrl = signInUrl;
    this.mRefreshUrl = refreshUrl;
    this.mGetMeUrl = getMeUrl;
    // postErrorLog defaults to nop
    this.mPostErrorLog = postErrorLog || (() => {});
    // notifyStateChange defaults to nop
    this.mNotifyStateChange = notifyStateChange || (() => {});

    // let's first see if there is still a session data
    const sd = AlphaSessionData.retrieve();
    if (sd != null) {
      return this.initFromSd();
    }

    // then check if there is a refresh data available
    const rd = AlphaRefreshData.retrieve();
    if (rd != null) {
      return this.initFromRd();
    }

    // no sd and no rd found let's start as anonymous
    return this.initAsAnonymous();
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
              subscriber.next('refreshed failed');
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

  private _signIn: (
    userName: string,
    password: string,
    rememberMe: boolean) =>
    Observable<IAlphaAuthEnvelop> =
    (username: string, password: string) => {

    const body = 'grant_type=password' +
      '&username=' + encodeURIComponent(username) +
      '&password=' + encodeURIComponent(password);

    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded');

    const url = this.mSignInUrl!;
    return this.mHttp
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
  private _refresh: (refreshToken: string) => Observable<IAlphaAuthEnvelop> =
    (refreshToken: string) => {

      const body = 'grant_type=refresh_token' +
        '&refresh_token=' + encodeURIComponent(refreshToken);

      const headers = new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded');

      const url = this.mRefreshUrl!;
      return this.mHttp.post<any>(url, body, {headers: headers})
        .pipe(
          map(dso =>
            AlphaAuthEnvelopFactory.factorFromDso(dso)));
    }

  /**
   * refreshes the accessToken from the refreshToken
   * found in the local storage data
   */
  private refresh(): Observable<boolean> {
    const rd = AlphaRefreshData.retrieve();
    if (rd == null) {
      this.mPostErrorLog(this.mContext,
        'refresh', 'rd should not be null');
      return throwError(
        () => 'rd should not be null');
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
  private getMe(): Observable<IAlphaUser> {
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
    languageCode: string) {
    if (!this.mPrincipal.user) {
      return;
    }
    this.mPrincipal.user.username = firstName + " " + lastName;
    this.mPrincipal.user.languageCode = languageCode;

    this.mNotifyStateChange(
      this.mPrincipal, AlphaPrincipal.PRINCIPAL_UPDATED)
  }

  signOut(): void {
    AlphaSessionData.clear();
    AlphaRefreshData.clear();
    this.mPrincipal.clearUser();
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Anonymous);
    this.mNotifyStateChange(
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
  authorize(httpRequest: Observable<any>): Observable<any> {
    return this._authorize(httpRequest);
  }

  /**
   * (1) stores the access token in the session storage
   * (2) stores the refresh token in the local storage
   * (3) populates the principal using the user info
   */
  private storeIdentity(
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
      const rd = new AlphaRefreshData(
        authEnvelop.refreshToken);
      rd.store();
      console.log('rd populated');
    }

    this.populatePrincipal(authEnvelop.user);
  }

  private populatePrincipal(user: IAlphaUser) {
    this.mPrincipal.setUser(user);
    console.log('principal user is set');
    this.mPrincipal.setStatus(AlphaAuthStatusEnum.Authenticated);
    this.mNotifyStateChange(
      this.mPrincipal, AlphaPrincipal.PRINCIPAL_UPDATED);
  }

}
