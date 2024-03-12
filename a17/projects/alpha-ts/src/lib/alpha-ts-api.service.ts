import { Injectable } from '@angular/core';
import {catchError, map, Observable, Subscriber, throwError} from "rxjs";
import {IAlphaTranslationCache} from "./ialpha-translation-cache";
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlphaLsService} from "@pvway/alpha-ls";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsApiService {

  private mContext = 'AlphaTsApiService';
  private _getTranslationCacheUpdateUrl: string | undefined;
  private _getTranslationCacheUpdate = this.getTranslationCacheUpdateBuiltIn;

  constructor(
    private mHttp: HttpClient,
    private mLs: AlphaLsService) { }

  init(getTranslationCacheUpdateUrl: string | undefined) {
    this._getTranslationCacheUpdateUrl = getTranslationCacheUpdateUrl;
  }

  useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
      Observable<IAlphaTranslationCache | null>) {
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
          }}) => {
          if (hRes.data.isUpToDate) {
            return null;
          }
          const dsoTc = hRes.data.translationsCache;
          return AlphaTranslationCache.factorFromDso(dsoTc);
        }),
        catchError((error: HttpErrorResponse) => {
          this.mLs.postErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(()=>error);
        }));
  }

}
