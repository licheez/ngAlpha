import { AlphaTranslationCache } from './alpha-translation-cache';

describe('AlphaTranslationCache', () => {

  let localStorageMock = (function() {
    let store: Record<string, string> = {};

    return {
      getItem: function(key: string) {
        return store[key] || null;
      },
      setItem: function(key: string, value: string) {
        store[key] = value;
      },
      clear: function() {
        store = {};
      },
      removeItem: function(key: string) {
        delete store[key];
      }
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

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
  });

  it ('stores and retrieves from localStorage', () => {
    localStorageMock.clear();
    const cache =
      AlphaTranslationCache.default;
    cache.store();
    const restored = AlphaTranslationCache
      .retrieve();
    expect(restored).toBeTruthy();
  });

  it('retrieves an empty cache', () => {
    localStorageMock.clear();
    const restored = AlphaTranslationCache
      .retrieve();
    expect(restored).toBeTruthy();
    const year = restored.lastUpdateDate.getFullYear();
    expect(year).toEqual(1970);
  })

});
