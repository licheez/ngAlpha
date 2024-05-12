import {AlphaEmsBaseFormModel, AlphaUtils} from "@pvway/alpha-common";
import {Observable} from "rxjs";
import {ICustomerBody, ICustomerEi, ICustomerHead} from "../../model/customer";
import {ICountryHead} from "../../model/country";
import {IAlphaPrimeSelectOption} from "@pvway/alpha-prime";
import {EmsCustomerApi} from "../../api/ems-customer-api";

export class EmsCustFormModel
  extends AlphaEmsBaseFormModel<ICustomerHead, ICustomerBody, ICustomerEi> {

  get cApi(): EmsCustomerApi {
    return this.api as EmsCustomerApi;
  }
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

  populateForRead(body: ICustomerBody): void {
    this.name = body.name;
    this.address = body.address;
    this.countryHeads = [body.countryHead];
    this.countryIso = body.countryHead.iso;
  }

  populateForNew(ei: ICustomerEi): void {
    this.name = this.fi.params?.name;
    this.address = '';
    this.setCountries(ei);
    this.countryIso = ei.countryHeads[0].iso;
  }

  populateForEdit(ei: ICustomerEi, body: ICustomerBody): void {
    this.name = body.name;
    this.address = body.address;
    this.setCountries(ei);
    this.countryIso = body.countryHead.iso;
  }

  createEntity(): Observable<ICustomerBody> {
    return this.cApi.create(
      this.name!, this.address!, this.countryHead!);
  }

  updateEntity(): Observable<ICustomerBody> {
    return this.cApi.update(
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
