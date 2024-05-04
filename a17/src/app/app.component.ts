import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {HeaderComponent} from "./header/header.component";
import {DividerModule} from "primeng/divider";

import {AlphaLbsService} from "@pvway/alpha-lbs";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaNsService} from "@pvway/alpha-ns";

import {AppSitemap} from "./app.sitemap";
import {IAlphaPage} from "@pvway/alpha-ns";

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

  // LS
  postErrorLog:
    (context: string, method: string, error: string) => any =
    (context: string, method: string, error: string) =>
      this.mLs.postErrorLog(context, method, error);
  postNavigationLog:
    (path: string, title: string) => any =
    (path: string, title: string) =>
      this.mLs.postNavigationLog(path, title);

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

  constructor(
    private mRouter: Router,
    private mLbs: AlphaLbsService,
    private mLs: AlphaLsService,
    private mNs: AlphaNsService
  ) { }

  ngOnInit() {
    this.ready = true;
    this.initAlpha();
  }

  initAlpha(): void {
    this.initLs();
    this.initNs();
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

}
