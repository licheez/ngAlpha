import {Injectable} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {Observable, of} from "rxjs";

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

  /** UploadApiService */
  uas: {
    upload: (
      data: any,
      notifyProgress: (progress: number) => any) => Observable<string>,
    deleteUpload: (uploadId: string) => Observable<any>
  } = {
    upload: () => of(''),
    deleteUpload: () => of({})
  };

  /** LocalBusService*/
  lbs: {
    subscribe: (callback: (payload: any) => any, channel: string) => number,
    unSubscribe: (subId: number) => any
  } = {
    subscribe: () => -1,
    unSubscribe: () => {
    }
  };

  /**
   * Initializes the application.
   *
   * @param {DialogService} ds - The dialog service used for displaying dialogs.
   * @param {(path: string, title: string) => any} postNavigationLog - The function used for logging navigation.
   * @param {(key: string, languageCode?: string) => string} getTranslation - The function used for retrieving translations.
   * @param {boolean} isProduction - A flag indicating if the application is running in production mode.
   * @param {object} uas - UploadApiService containing upload and deleteUpload methods.
   *   @param {(data: any, notifyProgress: (progress: number) => any) => Observable<string>} uas.upload - The method used for uploading data with progress notification.
   *   @param {(uploadId: string) => Observable<any>} uas.deleteUpload - The method used for deleting an upload by its ID.
   * @param {object} lbs - LocalBusService containing subscribe and unSubscribe methods.
   *   @param {(callback: (payload: any) => any, channel: string) => number} lbs.subscribe - The method used for subscribing to a channel and receiving callback notifications.
   *   @param {(subId: number) => any} lbs.unSubscribe - The method used for unsubscribing from a channel using its subscription ID.
   * @param {string} modalStyleClass - The CSS class to be applied to modal dialogs.
   * @return {void}
   */
  init(
    ds: DialogService,
    postNavigationLog: (path: string, title: string) => any,
    getTranslation: (key: string, languageCode?: string) => string,
    isProduction: boolean,
    uas?: {
      upload: (
        data: any,
        notifyProgress: (progress: number) => any) => Observable<string>,
      deleteUpload: (uploadId: string) => Observable<any>,
    },
    lbs?: {
      subscribe: (callback: (payload: any) => any, channel: string) => number,
      unSubscribe: (subId: number) => any
    }
    ,
    modalStyleClass?: string): void {
    this.ds = ds;
    this.postNavigationLog = postNavigationLog;
    this.getTr = getTranslation;
    this.isProduction = isProduction;
    if (uas) {
      this.uas = uas;
    }
    if (lbs) {
      this.lbs = lbs
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
