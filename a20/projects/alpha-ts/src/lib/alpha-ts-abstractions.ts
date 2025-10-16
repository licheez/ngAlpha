/**
 * Represents a translation for a specific language.
 * Used as an item in a translation row.
 */
export interface IAlphaTranslationItem {
  /**
   * The language code (e.g., 'en', 'fr', 'nl').
   */
  languageCode: string;
  /**
   * The translated string for the given language.
   */
  translation: string;
}

/**
 * Represents a row in the translation cache, containing a key and its translations in multiple languages.
 */
export interface IAlphaTranslationRow {
  /**
   * The unique key identifying the translation entry.
   */
  key: string;
  /**
   * The list of translations for this key, one per supported language.
   */
  translationItems: IAlphaTranslationItem[];
}

/**
 * Interface for a translation cache, which stores translation rows and provides persistence.
 */
export interface IAlphaTranslationCache {
  /**
   * The date of the last update to the cache.
   */
  lastUpdateDate: Date;
  /**
   * The list of translation rows in the cache.
   */
  translations: IAlphaTranslationRow[];
  /**
   * Persists the cache to the provided local storage.
   * @param lStorage The Storage object to use for persistence (e.g., localStorage).
   */
  store(lStorage: Storage): void;
}
