import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlphaHttpObjectResult} from "../http/alpha-http-result";

@Injectable({
  providedIn: 'root'
})
export class AlphaVersionApiService {

  private mHttp: HttpClient | undefined;
  private readonly mContext = "AlphaVersionApiService";
  private mUrl: string | undefined;
  private _getVersion = this.getVersionBuiltIn;
  private postErrorLog: (context: string, method: string, error: string) => any =
    () => {
    };

  /**
   * Initializes the application with the provided version URL and optional error logging function.
   *
   * @param httpClient
   * @param {string} getVersionUrl - The URL to retrieve the version information from.
   * @param postErrorLog
   * @return {void}
   */
  init(
    httpClient: HttpClient,
    getVersionUrl: string,
    postErrorLog: (context: string, method: string, error: string) => any):void {
    this.mHttp = httpClient;
    this.mUrl = getVersionUrl;
    this.postErrorLog = postErrorLog;
  }

  /** Inject your own getVersion method  */
  useGetVersion(getVersion: () => Observable<string>): void {
    this._getVersion = getVersion;
  }

  /**
   * Retrieves the version number from a source.
   * @returns {Observable<string | null>} An observable that emits the version number as a string or null if not available.
   */
  getVersion(): Observable<string | null> {
    return this._getVersion()
  }

  private getVersionBuiltIn(): Observable<string> {
    if (!this.mUrl || this.mHttp === undefined) {
      return of('');
    }
    return this.mHttp.get<any>(this.mUrl)
      .pipe(
        map(dso =>
          AlphaHttpObjectResult.isObjectResult(dso)
            ? AlphaHttpObjectResult
              .factorFromDso<string>(dso).data
            : dso as string),
        catchError((error: HttpErrorResponse) => {
          this.postErrorLog(this.mContext, this.mUrl!, JSON.stringify(error));
          return throwError(() => error);
        }));
  }

}
