import {TestBed} from '@angular/core/testing';

import {AlphaTsService} from './alpha-ts.service';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {AlphaTranslationCache} from './alpha-translation-cache';

describe('AlphaTsService', () => {

  const getSessionStorage: () => Storage = () => {
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
  const postErrorLog = () => {
  };

  let service: AlphaTsService;
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaTsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AlphaTsService);
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handle languageCode ', () => {

    it('should get the languageCode from sessionStorage', () => {
      spyOn(console, 'log');
      const sStorage = getSessionStorage();
      const lStorage = getLocalStorage();
      sStorage.setItem('alphaLanguageCode', 'fr');
      service.initStorage(sStorage, lStorage);
      const lc = service.languageCode;
      expect(lc).toEqual('fr');
      expect(console.log).toHaveBeenCalledWith(`language code found in sessionStorage: fr`);
    });

    it('should get the languageCode from the browser', () => {
      spyOn(console, 'log');
      const sStorage = getSessionStorage();
      const lStorage = getLocalStorage();
      service.initStorage(sStorage, lStorage);
      const lc = service.languageCode;
      expect(console.log).toHaveBeenCalledWith(`language code set from browser: ${lc}`);
    });

    it('should change the languageCode', () => {
      spyOn(console, 'log');
      const sStorage = getSessionStorage();
      const lStorage = getLocalStorage();
      sStorage.setItem('alphaLanguageCode', 'fr');
      service.initStorage(sStorage, lStorage);
      const lc = service.languageCode;
      expect(lc).toEqual('fr');
      expect(console.log).toHaveBeenCalledWith(`language code found in sessionStorage: fr`);
      service.changeLanguageCode('en');
      const lc2 = service.languageCode;
      expect(lc2).toEqual('en');
    });

  });

  describe('handle init', () => {

    it("should init without localStorage nor apiEndPoint", () => {
      spyOn(console, 'log');
      const mStorage = getSessionStorage();
      const lStorage = getLocalStorage();
      service.init(httpClient,
        undefined, postErrorLog,
        mStorage, lStorage).subscribe({
        next: status => {
          const nbTranslations = service.nbTranslations;
          expect(status)
            .toEqual(`no api end point provided.${nbTranslations} translations found in cache`);
          expect(console.log).toHaveBeenCalledWith('no translations in localStorage, using default');
          expect(console.log).toHaveBeenCalledWith(status);
        }
      });
    });

    it("should init with existing localStorage but no apiEndPoint", () => {
      spyOn(console, 'log');
      const mStorage = getSessionStorage();
      const lStorage = getLocalStorage();

      const tc = AlphaTranslationCache.default;
      tc.store(lStorage);

      service.init(httpClient,
        undefined, postErrorLog,
        mStorage, lStorage).subscribe({
        next: status => {
          const nbTranslations = service.nbTranslations;
          expect(status)
            .toEqual(`no api end point provided.${nbTranslations} translations found in cache`);
          expect(console.log).toHaveBeenCalledWith(`${nbTranslations} translations found in localStorage`);
          expect(console.log).toHaveBeenCalledWith(status);
        }
      });
    });

    it('should refresh the translations from the api', () => {
      spyOn(console, 'log');

      const mStorage = getSessionStorage();
      const lStorage = getLocalStorage();
      const tc = AlphaTranslationCache.default;
      const nbTranslations = tc.translations.length;

      const dso: {
        data: {
          isUpToDate: boolean,
          translationsCache: any
        }
      } = {
        data: {
          isUpToDate: false,
          translationsCache: tc
        }
      };
      const url = 'https://localhost/getTcu';
      service.init(httpClient, url, postErrorLog, mStorage, lStorage)
        .subscribe({
          next: status => {
            expect(status).toEqual(`${nbTranslations} translations loaded`);
            expect(console.log).toHaveBeenCalledWith(status);
          }
        });

      const epoch = new Date(1970, 0, 1, 0, 0, 0, 0);
      const dtString = epoch.toISOString();
      const effectiveUrl = url + `?clientDate=${dtString}`;

      const req = httpTesting.expectOne(effectiveUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(dso);

    });

    it('should handle up to date translations', () => {
      spyOn(console, 'log');

      const mStorage = getSessionStorage();
      const lStorage = getLocalStorage();

      const dso: {
        data: {
          isUpToDate: boolean,
          translationsCache: any
        }
      } = {
        data: {
          isUpToDate: true,
          translationsCache: null
        }
      };
      const url = 'https://localhost/getTcu';
      service.init(httpClient, url, postErrorLog, mStorage, lStorage)
        .subscribe({
          next: status => {
            expect(status).toEqual(`translations were up to date`);
            expect(console.log).toHaveBeenCalledWith(status);
          }
        });

      const epoch = new Date(1970, 0, 1, 0, 0, 0, 0);
      const dtString = epoch.toISOString();
      const effectiveUrl = url + `?clientDate=${dtString}`;

      const req = httpTesting.expectOne(effectiveUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(dso);

    });

    it('init should fail when calling the api', () => {
      const mStorage = getSessionStorage();
      const lStorage = getLocalStorage();
      const url = 'https://localhost/getTcu';

      service.init(httpClient, url, postErrorLog, mStorage, lStorage).subscribe({
        error: e => {
          expect(e.status).toEqual(500);
        }
      });

      const epoch = new Date(1970, 0, 1, 0, 0, 0, 0);
      const dtString = epoch.toISOString();
      const effectiveUrl = url + `?clientDate=${dtString}`;

      const req = httpTesting.expectOne(effectiveUrl);
      expect(req.request.method).toEqual('GET');
      req.flush('error', {status: 500, statusText: 'Server Error'});

    });

  });

  describe('should handle getTr', () => {

    it ('should find the key and the language', () => {
      const key = 'alpha.buttons.add';
      const translation = service.getTr(key, 'fr');
      expect(translation).toEqual('Ajouter');
    });

    it ('should find the key but not the language', () => {
      const key = 'alpha.buttons.add';
      service.changeLanguageCode('zh')
      const translation = service.getTr(key);
      expect(translation).toEqual('Add');
    });

    it ('should not find the key', () => {
      const spy = jasmine.createSpy('postErrorLog');
      service.init(undefined,undefined, spy);
      const key = 'noKey';
      const translation = service.getTr(key, 'zh');
      const err = `key '${key}' not found`;
      expect(translation).toEqual(err);
      expect(spy).toHaveBeenCalledWith(
        'AlphaTsService', 'getTr', `error: key '${key}' not found`
      );
    });

  });

  it('should delegate to mApi.useGetTranslationCacheUpdate', () => {
    const service = new AlphaTsService();
    const mockApi = {
      useGetTranslationCacheUpdate: jasmine.createSpy('useGetTranslationCacheUpdate')
    };
    // @ts-expect-error: private property assignment for testing
    service.mApi = mockApi;

    const fn = () => of(null);
    service.useGetTranslationCacheUpdate(fn);

    expect(mockApi.useGetTranslationCacheUpdate).toHaveBeenCalledWith(fn);
  });

})
;
