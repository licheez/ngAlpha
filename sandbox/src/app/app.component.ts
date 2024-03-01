import {Component, OnInit} from '@angular/core';
import {AlphaLsApiService} from "../../projects/alpha-ls-api/src/lib/alpha-ls-api.service";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";

interface IUserInfo {

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sandbox';

  constructor(
    private mLs: AlphaLsApiService,
    private mHttpClient: HttpClient) {  }

  ngOnInit() {

    this.mLs.usePostErrorLog(
      (context, method, error) => {

        // configure the url to call
        const url = environment.apiHost + '/alphaLogger/logError';

        // add the userId field
        const userId = this.getUserId();

        // call the server end point that accepts a four field body
        return this.mHttpClient.post(
            url, {userId, context, method, error}).subscribe();
      });
  }

  private getUserId(): string { return 'someUserId'; }

}
