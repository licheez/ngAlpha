import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable, Subscriber } from 'rxjs';
import {AlphaPrimeService} from "./alpha-prime.service";
import {IAlphaLoggerService} from "@pvway/alpha-common";

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeModalService {

  constructor(private mPs: AlphaPrimeService) {
  }
  /**
   * Initializes the dialog service.
   *
   * @param {DialogService} ds - The DialogService object to be initialized.
   * @param {DialogService} ls - The Alpha Logger Service
   * @param {string} [modalStyleClass] - Optional. The CSS class to be applied to the modals created by the DialogService.
   * @return {void}
   * @deprecated please use the AlphaPrimeService init method for initializing this service
   */
  init(
    ds: DialogService,
    ls: IAlphaLoggerService,
    modalStyleClass?: string): void {
    this.mPs.ds = ds;
    this.mPs.postNavigationLog = ls.postNavigationLog;
    this.mPs.modalStyleClass = modalStyleClass;
  }

  /**
   * Opens a modal dialog.
   *
   * @template T - The type of the component to be opened in the modal.
   *
   * @param {Type<T>} component - The component to be opened in the modal.
   * @param {string} anchor - The name of the component calling the openModal method.
   * @param {string} modal - The name of the modal.
   * @param {DynamicDialogConfig} [ddc] - Optional configuration for the modal dialog.
   *
   * @return {Observable<T>} - An Observable that emits an instance of the opened component when the modal is displayed.
   *                           If an error occurs during the opening of the modal, the Observable will emit an error instead.
   */
  openModal<T>(
    component: Type<T>,
    anchor: string,
    modal: string,
    ddc?: DynamicDialogConfig): Observable<T> {

    return new Observable(
      (subscriber: Subscriber<T>) => {

        if (!this.mPs.ds){
          subscriber.error('AlphaPrimeModalService is not initialized');
          return;
        }

        if (!ddc) {
          ddc = {};
        }

        if (!ddc.data) {
          ddc.data = {};
        }

        if (!ddc.styleClass
          && this.mPs.modalStyleClass) {
          ddc.styleClass = this.mPs.modalStyleClass;
        }

        const path =  `${anchor}//${modal}`;
        const title = `modal ${modal} from ${anchor}`;

        ddc.data.setInstance = (instance: T) => {
          this.mPs.postNavigationLog(path, title);
          subscriber.next(instance);
          subscriber.complete();
        };

        this.mPs.ds.open(component, ddc);
      });
  }

}
