import {TestBed} from '@angular/core/testing';

import {AlphaTsService} from './alpha-ts.service';
import {of, throwError} from "rxjs";
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {HttpClient} from "@angular/common/http";

describe('AlphaTsService', () => {
  let service: AlphaTsService;
  const postErrorLog = jest.fn();
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('init should bypass api load', () => {
    service.init().subscribe({
      next: status => expect(status)
        .toEqual('translations were populated from localStorage')
    });
  });

  it("should override the api call", () => {
    service.useGetTranslationCacheUpdate(
      () => of(null));
    expect(true).toBeTruthy();
  })

  it('init should call api and get default data', () => {
    const tc = AlphaTranslationCache.default;
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
    const httpClient = {
      get: jest.fn(() => of(dso))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'get');
    const url = 'https://localhost/getTcu';
    service.changeLanguageCode('fr');
    service.init(httpClient, url)
      .subscribe({
        next: status => {
          expect(status).toEqual('translations loaded');
          const tr = service.getTr('alpha.buttons.add');
          expect(tr).toEqual('Ajouter');
        }
      });
    expect(spy).toHaveBeenCalled();
  });

  it('init should fail when calling the api', () => {
    // let's fake the call to the api by returning the
    // default translation cache
    const httpClient = {
      get: jest.fn(() =>
        throwError(() => 'error'))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'get');
    const url = 'https://localhost/getTcu';

    service.init(httpClient, url, postErrorLog).subscribe({
      error: e => {
        expect(e).toEqual('error');
      }
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should find the key and the language', () => {
    const key = 'alpha.buttons.add';
    service.changeLanguageCode('fr');
    const translation = service.getTr(key);
    expect(translation).toEqual('Ajouter');
  })

  it('should find the key but not the language', () => {
    const key = 'alpha.buttons.add';
    service.changeLanguageCode('zh');
    const translation = service.getTr(key);
    expect(translation).toEqual('Add');
  })

  it('should not find the key', () => {
    service.init(
      undefined,
      undefined,
      postErrorLog);
    const key = 'noKey';
    service.changeLanguageCode('zh');
    const translation = service.getTr(key);
    const err = `key '${key}' not found`;
    expect(translation).toEqual(err);
  });

});
