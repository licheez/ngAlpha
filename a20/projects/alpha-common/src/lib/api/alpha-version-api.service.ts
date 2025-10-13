import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AlphaHttpObjectResult} from "../http/alpha-http-result";

/**
 * Service for retrieving application version information from a remote endpoint.
 * Supports custom version retrieval logic and error logging.
 * Designed for use with Angular HttpClient and RxJS.
 */
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
   * Initializes the service with required dependencies and configuration.
   *
   * @param httpClient - Angular HttpClient instance for HTTP requests.
   * @param getVersionUrl - The endpoint URL to retrieve version information.
   * @param postErrorLog - Function to log errors (context, method, error).
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
  /**
   * Injects a custom getVersion implementation.
   *
   * @param getVersion - Function returning an Observable emitting the version string.
   */
  useGetVersion(getVersion: () => Observable<string>): void {
    this._getVersion = getVersion;
  }

  /**
   * Retrieves the version number using the configured logic.
   * Emits the version string, or null/empty string if not available.
   *
   * @returns Observable emitting the version string or null.
   */
  getVersion(): Observable<string | null> {
    return this._getVersion()
  }

  /**
   * Default implementation for retrieving the version from the configured URL.
   * Emits the version string or an empty string if not initialized.
   * Logs errors using the provided error logger.
   *
   * @returns Observable emitting the version string or an empty string.
   */
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
