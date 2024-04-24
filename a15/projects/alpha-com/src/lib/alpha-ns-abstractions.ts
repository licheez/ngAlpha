// noinspection JSUnusedGlobalSymbols

import {Router} from "@angular/router";
import {SafeResourceUrl} from "@angular/platform-browser";
import {IAlphaLoggerService} from "./alpha-ls-abstractions";
import {IAlphaLocalBusService} from "./alpha-lbs-abstractions";


/**
 * Represents a page within a module.
 * @interface
 */
export interface IAlphaPage {
  /** the route towards the parent (usually a module) */
  parentRoute: string;
  /** the route towards the page within a module */
  route: string;
  /** area can be used for grouping pages */
  area: string;
  /** technical (bread crumb) route for a given page */
  logRoute: string;
  /** functional name for a given page */
  logTitle: string;
}

export interface IAlphaNavigationService {

  /**
   * Initializes the service.
   *
   * @param {Router} router - The router object.
   * @param {IAlphaPage} homePage - The home page object.
   * @param {IAlphaLoggerService} [ls] - Optional logger service object.
   * @param {function(IAlphaPage): any} [notifyNavigation] - Optional callback function used to notify page navigation.
   * @return {void}
   */
  init(router: Router,
       homePage: IAlphaPage,
       ls?: IAlphaLoggerService,
       notifyNavigation?: (page: IAlphaPage) => any): void;

  /**
   * Returns a safe resource URL from the given data URL.
   *
   * @param {string} dataUrl - The data URL to be converted to a safe resource URL.
   * @returns {SafeResourceUrl} - The safe resource URL.
   */
  getSafeResourceUrl(dataUrl: string): SafeResourceUrl;

  /**
   * Reloads the current web page.
   *
   * @returns {void}
   */
  reload(): void;

  /**
   * Re-homes the application to the home page.
   * Calls the navigate method with the home page as the argument.
   */
  reHome(): void;

  /**
   * navigate to page and log pageNavigation to server
   * @param page
   * @param pageParams array of page params
   * @param queryParams an object with an entry pair for each query param
   */
  navigate(
    page: IAlphaPage,
    pageParams?: any[],
    queryParams?: any): void;

  /**
   * Opens the specified URL in a new tab.
   * @param {string} url - The URL to be opened.
   * @return {void}
   */
  openUrlInNewTab(url: string): void;

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
    queryParams?: any): void;

  /** replaces the queryParams in the URL
   * without reloading the page */
  replaceQueryParams(
    qParams: string,
    notify?: (qParams: string) => any): void;

  /**
   * Opens the given data URL in a new tab.
   *
   * @param {string} dataUrl - The data URL to open in a new tab.
   * @param {number} [sliceSize] - The optional slice size for converting the data URL to a blob. Defaults to undefined.
   * @return {void}
   */
  openDataUrlInNewTab(
    dataUrl: string, sliceSize?: number): void;

  /**
   * Download data from a specified URL.
   *
   * @param {string} dataUrl - The URL of the data to be downloaded.
   * @param {string} fileName - The name of the file to be saved.
   * @return {void}
   */
  downloadDataUrl(dataUrl: string, fileName: string): void;

}
