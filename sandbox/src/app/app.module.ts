import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LbsDemoComponent} from './lbs/lbs-demo/lbs-demo.component';
import {AlphaLsApiModule} from "@pvway/alpha-ls-api";
import {IAlphaLsApiConfig} from "@pvway/alpha-ls-api/lib/alpha-ls-api-config";
import {environment} from "../environments/environment";

const alphaLsApiConfig: IAlphaLsApiConfig = {
  postNavigationLogUrl: environment.apiHost + '/alphaLs/navLog',
  postErrorLogUrl: environment.apiHost + '/alphaLs/errLog'
}

@NgModule({
  declarations: [
    AppComponent,
    LbsDemoComponent
  ],
  imports: [
    BrowserModule,
    AlphaLsApiModule.forRoot(alphaLsApiConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
