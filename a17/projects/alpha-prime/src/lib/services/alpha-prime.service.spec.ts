import {TestBed} from '@angular/core/testing';

import {AlphaPrimeService} from './alpha-prime.service';
import {DialogService} from "primeng/dynamicdialog";
import {jest} from "@jest/globals";
import {
  IAlphaLocalBusService, IAlphaLoggerService,
  IAlphaOAuthService,
  IAlphaTranslationService,
  IAlphaUploadApiService
} from "@pvway/alpha-common";

describe('AlphaPrimeService', () => {
  let service: AlphaPrimeService;
  let mockDialogService: DialogService;
  const mockTs = {
    getTr: jest.fn()
  } as unknown as IAlphaTranslationService;
  const mockLs = {
    postNavigationLog: jest.fn()
  } as unknown as IAlphaLoggerService;
  const mockOas = {
    signIn: jest.fn()
  } as unknown as IAlphaOAuthService;
  const mockUas = {
    upload: jest.fn(),
    deleteUpload: jest.fn()
  } as unknown as IAlphaUploadApiService;
  const mockLbs = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  } as unknown as IAlphaLocalBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaPrimeService,
        {provide: DialogService, useValue: {open: jest.fn()}}
      ]
    });
    service = TestBed.inject(AlphaPrimeService);
    mockDialogService = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize variables correctly', () => {
    const isProduction = true;

    const modalStyleClass = 'custom-modal-style';

    // check that all default methods are running
    // getTr
    const tr = service.getTr('key', 'lc');
    expect(tr).toEqual("'key':'lc'");

    // postNavigationLog
    // not need to test this nop method

    // signIn
    service.signIn('me', 'myPwd', true)
      .subscribe({
        next: ok => expect(ok).toBeFalsy()
      });

    // upload
    service.upload({}, () => 0)
      .subscribe({
        next: res => expect(res).toEqual('')
      });
    // deleteUpload
    service.deleteUpload('')
      .subscribe({
        next: () => expect(true).toBeTruthy()
      });

    // publish
    const p = service.publish(
      'payload', 'theChannel');
    expect(p).toEqual(0);
    // subscribe
    const subId = service.subscribe(() => {
    }, 'x');
    expect(subId).toEqual(-1);
    // unsubscribe
    service.unsubscribe(subId);
    expect(true).toBeTruthy();

    service.init(
      mockDialogService,
      isProduction,
      mockTs, mockLs,
      mockOas, mockUas, mockLbs,
      modalStyleClass);

    expect(service.ds).toEqual(mockDialogService);
    expect(service.isProduction).toBe(isProduction);
    expect(service.getTr).toBe(mockTs.getTr);
    expect(service.postNavigationLog).toBe(mockLs.postNavigationLog);
    expect(service.signIn).toBe(mockOas.signIn);
    expect(service.upload).toBe(mockUas.upload);
    expect(service.deleteUpload).toBe(mockUas.deleteUpload);
    expect(service.publish).toBe(mockLbs.publish);
    expect(service.subscribe).toBe(mockLbs.subscribe);
    expect(service.unsubscribe).toBe(mockLbs.unsubscribe);
    expect(service.modalStyleClass).toBe(modalStyleClass);
  });

  it('should getTr', () => {
    const tr = service.getTr('key', 'translation');
    expect(tr).toEqual("'key':'translation'");
  });

  describe('generateRandomName', () => {
    it('should generate a name with a default length', () => {
      const r = service.generateRandomName();
      expect(r.length).toEqual(50);
      const r2 = service.generateRandomName();
      expect(r).not.toEqual(r2);
    });
    it('should generate a name with a given length', () => {
      const r = service.generateRandomName(30);
      expect(r.length).toEqual(30);
      const r2 = service.generateRandomName(30);
      expect(r).not.toEqual(r2);
    });
  });

});
