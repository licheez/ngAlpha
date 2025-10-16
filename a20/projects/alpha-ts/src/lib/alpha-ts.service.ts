import {Injectable} from '@angular/core';
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {AlphaTsApiService} from "./alpha-ts-api.service";
import {Observable, Observer} from "rxjs";
import {IAlphaTranslationCache, IAlphaTranslationItem, IAlphaTranslationRow} from "./alpha-ts-abstractions";
import {HttpClient} from "@angular/common/http";

/**
 * AlphaTsService provides translation management for multilingual Angular applications.
 * It handles translation cache retrieval, language code management, and error logging.
 * The service supports custom storage, API integration, and error reporting hooks.
 *
 * Usage:
 *   - Use `init()` to initialize the service and optionally update the translation cache from a remote API.
 *   - Use `getTr()` to retrieve translations for a given key and language.
 *   - Use `changeLanguageCode()` to set the active language code.
 *   - Use `useGetTranslationCacheUpdate()` to inject a custom cache update method.
 */
@Injectable({
  providedIn: 'root'
})
export class AlphaTsService {

  /**
   * Session storage for language code and other session-scoped data.
   * Defaults to the browser's sessionStorage.
   */
  private mSessionStorage: Storage = sessionStorage;

  /**
   * Local storage for translation cache persistence.
   * Defaults to the browser's localStorage.
   */
  private mLocalStorage: Storage = localStorage;

  /**
   * API service for translation cache updates and remote operations.
   */
  private mApi = new AlphaTsApiService();

  /**
   * Context string for error logging.
   */
  private mContext = 'AlphaTsService';

  /**
   * Cached translation cache instance.
   */
  private _tc: IAlphaTranslationCache | undefined;

  /**
   * Returns the translation cache, loading from localStorage or default if needed.
   */
  private get mTranslationCache(): IAlphaTranslationCache {
    if (this._tc === undefined) {
      // try to retrieve from localStorage
      this._tc = AlphaTranslationCache.retrieve(this.mLocalStorage);
      // if still empty, use the default
      if (this._tc.translations.length === 0) {
        console.log('no translations in localStorage, using default');
        this._tc = AlphaTranslationCache.default;
        this._tc.store(this.mLocalStorage);
      } else {
        console.log(
          `${this._tc.translations.length} translations found in localStorage`);
      }
    }
    return this._tc;
  };

  /**
   * Returns the number of translations in the cache.
   */
  get nbTranslations(): number {
    return this.mTranslationCache.translations.length;
  }

  /**
   * Cached language code, if set.
   */
  private _lc: string | undefined;

  /**
   * Returns the current language code, loading from sessionStorage or browser if needed.
   */
  get languageCode(): string {
    if (this._lc === undefined) {
      // try to get from sessionStorage
      const lc = this.mSessionStorage.getItem('alphaLanguageCode');
      if (lc) {
        console.log(`language code found in sessionStorage: ${lc}`);
        this._lc = lc;
      } else {
        // try to get from the browser
        const nav = window.navigator as any;
        const userLang = (nav.language || nav.userLanguage) as string;
        this._lc = userLang
          ? userLang.substring(0, 2)?.toLowerCase()
          : 'en';
        this.mSessionStorage.setItem('alphaLanguageCode', this._lc);
        // default to 'en'
        console.log(`language code set from browser: ${this._lc}`);
      }
    }
    return this._lc;
  }

  /**
   * Optional error logging function injected by the user.
   */
  private mPostErrorLog: ((context: string, method: string, error: string) => any) | undefined;

  /**
   * Changes the active language code for translations.
   * @param languageCode The new language code to use.
   */
  changeLanguageCode(languageCode: string): void {
    this._lc = languageCode;
  }

  /**
   * Injects a custom method for retrieving translation cache updates from a remote source.
   * @param getTranslationCacheUpdate Function that returns an Observable of the updated cache or null.
   */
  useGetTranslationCacheUpdate(getTranslationCacheUpdate: (lastUpdateDate: Date) =>
    Observable<IAlphaTranslationCache | null>): void {
    this.mApi.useGetTranslationCacheUpdate(getTranslationCacheUpdate);
  }

  /**
   * Sets the session and local storage objects to use for caching and language code persistence.
   * @param mStorage Session storage object.
   * @param lStorage Local storage object.
   */
  initStorage(
    mStorage: Storage,
    lStorage: Storage): void {
    this.mSessionStorage = mStorage;
    this.mLocalStorage = lStorage;
  }

  /**
   * Initializes the service, optionally updating the translation cache from a remote API.
   * @param httpClient Optional Angular HttpClient for API calls.
   * @param getTranslationCacheUpdateUrl Optional URL for updating the translation cache.
   * @param postErrorLog Optional function for posting error logs.
   * @param mStorage Optional session storage object (defaults to browser sessionStorage).
   * @param lStorage Optional local storage object (defaults to browser localStorage).
   * @returns Observable that emits a status string or errors.
   */
  init(
    httpClient?: HttpClient,
    getTranslationCacheUpdateUrl?: string,
    postErrorLog?: (
      context: string, method: string, error: string) => any,
    mStorage: Storage = sessionStorage,
    lStorage: Storage = localStorage): Observable<string> {

    this.initStorage(mStorage, lStorage);

    this.mApi.init(
      httpClient, getTranslationCacheUpdateUrl, postErrorLog);

    this.mPostErrorLog = postErrorLog;

    return new Observable(
      (observer: Observer<any>) => {

        if (getTranslationCacheUpdateUrl === undefined) {
          const tc = this.mTranslationCache;
          const status = 'no api end point provided.'+
            `${tc.translations.length} translations found in cache`;
          console.log(status);
          observer.next(status);
          observer.complete();
          return;
        }

        // get the last update date from the cache
        // if no cache, use the epoch
        const lastUpdateDate =
          this._tc?.lastUpdateDate ??
          new Date(1970, 0, 1,
            0, 0, 0, 0);

        // get the translation cache from the Api
        this.mApi
          .getTranslationCacheUpdate(lastUpdateDate)
          .subscribe({
            next:
              (tc: IAlphaTranslationCache | null) => {
                let status: string;
                if (tc != null) {
                  tc.store(lStorage);
                  this._tc = tc;
                  status = `${tc.translations.length} translations loaded`;
                } else {
                  status = 'translations were up to date';
                }
                console.log(status);
                observer.next(status);
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
   * Retrieves the translation for a given key and language code.
   * If the key is not found, logs an error and returns an error message.
   * @param key The translation key to look up.
   * @param languageCode Optional language code to override the current language.
   * @returns The translation string if found, or an error message if not.
   */
  getTr(key: string, languageCode?: string): string {
    const tc = this.mTranslationCache;
    const row = tc.translations
      .find(
        (row: IAlphaTranslationRow) => row.key === key);

    if (row) {
      // the key was found in the cache
      // get the language code from the principal
      const lc = languageCode ?? this.languageCode;
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
