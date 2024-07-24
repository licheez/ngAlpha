import {Observable} from "rxjs";
import {AlphaEmsBaseApi} from "./alpha-ems-base-api";
import {AlphaEmsFormInput} from "./alpha-ems-form-input";

interface IAlphaEmsFormModel<TH, TB, TE> {
  api: AlphaEmsBaseApi<TH, TB, TE>;
  fi: AlphaEmsFormInput<TB>;
  body: TB | undefined;
  ei: TE | undefined;
  invalid: boolean;
  populateForRead(body: TB): void;
  populateForNew(ei: TE): void;
  populateForEdit(ei: TE, body: TB): void;
  createEntity(): Observable<TB>;
  updateEntity(): Observable<TB>;
}

export abstract class AlphaEmsBaseFormModel<TH, TB, TE>
  implements IAlphaEmsFormModel<TH, TB, TE> {

    api!: AlphaEmsBaseApi<TH, TB, TE>;
    fi!: AlphaEmsFormInput<TB>;
    body: TB | undefined;
    ei: TE | undefined;

    abstract invalid: boolean;
    abstract populateForRead(body: TB): void ;
    abstract populateForNew(ei: TE): void;
    abstract populateForEdit(ei: TE, body: TB): void ;
    abstract createEntity(): Observable<TB>;
    abstract updateEntity(): Observable<TB> ;
}
