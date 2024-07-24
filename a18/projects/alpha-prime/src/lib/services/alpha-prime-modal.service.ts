import { Injectable, Type } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import {IAlphaPrimeModalConfig} from "./alpha-prime-modal-abstractions";

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeModalService {

  private dsOpen: (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any =
    () => {};
  private modalStyleClass: string | undefined;
  private postNavigationLog:
    (path: string, title: string) => any =
    () => {};

  init(
    dsOpen: (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any,
    postNavigationLog?: (path: string, title: string) => any,
    modalStyleClass?: string) {
    this.dsOpen = dsOpen;
    if (postNavigationLog){
      this.postNavigationLog = postNavigationLog;
    }
    if (modalStyleClass) {
      this.modalStyleClass = modalStyleClass;
    }
  }

  /**
   * Opens a modal dialog.
   *
   * @template T - The type of the component to be opened in the modal.
   *
   * @param {Type<T>} component - The component to be opened in the modal.
   * @param {string} anchor - The name of the component calling the openModal method.
   * @param {string} modal - The name of the modal.
   * @param {IAlphaPrimeModalConfig} [ddc] - Configuration options for the modal (optional).
   *
   * @return {Observable<T>} - An Observable that emits an instance of the opened component when the modal is displayed.
   *                           If an error occurs during the opening of the modal, the Observable will emit an error instead.
   */
  openModal<T>(
    component: Type<T>,
    anchor: string,
    modal: string,
    ddc?: IAlphaPrimeModalConfig): Observable<T> {

    return new Observable(
      (subscriber: Subscriber<T>) => {

        if (!ddc) {
          ddc = {};
        }

        if (!ddc.data) {
          ddc.data = {};
        }

        if (!ddc.styleClass
          && this.modalStyleClass) {
          ddc.styleClass = this.modalStyleClass;
        }

        if (ddc.draggable === undefined) {
          ddc.draggable = true;
        }

        const path =  `${anchor}//${modal}`;
        const title = `modal ${modal} from ${anchor}`;

        ddc.data.setInstance = (instance: T) => {
          this.postNavigationLog(path, title);
          subscriber.next(instance);
          subscriber.complete();
        };

        this.dsOpen(component, ddc);
      });
  }

}
