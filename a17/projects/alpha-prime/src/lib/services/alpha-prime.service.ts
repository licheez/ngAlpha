import { Injectable } from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeService {

  modalStyleClass: string | undefined;
  ds!: DialogService;
  postNavigationLog: (path: string, title: string) => any =
    () => {};
  getTr: (key: string, languageCode?: string) => string =
    (key, languageCode) => `'${key}':'${languageCode}'`;
  isProduction!:boolean;
  upload: (data: any, notifyProgress: (progress: number) => any)
    => Observable<string> = () => of('');
  deleteUpload: (uploadId: string) => Observable<any> = () => of({});

  init(
    ds: DialogService,
    postNavigationLog: (path: string, title: string) => any,
    getTranslation: (key: string, languageCode?: string) => string,
    isProduction: boolean,
    upload?: (
      data: any,
      notifyProgress: (progress: number) => any) => Observable<string>,
    deleteUpload?: (uploadId: string) => Observable<any>,
    modalStyleClass?: string): void {
    this.ds = ds;
    this.postNavigationLog = postNavigationLog;
    this.getTr = getTranslation;
    this.isProduction = isProduction;
    if (upload){
      this.upload = upload;
    }
    if (deleteUpload){
      this.deleteUpload = deleteUpload;
    }
    this.modalStyleClass = modalStyleClass;
  }

  generateRandomName(len?: number):string{
    if(!len){
      len = 50;
    }
    let result: string = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charsLen = chars.length;
    for ( let i = 0; i < len; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charsLen));
    }
    return result;
  }

}
