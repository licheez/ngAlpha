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

  private mHttp: HttpClient | undefined;

  /**
   * Initialize the service with optional
   * error log and navigation log URLs.
   *
   * @param httpClient
   * @param {string} [postErrorLogUrl] - The URL to which error logs will be posted.
   * @param {string} [postNavigationLogUrl] - The URL to which navigation logs will be posted.
   *
   * @return {void}
   */
  init(httpClient: HttpClient,
       postErrorLogUrl?: string,
       postNavigationLogUrl?: string):void {
    this.mHttp = httpClient;
    this._postErrorLogUrl = postErrorLogUrl ?? null;
    this._postNavigationLogUrl = postNavigationLogUrl ?? null;
  }

  private _postNavigationLog = this.postNavigationLogBuiltIn;
  private _postNavigationLogUrl: string | null = null;
  /** Inject your own delegate for
   * posting navigation logs */
  usePostNavigationLog(
    postNavigationLog: (
      path: string, title: string) => any):void {
    this._postNavigationLog = postNavigationLog;
  }
  /**
   * Posts the navigation log for a specific path and title.
   *
   * @param {string} path - The path of the navigation.
   * @param {string} title - The title of the navigation.
   * @return {void}
   */
  postNavigationLog(path: string, title: string): void {
    this._postNavigationLog(path, title);
  }
  private postNavigationLogBuiltIn(path: string, title: string): void {
    const url = this._postNavigationLogUrl;
    if (!url || this.mHttp === undefined) {
      return;
    }
    const body = new UsoNavigationLog(path, title);
    const req = this.mHttp.post<any>(url, body)
      .pipe(
        catchError(
          (err: HttpErrorResponse) => {
            return throwError(() => err);
          }));
    req.subscribe({
      next: () => {},
      error: e => console.error(e)
    });
  }

  /** Inject your own delegate for posting errors */
  usePostErrorLog(
    postErrorLog: (
      context: string,
      method: string,
      error: string) => any): void {
    this._postErrorLog = postErrorLog;
  }
  private _postErrorLog = this.postErrorLogBuiltIn;
  private _postErrorLogUrl: string | null = null;

  /**
   * Posts an error log with the specified context, method, and error message.
   *
   * @param {string} context - The context in which the error occurred.
   * @param {string} method - The name of the method or function where the error occurred.
   * @param {string} error - The error message or description.
   * @return {void} - This method does not return a value.
   */
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

    const url = this._postErrorLogUrl;
    if (!url || this.mHttp === undefined) {
      return;
    }
    const body = new UsoLog(context, method, error);

    const req = this.mHttp.post<any>(url, body)
      .pipe(
        catchError(
          (err: HttpErrorResponse) => {
            return throwError(() => err);
          }));
    req.subscribe({
      next: () => {},
      error: e => console.error(e)
    });
  }

}
