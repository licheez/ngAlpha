import {Injectable} from '@angular/core';
import {AlphaLsApiConfig} from "./alpha-ls-api-config";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

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
export class AlphaLsApiService {

  private _postNavigationLog = this.postNavigationLogBuiltIn;
  private _postErrorLog = this.postErrorLogBuiltIn;

  usePostNavigationLog(postNavigationLog: (path: string, title: string) => any) {
    this._postNavigationLog = postNavigationLog;
  }

  usePostErrorLog(postErrorLog: (context: string, method: string, error: string) => any) {
    this._postErrorLog = postErrorLog;
  }

  constructor(
    private mConfig: AlphaLsApiConfig,
    private mHttp: HttpClient) {
  }

  postNavigationLog(path: string, title: string): void {
    this._postNavigationLog(path, title);
  }

  private postNavigationLogBuiltIn(path: string, title: string): void {
    const url = this.mConfig.postNavigationLogUrl;
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

  postErrorLog(
    context: string,
    method: string,
    error: string): void {
    this._postErrorLog(context, method, error);
  }

  private postErrorLogBuiltIn(
    context: string,
    method: string,
    error: string): void {

    const url = this.mConfig.postErrorLogUrl;
    if (!url) {
      return;
    }
    const body = new UsoLog(context, method, error);

    const hdr = new HttpHeaders(
      {'Content-type': 'application/json'});

    const req = this.mHttp.post<any>(url, body,
      {headers: hdr})
      .pipe(
        catchError(
          (err: HttpErrorResponse) => {
            console.error(err);
            return throwError(() => err);
          }));
    req.subscribe();
  }

}
