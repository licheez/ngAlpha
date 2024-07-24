import {TestBed} from '@angular/core/testing';

import {AlphaTsApiService} from './alpha-ts-api.service';
import {Observable, of, Subscriber, throwError} from "rxjs";
import {IAlphaTranslationCache} from "./alpha-ts-abstractions";
import {HttpClient} from "@angular/common/http";

describe('AlphaTsApiService', () => {
  let service: AlphaTsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaTsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', () => {
    service.init();
    expect(true).toBeTruthy();
  });

  it('useGetTranslationCacheUpdate should override builtin call',
    () => {
      service.useGetTranslationCacheUpdate(() => {
        return new Observable<IAlphaTranslationCache | null>(
          (sub: Subscriber<IAlphaTranslationCache | null>) => {
            sub.next(null);
          });
      });
      const today = new Date();
      service.getTranslationCacheUpdate(today).subscribe({
        next: tc => expect(tc).toBeNull()
      });
    });

  it('should use the builtin call and return null',
    () => {
      const now = new Date();
      service.getTranslationCacheUpdate(now).subscribe({
        next: tc => expect(tc).toBeNull()
      });
    });

  it('should use the builtin call and be up to date',
    () => {
    const dso = {
      data: {
        isUpToDate: true,
        translationsCache: {}
      }
    };
    const lastUpdateDate = new Date();
    const pDate = encodeURI(lastUpdateDate.toISOString());
    const svcUrl = 'https://localhost';
    const url = svcUrl + '?clientDate=' + pDate;
    const httpClient = {
      get: jest.fn(() => of(dso))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'get');
    service.init(httpClient, svcUrl);
    service.getTranslationCacheUpdate(lastUpdateDate)
      .subscribe({
        next: tc => expect(tc).toBeNull()
      });
    expect(spy).toHaveBeenCalledWith(url);
  });

  it('should use the builtin call and return one single translation',
    () => {
      const dso = {
        data: {
          isUpToDate: false,
          translationsCache: {
            "alpha.buttons.add": {
              "en": "Add",
              "fr": "Ajouter",
              "nl": "Toevoegen"
            }
          }
        }
      };
      const lastUpdateDate = new Date();
      const pDate = encodeURI(lastUpdateDate.toISOString());
      const svcUrl = 'https://localhost';
      const url = svcUrl + '?clientDate=' + pDate;
      const httpClient = {
        get: jest.fn(() => of(dso))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'get');
      service.init(httpClient, svcUrl);
      service.getTranslationCacheUpdate(lastUpdateDate)
        .subscribe({
          next: tc =>
            expect(tc?.translations.length)
              .toEqual(1)
        });
      expect(spy).toHaveBeenCalledWith(url);
    });

  it('should use the builtin call and throw an error',
    () => {
      const lastUpdateDate = new Date();
      const pDate = encodeURI(lastUpdateDate.toISOString());
      const svcUrl = 'https://localhost';
      const url = svcUrl + '?clientDate=' + pDate;
      const postErrLog = jest.fn(()=> { })
      const httpClient = {
        get: jest.fn(() => throwError(() => 'error'))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'get');
      service.init(httpClient,  svcUrl, postErrLog);
      service.getTranslationCacheUpdate(lastUpdateDate)
        .subscribe({
          error: e =>
            expect(e.status).toEqual(500)
        });
      expect(spy).toHaveBeenCalledWith(url);
    });

});
