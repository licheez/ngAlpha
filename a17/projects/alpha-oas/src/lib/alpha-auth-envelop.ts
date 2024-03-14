import { IAlphaUser, AlphaUserFactory } from './alpha-user';

// INTERFACES
export interface IAlphaAuthEnvelop {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: IAlphaUser;
}

// FACTORY
export class AlphaAuthEnvelopFactory {
  static factorFromDso(dso: any): IAlphaAuthEnvelop {
    const ds = new DsoSlicer(dso);
    return new AuthEnvelop(ds.SingleFragment);
  }
}

// FRAGMENTS
interface SingleFragment {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: IAlphaUser;
}

// DSO SLICER
class DsoSlicer {
  private _dso: any;
  constructor(dso: any) {
    this._dso = dso;
  }

  get SingleFragment(): SingleFragment {
    return {
      accessToken: this._dso.access_token,
      expiresIn: this._dso.expires_in,
      refreshToken: this._dso.refresh_token,
      user: AlphaUserFactory.factorFromDso(this._dso.user)
    };
  }

}

// CONCRETES
class AuthEnvelop implements IAlphaAuthEnvelop {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;

  user: IAlphaUser;

  constructor(
    f0: SingleFragment) {
    this.accessToken = f0.accessToken;
    this.expiresIn = f0.expiresIn;
    this.refreshToken = f0.refreshToken;
    this.user = f0.user;
  }
}
