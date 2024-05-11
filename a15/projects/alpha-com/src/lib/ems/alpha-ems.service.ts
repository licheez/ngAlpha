import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AlphaEmsService {

  private _httpClient: HttpClient | undefined;
  /**
   * Returns the instance of HttpClient.
   * @throws {Error} - Error message "AlphaEmsService is not initialized"
   * @returns {HttpClient} - The instance of HttpClient
   */
  get httpClient(): HttpClient {
    if (!this._httpClient) {
      throw new Error('AlphaEmsService is not initialized');
    }
    return this._httpClient;
  }
  authorize: (httpRequest: Observable<any>) => Observable<any> =
    (httpRequest: Observable<any>) => httpRequest;
  postErrorLog: (context: string, method: string, error: string) => any =
    () => {
    };
  publish: (payload: any, channel: string) => any =
    () => {
    };

  init(
    httpClient: HttpClient,
    authorize?: (httpRequest: Observable<any>) => Observable<any>,
    postErrorLog?: (context: string, method: string, error: string) => any,
    publish?: (payload: any, channel: string) => any): void {

    this._httpClient = httpClient;

    if (authorize) {
      this.authorize = authorize;
    }
    if (postErrorLog) {
      this.postErrorLog = postErrorLog;
    }
    if (publish) {
      this.publish = publish;
    }
  }
}
