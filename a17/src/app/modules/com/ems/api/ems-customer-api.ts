import {AlphaEmsBaseApi, AlphaEmsService} from "@pvway/alpha-common";
import {CustomerFactory, ICustomerBody, ICustomerEi, ICustomerHead} from "../model/customer";
import {EmsCustomerHttpClient} from "./ems-customer-http-client";
import {ICountryHead} from "../model/country";
import {Observable} from "rxjs";

class UsoCreate {
  name: string;
  address: string;
  countryIso: string;

  constructor(
    name: string,
    address: string,
    countryHead: ICountryHead) {
    this.name = name;
    this.address = address;
    this.countryIso = countryHead.iso;
  }
}

class UsoUpdate extends UsoCreate {
  id: string;
  constructor(
    name: string,
    address: string,
    countryHead: ICountryHead,
    id: string) {
    super(name, address, countryHead);
    this.id = id;
  }
}

export class EmsCustomerApi extends
  AlphaEmsBaseApi<ICustomerHead, ICustomerBody, ICustomerEi> {

  constructor(
    ems: AlphaEmsService) {
    super(ems,
      'EmsCustomerApi',
      EmsCustomerHttpClient.ControllerUrl,
      CustomerFactory.factorHeadFromDso,
      CustomerFactory.factorBodyFromDso,
      CustomerFactory.factorEiFromDso)
  }

  create(name: string, address: string, country: ICountryHead):
    Observable<ICustomerBody> {
    const body = new UsoCreate(name, address, country);
    return this.baseCreate(body);
  }

  update(id: string, name: string, address: string, country: ICountryHead):
    Observable<ICustomerBody> {
    const uso = new UsoUpdate(name, address, country, id);
    return this.baseUpdate(uso);
  }

}
