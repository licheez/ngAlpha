import { AlphaTranslationCache } from './alpha-translation-cache';

describe('AlphaTranslationCache', () => {

  const getLocalStorage: () => Storage = () => {
    const store: { [key: string]: string } = {};
    return {
      getItem(key: string): string | null {
        return store[key] || null;
      },
      setItem(key: string, value: string): void {
        store[key] = value;
      },
      removeItem(key: string): void {
        delete store[key];
      }
    } as unknown as Storage;
  };

  it('should create an instance', () => {
    expect(AlphaTranslationCache.default).toBeTruthy();
  });

  it('should return the lastUpdateDate', () => {
    const cache = AlphaTranslationCache.default;
    const ts = cache.lastUpdateDate.getTime();
    expect(ts).toBeGreaterThan(0);
  });

  it('should factorFromDso', () => {
    const dso = {
      lastUpdateDate: '2024-02-12T12:30:46.680Z',
      translations: {
        "alpha.buttons.add": {
          "en": "Add",
          "fr": "Ajouter",
          "nl": "Toevoegen"
        }
      }
    };
    const cache = AlphaTranslationCache
      .factorFromDso(dso);
    expect(cache).toBeTruthy();
    expect(cache.translations.length).toEqual(1);
  });

  it ('stores and retrieves from localStorage', () => {
    const lStorage = getLocalStorage();
    const cache = AlphaTranslationCache.default;
    const nbTranslations = cache.translations.length;
    cache.store(lStorage);
    const restored = AlphaTranslationCache
      .retrieve(lStorage);
    expect(restored).toBeTruthy();
    expect(restored.translations.length).toEqual(nbTranslations);
  });

  it('retrieves an empty cache', () => {
    const lStorage = getLocalStorage();
    const restored = AlphaTranslationCache
      .retrieve(lStorage);
    expect(restored).toBeTruthy();
    const year = restored.lastUpdateDate.getFullYear();
    expect(restored.translations.length).toEqual(0);
    expect(year).toEqual(1970);
  })

});
