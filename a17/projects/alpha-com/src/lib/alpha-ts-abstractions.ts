// noinspection JSUnusedGlobalSymbols

import {Observable} from "rxjs";
import {IAlphaLoggerService} from "./alpha-ls-abstractions";

export interface IAlphaTranslationItem {
  languageCode: string;
  translation: string;
}

export interface IAlphaTranslationRow {
  key: string;
  translationItems: IAlphaTranslationItem[];
}

export interface IAlphaTranslationCache {
  lastUpdateDate: Date;
  translations: IAlphaTranslationRow[];
  store(): void;
}

export interface IAlphaTranslationService {

  /**
   * Change the language code.
   *
   * @param {string} languageCode - The new language code.
   * @return {void}
   */
  changeLanguageCode(languageCode: string): void;

  /**
   * Inject your own method
   * for retrieving the translations cache updates
   * */
  useGetTranslationCacheUpdate(
    getTranslationCacheUpdate: (lastUpdateDate: Date) =>
      Observable<IAlphaTranslationCache | null>): void;

  /**
   * Initializes the service.
   *
   * @param {string} [getTranslationCacheUpdateUrl] - The URL for updating the translation cache.
   * @param {IAlphaLoggerService} ls - An instance of the `IAlphaLoggerService`.
   *
   * @return {Observable<string>} - An Observable that emits a string value.
   */
  init(
    getTranslationCacheUpdateUrl?: string,
    ls?: IAlphaLoggerService): Observable<string>;

  /**
   * Retrieves the translation for a given key.
   * @param {string} key - The key to look for in the translations cache.
   * @param languageCode - optional languageCode overriding the service languageCode.
   * @returns {string} - The translation corresponding to the key if found,
   * otherwise an error message.
   */
  getTr(key: string, languageCode?: string): string;

}
