import {
  AlphaHttpObjectResult,
  IAlphaLocalBusService,
  IAlphaLoggerService,
  IAlphaOAuthService
} from "@pvway/alpha-common";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {AlphaEmsUsoOptionSet} from "./alpha-ems-uso-option-set";
import {AlphaHttpListResult} from "@pvway/alpha-common";
import {AlphaEmsEditContainer, IAlphaEmsEditContainer} from "./alpha-ems-edit-container";
import {AlphaEmsBaseApiEvent} from "./alpha-ems-base-api-event";

export abstract class AlphaEmsBaseApi<TH, TB, TE> {
  constructor(
    protected mLs: IAlphaLoggerService,
    protected mOas: IAlphaOAuthService,
    protected mLbs: IAlphaLocalBusService,
    protected mHttp: HttpClient,
    protected mContext: string,
    protected mControllerUrl: string,
    private factorHead: (dso: any) => TH,
    private factorBody: (dso: any) => TB,
    private factorEi: (dso: any) => TE) {
  }

  list(authorize: boolean, skip: number, take: number,
       options?: Map<string, string>,
       methodName?: string): Observable<TH[]> {
    if (!options) {
      options = new Map<string, string>();
    }
    options.set('skip', skip.toString());
    options.set('take', take.toString());
    const body =
      new AlphaEmsUsoOptionSet([], options);
    if (!methodName) {
      methodName = 'list';
    }
    const url = this.mControllerUrl + `/${methodName}`;
    const call = this.mHttp
      .post<any>(url, body)
      .pipe(
        map(
          hRes => AlphaHttpListResult
            .factorFromDso<TH>(
              hRes,
              (dsoItem: any) =>
                this.factorHead(dsoItem)).data
        ),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));
    return authorize ? this.mOas.authorize(call) : call;
  }

  getBody(authorize: boolean, keys: string[],
          options?: Map<string, string>,
          methodName?: string): Observable<TB> {
    if (!methodName) {
      methodName = 'body';
    }
    const url = this.mControllerUrl + `/${methodName}`;
    const body = new AlphaEmsUsoOptionSet(keys, options);
    const call = this.mHttp.post<any>(url, body)
      .pipe(
        map(
          hRes => AlphaHttpObjectResult
            .factorFromDso<TB>(
              hRes,
              dso => this.factorBody(dso)).data
        ),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));

    return authorize ? this.mOas.authorize(call) : call;
  }

  getBodyFe(keys: string[],
            options?: Map<string, string>,
            methodName?: string): Observable<IAlphaEmsEditContainer<TB, TE>> {
    if (!methodName) {
      methodName = 'bodyFe';
    }
    const url = this.mControllerUrl + `/${methodName}`;
    const body = new AlphaEmsUsoOptionSet(keys, options);
    const call = this.mHttp.post<any>(url, body)
      .pipe(
        map(
          hRes => {
            return AlphaHttpObjectResult
              .factorFromDso<IAlphaEmsEditContainer<TB, TE>>(
                hRes,
                dso => AlphaEmsEditContainer.factorFromDso(
                  dso,
                  this.factorEi,
                  this.factorBody)).data;
          }
        ),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));

    return this.mOas.authorize(call);
  }

  getEi(options?: Map<string, string>,
        methodName?: string): Observable<TE> {
    if (!options) {
      options = new Map<string, string>();
    }
    const body = new AlphaEmsUsoOptionSet([], options);
    if (!methodName) {
      methodName = 'ei';
    }
    let url = this.mControllerUrl + `/${methodName}`;
    const call = this.mHttp.post<any>(url, body)
      .pipe(
        map(
          hRes => AlphaHttpObjectResult
            .factorFromDso<TE>(
              hRes,
              dso => this.factorEi(dso)).data
        ),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));

    return this.mOas.authorize(call);
  }

  baseCreate(body: any, methodName?: string): Observable<TB> {
    if (!methodName) {
      methodName = 'create';
    }
    const url = this.mControllerUrl + `/${methodName}`;
    const call = this.mHttp.post<any>(url, body)
      .pipe(
        map(
          hRes => {
            const body = AlphaHttpObjectResult
              .factorFromDso<TB>(
                hRes,
                dso => this.factorBody(dso)).data;
            const event = new AlphaEmsBaseApiEvent('create', body);
            this.mLbs.publish(event, this.mContext);
            return body;
          }
        ),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));
    return this.mOas.authorize(call);
  }

  baseUpdate(body: any, methodName?: string): Observable<TB> {
    if (!methodName) {
      methodName = 'update';
    }
    const url = this.mControllerUrl + `/${methodName}`;
    const call = this.mHttp.post<any>(url, body)
      .pipe(
        map(
          hRes => {
            const body = AlphaHttpObjectResult
              .factorFromDso<TB>(
                hRes,
                dso => this.factorBody(dso)).data;
            const event = new AlphaEmsBaseApiEvent<TB>('update', body);
            this.mLbs.publish(event, this.mContext);
            return body;
          }
        ),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));
    return this.mOas.authorize(call);
  }

  /** returns undefined on physical delete
   * or the updated body in case of deactivation */
  delete(keys: string[],
         options?: Map<string, string>,
         methodName?: string): Observable<TB | undefined> {
    if(!methodName) {
      methodName = 'delete';
    }
    const url = this.mControllerUrl + `/${methodName}`;
    const body = new AlphaEmsUsoOptionSet(keys, options);
    const call = this.mHttp.post<any>(url, body)
      .pipe(
        map(
          hRes => {
            const body = hRes.data
              ? AlphaHttpObjectResult.factorFromDso<TB>(
                hRes, dso => this.factorBody(dso)).data
              : undefined;
            const event = body
              ? new AlphaEmsBaseApiEvent<TB>('update', body)
              : new AlphaEmsBaseApiEvent('delete', null, keys);
            this.mLbs.publish(event, this.mContext);
            return body;
          }),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));
    return this.mOas.authorize(call);
  }

}
