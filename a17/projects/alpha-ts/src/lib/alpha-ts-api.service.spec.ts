import {TestBed} from '@angular/core/testing';

import {AlphaTsApiService} from './alpha-ts-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable, Subscriber, throwError} from "rxjs";
import {IAlphaTranslationCache} from "@pvway/alpha-common";


describe('AlphaTsApiService', () => {
  let service: AlphaTsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AlphaTsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', () => {
    service.init(undefined);
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
    const mockData = {
      data: {
        isUpToDate: true,
        translationsCache: {}
      }
    };
    const lastUpdateDate = new Date();
    const pDate = encodeURI(lastUpdateDate.toISOString());
    const svcUrl = 'https://localhost';
    const url = svcUrl + '?clientDate=' + pDate;
    service.init(svcUrl);
    service.getTranslationCacheUpdate(lastUpdateDate)
      .subscribe({
        next: tc => expect(tc).toBeNull()
      });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should use the builtin call and return one single translation',
    () => {
      const mockData = {
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
      service.init(svcUrl);
      service.getTranslationCacheUpdate(lastUpdateDate)
        .subscribe({
          next: tc =>
            expect(tc?.translations.length)
              .toEqual(1)
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

  it('should use the builtin call and throw an error',
    () => {
      const lastUpdateDate = new Date();
      const pDate = encodeURI(lastUpdateDate.toISOString());
      const svcUrl = 'https://localhost';
      const url = svcUrl + '?clientDate=' + pDate;
      const postErrLog = ()=> { }
      service.init(svcUrl, postErrLog);
      service.getTranslationCacheUpdate(lastUpdateDate)
        .subscribe({
          error: e =>
            expect(e.status).toEqual(500)
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush('it failed',
        {
          status: 500,
          statusText: 'server error'
          });
    });

});
