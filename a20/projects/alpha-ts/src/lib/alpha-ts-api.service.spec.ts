import {TestBed} from '@angular/core/testing';

import {AlphaTsApiService} from './alpha-ts-api.service';
import {Observable, of, Subscriber, throwError} from "rxjs";
import {IAlphaTranslationCache} from "./alpha-ts-abstractions";
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AlphaTranslationCache} from './alpha-translation-cache';

describe('AlphaTsApiService', () => {
  let service: AlphaTsApiService;
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaTsApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AlphaTsApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(
    () => {
      httpTesting.verify();
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
            sub.complete();
          });
      });
      const today = new Date();
      service.getTranslationCacheUpdate(today).subscribe({
        next: tc => expect(tc).toBeNull()
      });
    });

  it('should use the builtin call and return the default cache',
    () => {
      const tc = AlphaTranslationCache.default;
      const nbTranslations = Object.keys(tc).length;
      const now = new Date();
      service.getTranslationCacheUpdate(now).subscribe({
        next: res =>
          expect(Object.keys(res!).length).toEqual(nbTranslations)
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
      const now = new Date();
      const pDate = encodeURI(now.toISOString());
      const svcUrl = 'https://localhost';
      const effectiveUrl = svcUrl + '?clientDate=' + pDate;
      service.init(httpClient, svcUrl);
      service.getTranslationCacheUpdate(now)
        .subscribe({
          next: tc => expect(tc).toBeNull()
        });

      const httpReq = httpTesting.expectOne(effectiveUrl);
      expect(httpReq.request.method).toEqual('GET');
      httpReq.flush(dso);
    });

  it('should use the builtin call and return one single translation', () => {
      const dso = {
        data: {
          isUpToDate: false,
          translationsCache: {
            lastUpdateDate: new Date().toDateString(),
            translations: {
              "alpha.buttons.add": {
                "en": "Add",
                "fr": "Ajouter",
                "nl": "Toevoegen"
              }
            }
          }
        }
      };
      const lastUpdateDate = new Date();
      const pDate = encodeURI(lastUpdateDate.toISOString());
      const svcUrl = 'https://localhost';
      const effectiveUrl = svcUrl + '?clientDate=' + pDate;
      service.init(httpClient, svcUrl);
      service.getTranslationCacheUpdate(lastUpdateDate)
        .subscribe({
          next: tc => {
            expect(Object.keys(tc!.translations).length)
              .toEqual(1);
          }
        });
      const httpReq = httpTesting.expectOne(effectiveUrl);
      expect(httpReq.request.method).toEqual('GET');
      httpReq.flush(dso);
    });

  it('should use the builtin call and throw an error',
    () => {
      const lastUpdateDate = new Date();
      const pDate = encodeURI(lastUpdateDate.toISOString());
      const svcUrl = 'https://localhost';
      const url = svcUrl + '?clientDate=' + pDate;
      const postErrLog = () => { };
      service.init(httpClient, svcUrl, postErrLog);
      service.getTranslationCacheUpdate(lastUpdateDate)
        .subscribe({
          error: e =>
            expect(e.status).toEqual(500)
        });
      const httpReq = httpTesting.expectOne(url);
      expect(httpReq.request.method).toEqual('GET');
      httpReq.flush('error', {status: 500, statusText: 'Server Error'});
    });

});
