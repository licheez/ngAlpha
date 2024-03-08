import {catchError, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

class UsoLog {
  context: string;
  method: string;
  error: string;

  constructor(
    context: string,
    method: string,
    error: string) {
    this.context = context;
    this.method = method;
    this.error = error;
  }
}

class UsoNavigationLog {
  clientReferrer: string;
  path: string;
  title: string;

  constructor(
    path: string,
    title: string) {
    this.clientReferrer = window.document.referrer;
    this.path = path;
    this.title = title;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AlphaLsService {

  constructor(
    private mHttp: HttpClient) {
  }

  init(postErrorLogUrl?: string,
       postNavigationLogUrl?: string) {
    this._postErrorLogUrl = postErrorLogUrl ?? null;
    this._postNavigationLogUrl = postNavigationLogUrl ?? null;
  }

  private _postNavigationLog = this.postNavigationLogBuiltIn;
  private _postNavigationLogUrl: string | null = null;
  usePostNavigationLog(postNavigationLog: (path: string, title: string) => any) {
    this._postNavigationLog = postNavigationLog;
  }
  postNavigationLog(path: string, title: string): void {
    this._postNavigationLog(path, title);
  }
  private postNavigationLogBuiltIn(path: string, title: string): void {
    const url = this._postNavigationLogUrl;
    if (!url) {
      return;
    }
    const body = new UsoNavigationLog(path, title);
    const req = this.mHttp.post<any>(url, body)
      .pipe(
        catchError(
          (err: HttpErrorResponse) => {
            console.error(err);
            return throwError(() => err);
          }));
    req.subscribe();
  }

  usePostErrorLog(postErrorLog: (context: string, method: string, error: string) => any) {
    this._postErrorLog = postErrorLog;
  }
  private _postErrorLog = this.postErrorLogBuiltIn;
  private _postErrorLogUrl: string | null = null;
  postErrorLog(context: string, method: string, error: string): void {
    this._postErrorLog(context, method, error);
  }
  private postErrorLogBuiltIn(
    context: string,
    method: string,
    error: string): void {

    const url = this._postErrorLogUrl;
    if (!url) {
      return;
    }
    const body = new UsoLog(context, method, error);

    const req = this.mHttp.post<any>(url, body)
      .pipe(
        catchError(
          (err: HttpErrorResponse) => {
            console.error(err);
            return throwError(() => err);
          }));
    req.subscribe();
  }

}
