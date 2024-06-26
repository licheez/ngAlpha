import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router, UrlTree} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {IAlphaPage, AlphaPage} from "./alpha-page";
import {AlphaNsUtils} from "./alpha-ns-utils";



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

  constructor(
    private mLocation: Location,
    private mSan: DomSanitizer) {
  }

  /**
   * Initializes the application with the provided router, homepage, logger service, and navigation notification callback.
   *
   * @param {Router} router - The router object to be used for navigation.
   * @param {IAlphaPage} homePage - The homepage of the application.
   * @param {Function} postNavigationLog - A function that logs the navigation event.
   * @param {Function} [notifyNavigation] - Optional callback function to be called when a navigation event occurs.
   * @return {void}
   */
  init(router: Router,
       homePage: IAlphaPage,
       postNavigationLog?: (path: string, title: string) => any,
       notifyNavigation?: (page: IAlphaPage) => any): void {
    this._router = router;
    this._homePage = homePage;
    if (postNavigationLog) {
      this._postNavigationLog =postNavigationLog;
    }
    if (notifyNavigation) {
      this._notifyNavigation = notifyNavigation;
    }
  }

  /**
   * Returns a safe resource URL from the given data URL.
   *
   * @param {string} dataUrl - The data URL to be converted to a safe resource URL.
   * @returns {SafeResourceUrl} - The safe resource URL.
   */
  getSafeResourceUrl(dataUrl: string): SafeResourceUrl {
    return this.mSan.bypassSecurityTrustResourceUrl(dataUrl);
  }

  /**
   * Reloads the current web page.
   *
   * @returns {void}
   */
  reload(): void {
    window.location.reload();
  }

  /**
   * Re-homes the application to the home page.
   * Calls the navigate method with the home page as the argument.
   */
  reHome(): void {
    console.log('re-homing');
    this.navigate(this._homePage);
  }

  /**
   * navigate to page and log pageNavigation to server
   * @param page
   * @param pageParams array of page params
   * @param queryParams an object with an entry pair for each query param
   */
  navigate(
    page: IAlphaPage,
    pageParams?: any[],
    queryParams?: any): void {

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
   * Opens the specified URL in a new tab.
   * @param {string} url - The URL to be opened.
   * @return {void}
   */
  openUrlInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Navigates to a new tab with the specified URL.
   *
   * @param {string} rootUrl - The root URL of the application.
   * @param {IAlphaPage} page - The target page to navigate to.
   * @param {any[]} [pageParams] - Optional parameters for the target page.
   * @param {any} [queryParams] - Optional query parameters for the URL.
   * @returns {void}
   */
  navigateToNewTab(
    rootUrl: string,
    page: IAlphaPage,
    pageParams?: any[],
    queryParams?: any): void {

    // navigate to new tab only works when
    // routeModule is configured for using hash
    // app.module.ts
    // RouterModule.forRoot(routes, {useHash: true})

    const pi = this.getPageInfo(page, pageParams);
    this._postNavigationLog(pi.statsPath, pi.statsTitle);
    let urlTree: UrlTree;
    if (queryParams) {
      urlTree = this._router.createUrlTree(pi.commands, {queryParams})
    } else {
      urlTree = this._router.createUrlTree(pi.commands);
    }
    const url = rootUrl + '/#' + urlTree.toString();
    window.open(url, '_blank');
  }

  /** replaces the queryParams in the URL
   * without reloading the page */
  replaceQueryParams(
    qParams: string,
    notify?: (qParams: string) => any): void {
    const hash = window.location.hash;
    const qmPos = hash.indexOf('?');
    const path = qmPos < 0
      ? hash.substring(1)
      : hash.substring(1, qmPos);
    // console.log(path);
    this.mLocation.replaceState(path, qParams);
    if (notify) {
      setTimeout(() => notify(qParams), 10);
    }
  }

  /**
   * Opens the given data URL in a new tab.
   *
   * @param {string} dataUrl - The data URL to open in a new tab.
   * @param {number} [sliceSize] - The optional slice size for converting the data URL to a blob. Defaults to undefined.
   * @return {void}
   */
  openDataUrlInNewTab(
    dataUrl: string, sliceSize?: number): void {
    const blob = AlphaNsUtils.dataUrlToBlob(dataUrl, sliceSize);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  /**
   * Download data from a specified URL.
   *
   * @param {string} dataUrl - The URL of the data to be downloaded.
   * @param {string} fileName - The name of the file to be saved.
   * @return {void}
   */
  downloadDataUrl(dataUrl: string, fileName: string): void {
    const link = document.createElement("a") as HTMLAnchorElement;
    link.download = fileName;
    link.href = dataUrl!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getPageInfo(
    pc: IAlphaPage,
    pageParams?: string[]) {
    return new PageInfo(pc, pageParams);
  }

}

class PageInfo {
  route: string;
  params: string[] | undefined;
  private readonly _statsPath: string;
  get statsPath(): string {
    if (!this.params) {
      return this._statsPath;
    }
    let res = this._statsPath;
    this.params.forEach(
      param => res += '/' + param);
    return res;
  }

  statsTitle: string;

  get commands(): any[] {
    return this.params
      ? [this.route].concat(this.params)
      : [this.route];
  }

  constructor(
    pc: AlphaPage,
    params?: string[]) {
    this.route = pc.parentRoute + pc.route;
    this.params = params;
    this._statsPath = pc.logRoute;
    this.statsTitle = pc.logTitle;
  }
}
