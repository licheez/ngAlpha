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
