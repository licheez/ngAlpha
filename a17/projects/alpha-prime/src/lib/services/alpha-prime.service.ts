import {Injectable} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {Observable, of} from "rxjs";
import {
  IAlphaLocalBusService, IAlphaLoggerService,
  IAlphaOAuthService,
  IAlphaTranslationService,
  IAlphaUploadApiService
} from "@pvway/alpha-common";

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeService {

  modalStyleClass: string | undefined;
  ds!: DialogService;
  postNavigationLog: (path: string, title: string) => any =
    () => {
    };

  getTr: (key: string, languageCode?: string) => string =
    (key, languageCode) => `'${key}':'${languageCode}'`;

  isProduction!: boolean;

  /** OAuthService */
  signIn: (
    username: string,
    password: string,
    rememberMe: boolean) => Observable<boolean> = () => of(false);

  /** UploadApiService */
  upload: (
    data: any,
    notifyProgress: (progress: number) => any) => Observable<string> =
    () => of('');
  deleteUpload: (
    uploadId: string) => Observable<any> =
    () => of({});

  /** LocalBusService*/
  publish: (
    payload: any,
    channel: string) => number =
    () => 0;
  subscribe: (
    callback: (payload: any) => any,
    channel?: string) => number
    = () => -1;
  unsubscribe:(
    id: number) => any = () => {};

  /**
   * Initializes the service.
   *
   * @param {DialogService} ds - The dialog service used for displaying dialogs.
   * @param {boolean} isProduction - A flag indicating if the application is running in production mode.   *
   * @param {IAlphaTranslationService} ts - AlphaTranslationService
   * @param {IAlphaLoggerService} ls - (optional) AlphaLoggerService
   * @param {IAlphaOAuthService} oas - (optional) OAuthService containing signIn method
   * @param {IAlphaUploadApiService} uas - (optional) UploadApiService containing upload and deleteUpload methods.
   * @param {IAlphaLocalBusService} lbs - (optional) LocalBusService containing subscribe and unSubscribe methods.
   * @param {string} modalStyleClass - (optional) The CSS class to be applied to modal dialogs.
   * @return {void}
   */
  init(
    ds: DialogService,
    isProduction: boolean,
    ts: IAlphaTranslationService,
    ls?: IAlphaLoggerService,
    oas?: IAlphaOAuthService,
    uas?: IAlphaUploadApiService,
    lbs?: IAlphaLocalBusService,
    modalStyleClass?: string): void {
    this.ds = ds;
    this.isProduction = isProduction;
    this.getTr = ts.getTr;
    if (ls) {
      this.postNavigationLog = ls.postNavigationLog;
    }
    if (oas) {
      this.signIn = oas.signIn;
    }
    if (uas) {
      this.upload = uas.upload;
      this.deleteUpload = uas.deleteUpload;
    }
    if (lbs) {
      this.publish = lbs.publish;
      this.subscribe = lbs.subscribe;
      this.unsubscribe = lbs.unsubscribe;
    }
    this.modalStyleClass = modalStyleClass;
  }

  generateRandomName(len?: number): string {
    if (!len) {
      len = 50;
    }
    let result: string = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charsLen = chars.length;
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLen));
    }
    return result;
  }

}
