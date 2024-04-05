import { Injectable } from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";

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

  init(
    ds: DialogService,
    postNavigationLog: (path: string, title: string) => any,
    getTranslation: (key: string, languageCode?: string) => string,
    isProduction: boolean,
    modalStyleClass?: string): void {
    this.ds = ds;
    this.postNavigationLog = postNavigationLog;
    this.getTr = getTranslation;
    this.modalStyleClass = modalStyleClass;
    this.isProduction = isProduction;
  }

}
