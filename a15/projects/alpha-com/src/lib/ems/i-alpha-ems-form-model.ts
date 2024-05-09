import {Observable} from "rxjs";
import {AlphaEmsFormInput} from "./alpha-ems-form-input";
import {AlphaEmsBaseApi} from "./alpha-ems-base-api";

export interface IAlphaEmsFormModel<TH, TB, TE> {
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
