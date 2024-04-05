import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable, Subscriber } from 'rxjs';
import {AlphaPrimeService} from "./alpha-prime.service";

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeModalService {

  private _modalStyleClass: string | undefined;
  private _ds!: DialogService;
  private _postNavigationLog: (path: string, title: string) => any = () => {};

  constructor(ps: AlphaPrimeService) {
    this._modalStyleClass = ps.modalStyleClass;
    this._ds = ps.ds;
    this._postNavigationLog = ps.postNavigationLog;
  }

  /**
   * Initializes the dialog service.
   *
   * @param {DialogService} ds - The DialogService object to be initialized.
   * @param {(path: string, title: string) => any} postNavigationLog - The function used for posting navigation logs, with parameters path: string and title: string.
   * @param {string} [modalStyleClass] - Optional. The CSS class to be applied to the modals created by the DialogService.
   * @return {void}
   * @deprecated this method is left active for backward compatibility. It became redundant now that the AlphaPrimeService is injected.
   */
  init(
    ds: DialogService,
    postNavigationLog: (path: string, title: string) => any,
    modalStyleClass?: string): void {
    this._ds = ds;
    this._postNavigationLog = postNavigationLog;
    this._modalStyleClass = modalStyleClass;
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

        if (!this._ds){
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
          && this._modalStyleClass) {
          ddc.styleClass = this._modalStyleClass;
        }

        const path =  `${anchor}//${modal}`;
        const title = `modal ${modal} from ${anchor}`;

        ddc.data.setInstance = (instance: T) => {
          this._postNavigationLog(path, title);
          subscriber.next(instance);
          subscriber.complete();
        };

        this._ds.open(component, ddc);
      });
  }

}
