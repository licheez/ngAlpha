import {CountryFactory, ICountryHead} from "./country";

// INTERFACES
export interface ICustomerHead {
  id: string,
  name: string
}

export interface ICustomerBody extends ICustomerHead {
  address: string,
  countryHead: ICountryHead
}

export interface ICustomerEi {
  countryHeads: ICountryHead[];
}

export class CustomerFactory {
  static factorHeadFromDso(dso: any): ICustomerHead {
    const ds = new DsoSlicer(dso);
    return new CustomerHead(ds.head);
  }
  static factorBodyFromDso(dso: any): ICustomerBody {
    const ds = new DsoSlicer(dso);
    return new CustomerBody(ds.head, ds.body);
  }
  static factorEiFromDso(dso: any): ICustomerEi {
    const ds = new DsoSlicer(dso);
    return new CustomerEi(ds.ei);
  }
}

// SLICES
interface Head {
  id: string,
  name: string
}

interface Body {
  address: string,
  countryHead: ICountryHead;
}

interface Ei {
  countryHeads: ICountryHead[];
}

// DSO SLICER
class DsoSlicer {
  constructor(private mDso: any) { }

  get head(): Head {
    return {
      id: this.mDso.id,
      name: this.mDso.name
    };
  }

  get body(): Body {
    return {
      address: this.mDso.address,
      countryHead: CountryFactory.factorFromHead(this.mDso.countryHead)
    };
  }

  get ei(): Ei {
    return {
      countryHeads: this.mDso.countryHeads.map(
        (dso: any) => CountryFactory.factorFromHead(dso))
    };
  }
}

// CONCRETES
class CustomerHead implements ICustomerHead {
  id: string;
  name: string;
  constructor(h: Head) {
    this.id = h.id;
    this.name = h.name;
  }
}

class CustomerBody extends CustomerHead
  implements ICustomerBody {

  address: string;
  countryHead: ICountryHead;

  constructor(h: Head,
              b: Body) {
    super(h);
    this.address = b.address;
    this.countryHead = b.countryHead;
  }
}

class CustomerEi implements ICustomerEi {
  countryHeads: ICountryHead[];
  constructor(ei: Ei) {
    this.countryHeads = ei.countryHeads;
  }
}

