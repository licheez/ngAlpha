import { Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlphaPrimeModalService {

  private _modalStyleClass: string | undefined;
  private _ds!: DialogService;
  private _postNavigationLog: (path: string, title: string) => any = () => {};

  init(
    ds: DialogService,
    postNavigationLog: (path: string, title: string) => any,
    modalStyleClass?: string): void {
    this._ds = ds;
    this._postNavigationLog = postNavigationLog;
    this._modalStyleClass = modalStyleClass;
  }

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
