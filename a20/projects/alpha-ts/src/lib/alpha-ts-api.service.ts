import {Injectable} from '@angular/core';
import {catchError, map, Observable, Subscriber, throwError} from "rxjs";
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IAlphaTranslationCache} from "./alpha-ts-abstractions";

/**
 * AlphaTsApiService provides API integration for translation cache management.
 * It supports retrieving and updating the translation cache from a remote server,
 * as well as error logging and custom cache update strategies.
 *
 * Usage:
 *   - Use `init()` to configure the service with an HttpClient, endpoint URL, and error logger.
 *   - Use `getTranslationCacheUpdate()` to fetch the latest translation cache from the server.
 *   - Use `useGetTranslationCacheUpdate()` to inject a custom cache update method.
 */
@Injectable({
  providedIn: 'root'
})
export class AlphaTsApiService {

  /**
   * The HttpClient instance for making HTTP requests.
   */
  private mHttp: HttpClient | undefined;

  /**
   * Context string for error logging.
   */
  private mContext = 'AlphaTsApiService';

  /**
   * The URL endpoint for retrieving translation cache updates.
   */
  private _getTranslationCacheUpdateUrl: string | undefined;

  /**
   * The function used to retrieve translation cache updates.
   * Defaults to the built-in implementation.
   */
  private _getTranslationCacheUpdate = this.getTranslationCacheUpdateBuiltIn;

  /**
   * Error logging function. Can be injected via init().
   */
  private mPostErrorLog:
    (context: string, method: string, error: string) => any =
    () => {};

  /**
   * Initializes the service with the provided parameters.
   *
   * @param httpClient Optional Angular HttpClient for API calls.
   * @param getTranslationCacheUpdateUrl Optional URL for updating the translation cache.
   * @param postErrorLog Optional function for posting error logs.
   */
  init(
    httpClient?: HttpClient,
    getTranslationCacheUpdateUrl?: string,
    postErrorLog?: (context: string, method: string, error: string,) => any): void {
    if (httpClient) {
      this.mHttp = httpClient;
    }
    if (getTranslationCacheUpdateUrl) {
      this._getTranslationCacheUpdateUrl = getTranslationCacheUpdateUrl;
    }
    if (postErrorLog) {
      this.mPostErrorLog = postErrorLog;
    }
  }

  /**
   * Injects a custom method for retrieving translation cache updates from a remote source.
   * @param getTranslationCacheUpdate Function that returns an Observable of the updated cache or null.
   */
  useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
    Observable<IAlphaTranslationCache | null>): void {
    this._getTranslationCacheUpdate = getTranslationCacheUpdate;
  }

  /**
   * Retrieves the translation cache update using the configured update method.
   * @param lastUpdateDate The date of the last cache update.
   * @returns Observable emitting the updated cache or null if up to date.
   */
  getTranslationCacheUpdate(lastUpdateDate: Date):
    Observable<IAlphaTranslationCache | null> {
    return this._getTranslationCacheUpdate(lastUpdateDate);
  }

  /**
   * Built-in method for retrieving the translation cache update from the server.
   * If no endpoint or HttpClient is configured, returns the default cache.
   * @param lastUpdateDate The date of the last cache update.
   * @returns Observable emitting the updated cache or null if up to date.
   */
  private getTranslationCacheUpdateBuiltIn(lastUpdateDate: Date):
    Observable<IAlphaTranslationCache | null> {

    if (!this._getTranslationCacheUpdateUrl
      || this.mHttp === undefined) {
      return new Observable(
        (subscriber: Subscriber<IAlphaTranslationCache | null>) => {
          const tc =
            AlphaTranslationCache.default;
          subscriber.next(tc);
        });
    }

    const pDate = encodeURI(lastUpdateDate.toISOString());
    const url = this._getTranslationCacheUpdateUrl
      + `?clientDate=${pDate}`;
    return this.mHttp.get<any>(url)
      .pipe(
        map((hRes) => {
          if (hRes.data.isUpToDate) {
            return null;
          }
          const dsoTc = hRes.data.translationsCache;
          return AlphaTranslationCache.factorFromDso(dsoTc);
        }),
        catchError((error: HttpErrorResponse) => {
          this.mPostErrorLog(this.mContext, url, JSON.stringify(error));
          return throwError(() => error);
        }));
  }

}
