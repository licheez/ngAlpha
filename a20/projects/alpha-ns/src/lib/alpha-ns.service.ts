import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router, UrlTree} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {IAlphaPage, AlphaPage} from "./alpha-page";
import {AlphaNsUtils} from "./alpha-ns-utils";

/**
 * AlphaNsService provides navigation, URL manipulation, and browser interaction utilities for Alpha applications.
 *
 * Features:
 * - Navigation to pages and tabs using Angular Router
 * - Query parameter replacement without reload
 * - Safe resource URL generation
 * - Data URL and Blob handling for downloads and previews
 * - Testable browser API usage via injected window and URL factory
 *
 * Usage:
 * Call `init()` to configure router, homepage, logging, and optionally inject window and URL factory for testing.
 * All browser interactions use injected dependencies for testability.
 */
@Injectable({
  providedIn: 'root'
})
export class AlphaNsService {
  private _router!: Router;
  private _homePage!: IAlphaPage;
  private _postNavigationLog: (path: string, title: string) => any = () => {
  };
  private _notifyNavigation: (page: IAlphaPage) => any = () => {
  };

  private _window: Window = window;
  private _urlFactory: { createObjectURL: (blob: Blob) => string } = URL;

  /**
   * Constructs AlphaNsService with Angular Location and DomSanitizer.
   *
   * @param mLocation Angular Location service for browser URL/history manipulation.
   * @param mSan Angular DomSanitizer for safe resource URLs.
   */
  constructor(
    private mLocation: Location,
    private mSan: DomSanitizer) {
  }

  /**
   * Initializes the service with router, homepage, logging, navigation notification, and optionally window and URL factory for testability.
   *
   * @param router Angular Router for navigation.
   * @param homePage The application's homepage.
   * @param postNavigationLog Callback for logging navigation events.
   * @param notifyNavigation Optional callback for navigation notifications.
   * @param windowRef Optional Window object for testability (defaults to global window).
   * @param urlFactory Optional URL factory for testability (defaults to global URL).
   */
  init(
    router: Router,
    homePage: IAlphaPage,
    postNavigationLog?: (path: string, title: string) => any,
    notifyNavigation?: (page: IAlphaPage) => any,
    windowRef?: Window,
    urlFactory?: { createObjectURL: (blob: Blob) => string }
  ): void {
    this._router = router;
    this._homePage = homePage;
    if (postNavigationLog) {
      this._postNavigationLog = postNavigationLog;
    }
    if (notifyNavigation) {
      this._notifyNavigation = notifyNavigation;
    }
    this._window = windowRef ?? window;
    this._urlFactory = urlFactory ?? URL;
  }

  /**
   * Returns a SafeResourceUrl for a given data URL, bypassing Angular's security checks.
   *
   * @param dataUrl The data URL to sanitize.
   * @returns SafeResourceUrl for use in templates.
   */
  getSafeResourceUrl(dataUrl: string): SafeResourceUrl {
    return this.mSan.bypassSecurityTrustResourceUrl(dataUrl);
  }

  /**
   * Reloads the current browser page using the injected window object.
   */
  reload(): void {
    this._window.location.reload();
  }

  /**
   * Navigates to the configured home page.
   */
  reHome(): void {
    this.navigate(this._homePage);
  }

  /**
   * Redirects to a page if shouldRedirect returns true.
   *
   * @param shouldRedirect Function returning true if redirect should occur.
   * @param redirectToPage Optional page to redirect to (defaults to home page).
   */
  guard(
    shouldRedirect: () => boolean,
    redirectToPage?: IAlphaPage
  ): void {
    if (shouldRedirect()) {
      this.navigate(redirectToPage ?? this._homePage);
    }
  }

  /**
   * Navigates to a page and logs the navigation event.
   *
   * @param page Target page to navigate to.
   * @param pageParams Optional array of page parameters.
   * @param queryParams Optional query parameters object.
   */
  navigate(
    page: IAlphaPage,
    pageParams?: any[],
    queryParams?: any
  ): void {
    const pi = this.getPageInfo(page, pageParams);
    this._postNavigationLog(pi.statsPath, pi.statsTitle);
    if (queryParams) {
      this._router.navigate(pi.commands, {queryParams})
        .then(() => {
          this._notifyNavigation(page);
        });
    } else {
      this._router.navigate(pi.commands)
        .then(() => {
          this._notifyNavigation(page);
        });
    }
  }

