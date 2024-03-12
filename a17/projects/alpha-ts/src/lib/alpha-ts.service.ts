import {Injectable} from '@angular/core';
import {IAlphaTranslationCache} from "./ialpha-translation-cache";
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaTsApiService} from "./alpha-ts-api.service";
import {Observable, Observer} from "rxjs";
import {AlphaLbsService} from "@pvway/alpha-lbs";
import {IAlphaTranslationRow} from "./ialpha-translation-row";
import {IAlphaTranslationItem} from "./ialpha-translation-item";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsService {

  private mContext = 'AlphaTsService';
  private mTranslationCache: IAlphaTranslationCache;
  private mLanguageCode = 'en';

  constructor(
    private mApi: AlphaTsApiService,
    private mLs: AlphaLsService,
    lbs: AlphaLbsService) {
    this.mTranslationCache = AlphaTranslationCache.default;

    // listen to any update of the language code
    lbs.subscribe((languageCode: string) =>
        this.changeLanguageCode(languageCode),
      "LANGUAGE_CODE_UPDATED");
  }

  /**
   * Change the language code.
   *
   * @param {string} languageCode - The new language code.
   * @return {void}
   */
  changeLanguageCode(languageCode: string): void {
    this.mLanguageCode = languageCode;
  }

  useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
    Observable<IAlphaTranslationCache | null>): void {
    this.mApi.useGetTranslationCacheUpdate(getTranslationCacheUpdate);
  }

  /**
   * Initializes the translation service by loading the translation cache.
   *
   * @param {string} [getTranslationCacheUpdateUrl] - The URL to update the translation cache.
   * If not provided the service will use the default translations.
   * @returns {Observable<any>} - an observable that emits a status message on completion
   */
  init(getTranslationCacheUpdateUrl?: string): Observable<string> {

    this.mApi.init(getTranslationCacheUpdateUrl);

    return new Observable(
      (observer: Observer<any>) => {

        const tc = AlphaTranslationCache.retrieve();
        this.mTranslationCache = tc;

        if (getTranslationCacheUpdateUrl === undefined) {
          observer.next(
            'translations were populated from localStorage');
          observer.complete();
          return;
        }

        this.mApi
          .getTranslationCacheUpdate(tc.lastUpdateDate)
          .subscribe({
            next:
              (translationsCache: IAlphaTranslationCache | null) => {
                if (translationsCache != null) {
                  translationsCache.store();
                  this.mTranslationCache = translationsCache;
                }
                observer.next('translations loaded');
                observer.complete();
              },
            error: e => {
              this.mLs.postErrorLog(
                this.mContext, 'init', JSON.stringify(e));
              observer.error(e);
            }
          });
      });
  }

  /**
   * Retrieves the translation for a given key.
   * @param {string} key - The key to look for in the translations cache.
   * @returns {string} - The translation corresponding to the key if found,
   * otherwise an error message.
   */
  getTr(key: string): string {
    const row = this.mTranslationCache.translations
      .find(
        (row: IAlphaTranslationRow) => row.key === key);

    if (row) {
      // the key was found in the cache
      // get the language code from the principal
      const lc = this.mLanguageCode;
      // get the translation if any
      const tr = row.translationItems.find(
        (item: IAlphaTranslationItem) => item.languageCode === lc);
      if (tr) {
        return tr.translation;
      }
      // translation was not found
      // return the first entry from the row dictionary
      return row.translationItems[0].translation;
    }
    const err = `key '${key}' not found`;
    this.mLs.postErrorLog(
      this.mContext,'getTr', `error: ${err}`);
    return err;
  }

}
