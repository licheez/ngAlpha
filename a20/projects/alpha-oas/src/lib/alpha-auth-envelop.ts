// noinspection JSUnresolvedReference

import { AlphaUserFactory } from './alpha-user';
import {IAlphaAuthEnvelop, IAlphaUser} from "./alpha-oas-abstractions";

// FACTORY
/**
 * Factory class for creating authentication envelope instances from a raw data source object (DSO).
 * Provides a static method to convert backend authentication responses into a strongly-typed envelope.
 */
export class AlphaAuthEnvelopFactory {
  /**
   * Converts a raw DSO into an IAlphaAuthEnvelop instance.
   * @param dso - The raw authentication data source object, typically from an API response.
   * @returns A strongly-typed authentication envelope implementing IAlphaAuthEnvelop.
   */
  static factorFromDso(dso: any): IAlphaAuthEnvelop {
    const ds = new DsoSlicer(dso);
    return new AuthEnvelop(ds.SingleFragment);
  }
}

// FRAGMENTS
/**
 * Represents a single authentication fragment extracted from the DSO.
 * Contains access token, expiry, refresh token, and user information.
 */
interface SingleFragment {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: IAlphaUser;
}

// DSO SLICER
/**
 * Utility class for extracting authentication fragments from a raw DSO.
 * Used internally by the factory to map backend fields to envelope properties.
 */
class DsoSlicer {
  private _dso: any;
  /**
   * Initializes the slicer with a raw data source object.
   * @param dso - The raw authentication data source object.
   */
  constructor(dso: any) {
    this._dso = dso;
  }

  /**
   * Extracts and maps authentication properties from the DSO to a SingleFragment.
   */
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
/**
 * Concrete implementation of IAlphaAuthEnvelop.
 * Encapsulates authentication tokens and user information.
 */
class AuthEnvelop implements IAlphaAuthEnvelop {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: IAlphaUser;

  /**
   * Constructs an authentication envelope from a SingleFragment.
   * @param f0 - The authentication fragment containing all required properties.
   */
  constructor(
    f0: SingleFragment) {
    this.accessToken = f0.accessToken;
    this.expiresIn = f0.expiresIn;
    this.refreshToken = f0.refreshToken;
    this.user = f0.user;
  }
}
