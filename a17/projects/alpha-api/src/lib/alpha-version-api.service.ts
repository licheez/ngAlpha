import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IAlphaLoggerService, IAlphaVersionApiService} from "@pvway/alpha-common";
import {AlphaHttpObjectResult} from "@pvway/alpha-common";

@Injectable({
  providedIn: 'root'
})
export class AlphaVersionApiService
  implements IAlphaVersionApiService {

  private readonly mContext = "AlphaVersionApiService";
  private mUrl: string | undefined;
  private _getVersion = this.getVersionBuiltIn;
  private postErrorLog: (context: string, method: string, error: string) => any =
    () => {
    };

  constructor(
    private mHttp: HttpClient) {
  }

  /**
   * Initializes the application with the provided version URL and optional error logging function.
   *
   * @param {string} getVersionUrl - The URL to retrieve the version information from.
   * @param {IAlphaLoggerService} ls - The service for error logging (optional).
   * @return {void}
   */
  init(
    getVersionUrl: string,
    ls: IAlphaLoggerService):void {
    this.mUrl = getVersionUrl;
    this.postErrorLog = ls.postErrorLog;
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
    if (!this.mUrl) {
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
