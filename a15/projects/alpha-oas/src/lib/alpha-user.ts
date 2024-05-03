// noinspection JSUnresolvedReference

import {IAlphaUser} from "./alpha-oas-abstractions";

// FACTORY
export class AlphaUserFactory {
  static factorFromDso(dso: any): IAlphaUser {
    const ds = new DsoSlicer(dso);
    return new AlphaUser(ds.SingleFragment);
  }
}

// FRAGMENTS
interface SingleFragment {
  userId: string;
  username: string;
  languageCode: string;
  properties: Map<string, any>
}

// DSO SLICER
class DsoSlicer {
  private _dso: any;
  constructor(dso: any) {
    this._dso = dso;
  }

  get SingleFragment(): SingleFragment {
    const propertyArray =
      Object.entries(this._dso.userProperties);
    return {
      userId: this._dso.userId,
      username: this._dso.username,
      languageCode: this._dso.languageCode,
      properties: new Map(propertyArray)
    };
  }
}

// CONCRETES
class AlphaUser implements IAlphaUser {
  userId: string;
  username: string;
  languageCode: string;
  properties: Map<string, any>;

  constructor(
    f0: SingleFragment) {
    this.userId = f0.userId;
    this.username = f0.username;
    this.languageCode = f0.languageCode;
    this.properties = f0.properties;
  }

}
