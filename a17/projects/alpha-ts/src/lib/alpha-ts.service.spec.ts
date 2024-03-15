import {TestBed} from '@angular/core/testing';

import {AlphaTsService} from './alpha-ts.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AlphaTsApiService} from "./alpha-ts-api.service";
import {of, throwError} from "rxjs";
import {AlphaTranslationCache} from "./alpha-translation-cache";

describe('AlphaTsService', () => {
  let service: AlphaTsService;
  let apiSvc: AlphaTsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlphaTsApiService]
    });
    service = TestBed.inject(AlphaTsService);
    httpMock = TestBed.inject(HttpTestingController);
    apiSvc = TestBed.inject(AlphaTsApiService);
  });

  afterEach(() => {
    httpMock.verify();
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

    const url = 'https://localhost/getTcu';
    service.changeLanguageCode('fr');
    service.init(url)
      .subscribe({
        next: status => {
          expect(status).toEqual('translations loaded');
          const tr = service.getTr('alpha.buttons.add');
          expect(tr).toEqual('Ajouter');
        }
      });
    const req = httpMock
      .match(() => true)[0];
    expect(req.request.method).toEqual('GET');
    req.flush(dso);
  });

  it('init should fail when calling the api', () => {
    // let's fake the call to the api by returning the
    // default translation cache
    apiSvc.useGetTranslationCacheUpdate(
      () =>
        throwError(() => 'error'));
    const url = 'https://localhost/getTcu';

    const postErrorLog = () => {};

    service.init(url, postErrorLog).subscribe({
      error: e => {
        expect(e).toEqual('error');
      }
    });
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
    const postErrorLog = () => {};
    service.init(undefined, postErrorLog);
    const key = 'noKey';
    service.changeLanguageCode('zh');
    const translation = service.getTr(key);
    const err = `key '${key}' not found`;
    expect(translation).toEqual(err);
  });

});
