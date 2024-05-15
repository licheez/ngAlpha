// INTERFACES
export interface ICountryHead {
  iso: string,
  name: string
}

// FACTORIES
export class CountryFactory{
  static factorFromHead(dso: any): ICountryHead {
    const ds = new DsoSlicer(dso);
    return new CountryHead(ds.head);
  }
}

// SLICES
interface Head {
  iso: string,
  name: string
}

// DSO SLICER
class DsoSlicer {
  constructor(private mDso: any) {}

  get head(): ICountryHead {
    return {
      iso: this.mDso.iso,
      name: this.mDso.name
    };
  }
}

// CONCRETES
class CountryHead implements ICountryHead {
  iso: string;
  name: string;

  constructor(h: Head) {
    this.iso = h.iso;
    this.name = h.name;
  }
}