  /**
   * Opens a URL in a new browser tab using the injected window object.
   *
   * @param url The URL to open.
   */
  openUrlInNewTab(url: string): void {
    this._window.open(url, '_blank');
  }

  /**
   * Navigates to a page in a new browser tab, constructing the URL using Angular Router.
   *
   * @param rootUrl The root URL of the application.
   * @param page Target page to navigate to.
   * @param pageParams Optional array of page parameters.
   * @param queryParams Optional query parameters object.
   */
  navigateToNewTab(
    rootUrl: string,
    page: IAlphaPage,
    pageParams?: any[],
    queryParams?: any): void {
    const pi = this.getPageInfo(page, pageParams);
    this._postNavigationLog(pi.statsPath, pi.statsTitle);
    let urlTree: UrlTree;
    if (queryParams) {
      urlTree = this._router.createUrlTree(pi.commands, {queryParams})
    } else {
      urlTree = this._router.createUrlTree(pi.commands);
    }
    const url = rootUrl + '/#' + urlTree.toString();
    this._window.open(url, '_blank');
  }

  /**
   * Replaces the query parameters in the current URL without reloading the page.
   *
   * @param qParams Query string to set (e.g., '?foo=bar').
   * @param notify Optional callback invoked after replacement.
   */
  replaceQueryParams(
    qParams: string,
    notify?: (qParams: string) => any): void {
    const hash = this._window.location.hash;
    const qmPos = hash.indexOf('?');
    const path = qmPos < 0
      ? hash.substring(1)
      : hash.substring(1, qmPos);
    this.mLocation.replaceState(path, qParams);
    if (notify) {
      setTimeout(() => notify(qParams), 10);
    }
  }

  /**
   * Converts a data URL to a Blob and opens it in a new tab for preview/download.
   *
   * @param dataUrl The data URL to convert and open.
   * @param sliceSize Optional slice size for Blob conversion.
   */
  openDataUrlInNewTab(
    dataUrl: string, sliceSize?: number): void {
    const blob = AlphaNsUtils.dataUrlToBlob(dataUrl, sliceSize);
    const blobUrl = this._urlFactory.createObjectURL(blob);
    this._window.open(blobUrl, '_blank');
  }

  /**
   * Initiates a download of the provided data URL as a file using an anchor element.
   *
   * @param dataUrl The data URL to download.
   * @param fileName The filename for the downloaded file.
   */
  downloadDataUrl(dataUrl: string, fileName: string): void {
    const link =
      this._window.document.createElement('a') as HTMLAnchorElement;
    link.download = fileName;
    link.href = dataUrl!;
    this._window.document.body.appendChild(link);
    link.click();
    this._window.document.body.removeChild(link);
  }

  /**
   * Returns a PageInfo object for the given page and parameters.
   *
   * @param pc The page configuration.
   * @param pageParams Optional array of page parameters.
   * @returns PageInfo instance with route and stats info.
   */
  private getPageInfo(
    pc: IAlphaPage,
    pageParams?: string[]
  ) {
    return new PageInfo(pc, pageParams);
  }
}

/**
 * PageInfo encapsulates route and logging information for a page.
 */
class PageInfo {
  route: string;
  params: string[] | undefined;
  private readonly _statsPath: string;
  get statsPath(): string {
    if (!this.params) {
      return this._statsPath;
    }
    let res = this._statsPath;
    this.params.forEach(param => res += '/' + param);
    return res;
  }

  statsTitle: string;

  get commands(): any[] {
    return this.params
      ? [this.route].concat(this.params)
      : [this.route];
  }

  /**
   * Constructs a PageInfo instance.
   *
   * @param pc The AlphaPage configuration.
   * @param params Optional array of page parameters.
   */
  constructor(
    pc: AlphaPage,
    params?: string[]
  ) {
    this.route = pc.parentRoute + pc.route;
    this.params = params;
    this._statsPath = pc.logRoute;
    this.statsTitle = pc.logTitle;
  }
}
