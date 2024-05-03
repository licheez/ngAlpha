import {Injectable} from '@angular/core';
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {AlphaTsApiService} from "./alpha-ts-api.service";
import {Observable, Observer} from "rxjs";
import {IAlphaTranslationCache, IAlphaTranslationItem, IAlphaTranslationRow} from "./alpha-ts-abstractions";

@Injectable({
  providedIn: 'root'
})
export class AlphaTsService {

  private mContext = 'AlphaTsService';
  private mTranslationCache: IAlphaTranslationCache;
  private mLanguageCode = 'en';
  private mPostErrorLog: ((context: string, method: string, error: string) => any) | undefined;

  constructor(
    private mApi: AlphaTsApiService) {
    this.mTranslationCache = AlphaTranslationCache.default;
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

  /**
   * Inject your own method
   * for retrieving the translations cache updates
   * */
  useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
    Observable<IAlphaTranslationCache | null>): void {
    this.mApi.useGetTranslationCacheUpdate(getTranslationCacheUpdate);
  }

  /**
   * Initializes the service.
   * @param {string} [getTranslationCacheUpdateUrl] - The URL for updating the translation cache.
   * @param {Function} [postErrorLog] - The function for posting error logs.
   * @return {Observable<string>} An Observable that emits a string value.
   */
  init(
    getTranslationCacheUpdateUrl?: string,
    postErrorLog?: (
      context: string, method: string, error: string) => any): Observable<string> {

    this.mApi.init(getTranslationCacheUpdateUrl, postErrorLog);

    this.mPostErrorLog = postErrorLog;

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
              if (this.mPostErrorLog) {
                this.mPostErrorLog(
                  this.mContext, 'init', JSON.stringify(e));
              }
              observer.error(e);
            }
          });
      });
  }

  /**
   * Retrieves the translation for a given key.
   * @param {string} key - The key to look for in the translations cache.
   * @param languageCode - optional languageCode overriding the service languageCode.
   * @returns {string} - The translation corresponding to the key if found,
   * otherwise an error message.
   */
  getTr(key: string, languageCode?: string): string {
    const row = this.mTranslationCache.translations
      .find(
        (row: IAlphaTranslationRow) => row.key === key);

    if (row) {
      // the key was found in the cache
      // get the language code from the principal
      const lc = languageCode??this.mLanguageCode;
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
    if (this.mPostErrorLog) {
      this.mPostErrorLog(
        this.mContext, 'getTr', `error: ${err}`);
    }
    return err;
  }

}
