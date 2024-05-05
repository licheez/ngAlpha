import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlphaEmsService {

  authorize: (httpRequest: Observable<any>) => Observable<any> =
    (httpRequest: Observable<any>) => httpRequest;
  postErrorLog: (context: string, method: string, error: string) => any =
    () => {};
  publish: (payload: any, channel: string) => any =
    () => {};

  init(
    authorize?: (httpRequest: Observable<any>) => Observable<any>,
    postErrorLog?: (context: string, method: string, error: string) => any,
    publish?: (payload: any, channel: string) => any): void {
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
