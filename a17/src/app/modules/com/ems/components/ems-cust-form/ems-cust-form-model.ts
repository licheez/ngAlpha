import {AlphaEmsFormInput, IAlphaEmsFormModel} from "@pvway/alpha-common";
import {Observable} from "rxjs";
import {ICustomerBody, ICustomerEi, ICustomerHead} from "../../model/customer";
import {EmsCustomerApi} from "../../api/ems-customer-api";

export class EmsCustFormModel
  implements IAlphaEmsFormModel<ICustomerHead, ICustomerBody, ICustomerEi> {
    api: EmsCustomerApi;
    fi: AlphaEmsFormInput<ICustomerBody>;
    body: ICustomerBody | undefined;
    ei: ICustomerEi | undefined;
    get invalid(): boolean {
      return true;
    }

    constructor(
      api: EmsCustomerApi,
      fi: AlphaEmsFormInput<ICustomerBody>) {
      this.api = api;
      this.fi = fi;
    }

    populateForRead(body: ICustomerBody): void {
        throw new Error("Method not implemented.");
    }
    populateForNew(ei: ICustomerEi): void {
        throw new Error("Method not implemented.");
    }
    populateForEdit(ei: ICustomerEi, body: ICustomerBody): void {
        throw new Error("Method not implemented.");
    }
    createEntity(): Observable<ICustomerBody> {
        throw new Error("Method not implemented.");
    }
    updateEntity(): Observable<ICustomerBody> {
        throw new Error("Method not implemented.");
    }
}
