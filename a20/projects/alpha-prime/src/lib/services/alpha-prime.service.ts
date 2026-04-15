import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeService {

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
  unsubscribe: (
    id: number) => any = () => {
  };

  /**
   * Initializes the service.
   *
   * @param {boolean} isProduction - A flag indicating if the application is running in production mode.
   * @param translationService
   * @param loggerService
   * @param oAuthService
   * @param uploadService
   * @param localBusService
   * @return {void}
   */
  init(
    isProduction: boolean,
    translationService: {
      getTr: (
        key: string,
        languageCode?: string) => string
    },
    loggerService?: {
      postNavigationLog: (
        path: string,
        title: string) => any
    },
    oAuthService?: {
      signIn: (
        username: string,
        password: string,
        rememberMe: boolean) => Observable<boolean>
    },
    uploadService?: {
      upload: (
        data: any,
        notifyProgress: (progress: number) => any) => Observable<string>,
      deleteUpload: (
        uploadId: string) => Observable<any>
    },
    localBusService?: {
      publish: (
        payload: any,
        channel: string) => number,
      subscribe: (
        callback: (payload: any) => any,
        channel?: string) => number,
      unsubscribe: (
        id: number) => any
    }): void {
    this.isProduction = isProduction;
    this.getTr = translationService.getTr;
    if (loggerService) {
      this.addLoggerService(
        loggerService.postNavigationLog)
    }
    if (oAuthService) {
      this.addOAuthService(oAuthService.signIn);
    }
    if (uploadService) {
      this.addUploadService(
        uploadService.upload,
        uploadService.deleteUpload);
    }
    if (localBusService) {
      this.addLocalBusService(
        localBusService.publish,
        localBusService.subscribe,
        localBusService.unsubscribe);
    }
  }

  addLoggerService(postNavigationLog: (
    path: string,
    title: string) => any): void {
    this.postNavigationLog = postNavigationLog;
  }

  addOAuthService(
    signIn: (
      username: string,
      password: string,
      rememberMe: boolean) => Observable<boolean>) {
    this.signIn = signIn;
  }

  addUploadService(
    upload: (
      data: any,
      notifyProgress: (progress: number) => any) => Observable<string>,
    deleteUpload: (
      uploadId: string) => Observable<any>): void {
    this.upload = upload;
    this.deleteUpload = deleteUpload;
  }

  addLocalBusService(
    publish: (
      payload: any,
      channel: string) => number,
    subscribe: (
      callback: (payload: any) => any,
      channel?: string) => number,
    unsubscribe: (
      id: number) => any): void {
    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
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
