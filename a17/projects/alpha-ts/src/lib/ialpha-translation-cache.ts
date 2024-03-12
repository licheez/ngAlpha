import {IAlphaTranslationRow} from "./ialpha-translation-row";

export interface IAlphaTranslationCache {
  lastUpdateDate: Date;
  translations: IAlphaTranslationRow[];
  store(): void;
}
