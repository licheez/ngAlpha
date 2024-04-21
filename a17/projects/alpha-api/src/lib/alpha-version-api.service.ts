import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from "rxjs";
import {AlphaHttpObjectResult} from "./alpha-http-result";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AlphaVersionApiService {

  private readonly mContext = "AlphaVersionApiService";
  private mUrl: string | undefined;
  private _getVersion = this.getVersionBuiltIn;
  private postErrorLog: (context: string, method: string, error: string) => any =
    () => {
    };

  constructor(
    private mHttp: HttpClient) {
  }

  init(
    getVersionUrl: string,
    postErrorLog?: (context: string, method: string, error: string) => any) {
    this.mUrl = getVersionUrl;
    if (postErrorLog) {
      this.postErrorLog = postErrorLog;
    }
  }

  useGetVersion(getVersion: () => Observable<string>): void {
    this._getVersion = getVersion;
  }

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
