import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {HeaderComponent} from "./header/header.component";
import {DividerModule} from "primeng/divider";

import {AlphaLbsService} from "@pvway/alpha-lbs";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaNsService} from "@pvway/alpha-ns";
import {AlphaPrimeService} from "@pvway-dev/alpha-prime";
import {AlphaTsService} from "@pvway/alpha-ts";

import {AppSitemap} from "./app.sitemap";
import {IAlphaPage} from "@pvway/alpha-ns";
import {of} from "rxjs";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NgIf,
    HeaderComponent,
    DividerModule
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  static readonly PAGE_UPDATED = "PageUpdated";

  title = 'a17';
  ready = false;

  // LBS
  publish:
    (payload: any, channel: string) => number =
    (payload: any, channel: string) =>
      this.mLbs.publish(payload, channel);
  subscribe:
    (callback: (payload: any) => any, channel?: string) => number =
    (callback: (payload: any) => any, channel?: string) =>
      this.mLbs.subscribe(callback, channel);
  unsubscribe:
    (subscriptionId: number) => any =
    (subscriptionId: number) => this.unsubscribe(subscriptionId);

  // LS
  postErrorLog:
    (context: string, method: string, error: string) => any =
    (context: string, method: string, error: string) =>
      this.mLs.postErrorLog(context, method, error);
  postNavigationLog:
    (path: string, title: string) => any =
    (path: string, title: string) =>
      this.mLs.postNavigationLog(path, title);

  // TS
  getTr:
    (key: string, languageCode?: string) => string =
    (key: string, languageCode?: string) =>
      this.mTs.getTr(key, languageCode);

  constructor(
    private mRouter: Router,
    private mLbs: AlphaLbsService,
    private mLs: AlphaLsService,
    private mNs: AlphaNsService,
    private mPs: AlphaPrimeService,
    private mTs: AlphaTsService) { }

  ngOnInit() {
    this.ready = true;
    this.initAlpha();
  }

  initAlpha(): void {
    this.initLs();
    this.initNs();
    this.initPs();
  }

  initLs(): void {
    this.mLs.usePostErrorLog(
      (context: string, method: string, error: string) =>
        console.error(`Ls.LogErr: ${context}: ${method}: ${error}`)
    );
    this.mLs.usePostNavigationLog(
      (path: string, title: string) =>
        console.info(`Ls.LogNav: ${path}: ${title}`)
    );
  }

  initNs(): void {
    const notifyNavigation:
      (page: IAlphaPage) => any =
      (page: IAlphaPage) =>
        this.mLbs.publish(page, AppComponent.PAGE_UPDATED);

    this.mNs.init(
      this.mRouter, AppSitemap.welcome,
      this.postNavigationLog, notifyNavigation);
  }

  initPs():void {
    const ts = {
      getTr: this.getTr
    };
    const oas = {
      signIn: () => of(true)
    };
    const ls = {
      postNavigationLog: this.postNavigationLog
    };
    const uas = {
      upload:() => of('uploadId'),
      deleteUpload: () => of({})
    };
    const lbs = {
      publish: this.publish,
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe
    };
    this.mPs.init(
      false, ts, ls, oas, uas, lbs);
  }

}
