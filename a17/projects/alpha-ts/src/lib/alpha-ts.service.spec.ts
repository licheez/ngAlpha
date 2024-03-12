import {TestBed} from '@angular/core/testing';

import {AlphaTsService} from './alpha-ts.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AlphaTsApiService} from "./alpha-ts-api.service";
import {of, throwError} from "rxjs";
import {AlphaTranslationCache} from "./alpha-translation-cache";
import {AlphaLbsService} from "@pvway/alpha-lbs";

describe('AlphaTsService', () => {
  let service: AlphaTsService;
  let apiSvc: AlphaTsApiService;
  let lbsSvc: AlphaLbsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlphaTsApiService]
    });
    service = TestBed.inject(AlphaTsService);
    httpMock = TestBed.inject(HttpTestingController);
    apiSvc = TestBed.inject(AlphaTsApiService);
    lbsSvc = TestBed.inject(AlphaLbsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('init should bypass api load', () => {
    service.init(true).subscribe({
      next: status => expect(status)
        .toEqual('translations were populated from localStorage')
    });
  });

  it ("should override the api call", () => {
    service.useGetTranslationCacheUpdate(
      ()=>of(null));
    expect(true).toBeTruthy();
  })


  it ('init should call api and get default data', () => {
    const tc = AlphaTranslationCache.default;

    // let's fake the call to the api by returning the
    // default translation cache
    apiSvc.useGetTranslationCacheUpdate(
      () => of(tc));

    service.changeLanguageCode('fr');
    service.init().subscribe({
      next: status => {
        expect(status).toEqual('translations loaded');
        const tr = service.getTr('alpha.buttons.add');
        expect(tr).toEqual('Ajouter');
      }
    });
  });

  it ('init should fail when calling the api', () => {
    // let's fake the call to the api by returning the
    // default translation cache
    apiSvc.useGetTranslationCacheUpdate(
      () => throwError(() => 'error'));

    service.init().subscribe({
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
    const key = 'noKey';
    service.changeLanguageCode('zh');
    const translation = service.getTr(key);
    const err = `key '${key}' not found`;
    expect(translation).toEqual(err);
  });

  it('should listen to language changes', () => {
    lbsSvc.publish('fr','LANGUAGE_CODE_UPDATED');
    const key = 'alpha.buttons.add';
    const translation = service.getTr(key);
    expect(translation).toEqual('Ajouter');
  });

});
