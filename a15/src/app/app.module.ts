import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LbsComponent } from './demos/lbs/lbs.component';
import { LsComponent } from './demos/ls/ls.component';

@NgModule({
  declarations: [
    AppComponent,
    LbsComponent,
    LsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
