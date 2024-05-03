import {Injectable} from '@angular/core';
import {catchError, map, Observable, Subscriber, throwError} from "rxjs";
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IAlphaTranslationCache} from "./alpha-ts-abstractions";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsApiService {

  private mContext = 'AlphaTsApiService';
  private _getTranslationCacheUpdateUrl: string | undefined;
  private _getTranslationCacheUpdate = this.getTranslationCacheUpdateBuiltIn;
  private mPostErrorLog: ((context: string, method: string, error: string) => any) | undefined;

  constructor(
    private mHttp: HttpClient) {
  }

  /**
   * Initializes the method with the provided parameters.
   *
   * @param {string | undefined} getTranslationCacheUpdateUrl - The URL for updating the translation cache.
   * @param {Function} [postErrorLog] - The function for posting error logs. It takes three parameters: context (string), method (string), error (string).
   * @return {void}
   */
  init(
    getTranslationCacheUpdateUrl: string | undefined,
    postErrorLog?: (context: string, method: string, error: string) => any): void {
    this._getTranslationCacheUpdateUrl = getTranslationCacheUpdateUrl;
    this.mPostErrorLog = postErrorLog;
  }

  useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
    Observable<IAlphaTranslationCache | null>): void {
    this._getTranslationCacheUpdate = getTranslationCacheUpdate;
  }

  getTranslationCacheUpdate(lastUpdateDate: Date):
    Observable<IAlphaTranslationCache | null> {
    return this._getTranslationCacheUpdate(lastUpdateDate);
  }

  private getTranslationCacheUpdateBuiltIn(lastUpdateDate: Date):
    Observable<IAlphaTranslationCache | null> {
    const pDate = encodeURI(lastUpdateDate.toISOString());
    if (!this._getTranslationCacheUpdateUrl) {
      return new Observable(
        (subscriber: Subscriber<IAlphaTranslationCache | null>) => {
          const tc = AlphaTranslationCache.default;
          subscriber.next(tc);
        });
    }

    const url = this._getTranslationCacheUpdateUrl
      + `?clientDate=${pDate}`;
    return this.mHttp.get<any>(url)
      .pipe(
        map((hRes: {
          data: {
            isUpToDate: boolean,
            translationsCache: any
          }
        }) => {
          if (hRes.data.isUpToDate) {
            return null;
          }
          const dsoTc = hRes.data.translationsCache;
          return AlphaTranslationCache.factorFromDso(dsoTc);
        }),
        catchError((error: HttpErrorResponse) => {
          if (this.mPostErrorLog) {
            this.mPostErrorLog(this.mContext, url, JSON.stringify(error));
          }
          return throwError(() => error);
        }));
  }

}
