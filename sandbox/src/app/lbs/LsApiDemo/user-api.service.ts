import { Injectable } from '@angular/core';
import {AlphaLsApiService} from "@pvway/alpha-ls-api";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";

interface IUserInfo {
  // some useful fields
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private mLs: AlphaLsApiService,
    private mHttp: HttpClient) { }

  getCurrentUserInfo(): Observable<IUserInfo>{
    const url = environment.apiHost + '/user/getCurrentUserInfo';
    return this.mHttp.get<IUserInfo>(url)
      .pipe(
        catchError(
          (error: HttpErrorResponse) => {
            this.mLs.postErrorLog(
              UserApiService.name, 'getCurrentUserInfo',
              JSON.stringify(error));
            return throwError(() => error);
          }));
  }

}
