// noinspection JSUnresolvedReference

import {IAlphaUser} from "./alpha-oas-abstractions";

/**
 * Factory for creating IAlphaUser instances from a raw data source object (DSO).
 * Converts backend user responses into strongly-typed user objects.
 *
 * Usage:
 * - Call `factorFromDso()` with a DSO to get an IAlphaUser instance.
 */
export class AlphaUserFactory {
  /**
   * Converts a raw DSO into an IAlphaUser instance.
   * @param dso - The raw user data source object, typically from an API response.
   * @returns A strongly-typed user object implementing IAlphaUser.
   */
  static factorFromDso(dso: any): IAlphaUser {
    const ds = new DsoSlicer(dso);
    return new AlphaUser(ds.SingleFragment);
  }
}

/**
 * Represents a single user fragment extracted from the DSO.
 * Contains userId, username, language code, and custom properties.
 */
interface SingleFragment {
  userId: string;
  username: string;
  languageCode: string;
  properties: Map<string, any>
}

/**
 * Utility class for extracting user fragments from a raw DSO.
 * Used internally by the factory to map backend fields to user properties.
 */
class DsoSlicer {
  private _dso: any;
  /**
   * Initializes the slicer with a raw data source object.
   * @param dso - The raw user data source object.
   */
  constructor(dso: any) {
    this._dso = dso;
  }

  /**
   * Extracts and maps user properties from the DSO to a SingleFragment.
   */
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

/**
 * Concrete implementation of IAlphaUser.
 * Encapsulates user identity, language, and custom properties.
 */
class AlphaUser implements IAlphaUser {
  userId: string;
  username: string;
  languageCode: string;
  properties: Map<string, any>;

  /**
   * Constructs a user object from a SingleFragment.
   * @param f0 - The user fragment containing all required properties.
   */
  constructor(
    f0: SingleFragment) {
    this.userId = f0.userId;
    this.username = f0.username;
    this.languageCode = f0.languageCode;
    this.properties = f0.properties;
  }

}
