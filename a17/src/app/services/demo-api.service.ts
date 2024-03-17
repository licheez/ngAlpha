import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaOasService} from "../../../projects/alpha-oas/src/lib/alpha-oas.service";

@Injectable({
  providedIn: 'root'
})
export class DemoApiService {

  private mContext = 'DemoApiService';

  constructor(
    private mLs: AlphaLsService,
    private mOas: AlphaOasService,
    private mHttp: HttpClient) { }

  // Authenticated method retrieving the main account balance
  getMainAccountBalance(): Observable<number> {
    const url = environment.apiHost + '/Accounts/GetMainAccountBalance';
    const call = this.mHttp.get<number>(url)
      .pipe(
        catchError((error: HttpErrorResponse)=> {
          this.mLs.postErrorLog(this.mContext, 'getMainAccountBalance',
            JSON.stringify(error));
          return throwError(() => error)
        }));
    return this.mOas.authorize(call);
  }

}
