import {AlphaEmsFormInput, AlphaUtils, IAlphaEmsFormModel} from "@pvway/alpha-common";
import {Observable} from "rxjs";
import {ICustomerBody, ICustomerEi, ICustomerHead} from "../../model/customer";
import {EmsCustomerApi} from "../../api/ems-customer-api";
import {ICountryHead} from "../../model/country";
import {IAlphaPrimeSelectOption} from "@pvway-dev/alpha-prime";

export class EmsCustFormModel
  implements IAlphaEmsFormModel<ICustomerHead, ICustomerBody, ICustomerEi> {
  api: EmsCustomerApi;
  fi: AlphaEmsFormInput<ICustomerBody>;
  body: ICustomerBody | undefined;
  ei: ICustomerEi | undefined;

  get invalid(): boolean {
    return AlphaUtils.eon(this.name) ||
      AlphaUtils.eon(this.address) ||
      AlphaUtils.eon(this.countryIso);
  }

  name = '';
  address = '';
  // COUNTRY
  countryOptions: IAlphaPrimeSelectOption[] = [];
  countryHeads: ICountryHead[] = [];
  countryIso: string | undefined;
  get countryHead(): ICountryHead | undefined {
    return this.countryIso
      ? this.countryHeads
        .find(x => x.iso === this.countryIso)
      : undefined;
  }

  constructor(
    api: EmsCustomerApi,
    fi: AlphaEmsFormInput<ICustomerBody>) {
    this.api = api;
    this.fi = fi;
  }

  populateForRead(body: ICustomerBody): void {
    this.name = body.name;
    this.address = body.address;
    this.countryHeads = [body.countryHead];
    this.countryIso = body.countryHead.iso;
  }

  populateForNew(ei: ICustomerEi): void {
    this.ei = ei;
    this.name = this.fi.params?.name;
    this.address = '';
    this.setCountries(ei);
    this.countryIso = ei.countryHeads[0].iso;
  }

  populateForEdit(ei: ICustomerEi, body: ICustomerBody): void {
    this.ei = ei;
    this.name = body.name;
    this.address = body.address;
    this.setCountries(ei);
    this.countryIso = body.countryHead.iso;
  }

  createEntity(): Observable<ICustomerBody> {
    return this.api.create(
      this.name!, this.address!, this.countryHead!);
  }

  updateEntity(): Observable<ICustomerBody> {
    return this.api.update(
      this.body!.id,
      this.name!,
      this.address!,
      this.countryHead!);
  }

  setCountries(ei: ICustomerEi): void {
    this.countryHeads = ei.countryHeads;
    this.countryOptions = ei.countryHeads.map(
      (c: ICountryHead) => (
        {
          id: c.iso,
          caption: c.name,
          disabled: false,
          data: c
        }));
  }
}
