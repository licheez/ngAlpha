import {TestBed} from '@angular/core/testing';

import {AlphaPrimeService} from './alpha-prime.service';
import {DialogService} from "primeng/dynamicdialog";
import {jest} from "@jest/globals";
import {IAlphaLocalBusService, IAlphaOAuthService, IAlphaUploadApiService} from "@pvway/alpha-common";

describe('AlphaPrimeService', () => {
  let service: AlphaPrimeService;
  let mockDialogService: DialogService;
  const mockOas = {
    signIn: jest.fn()
  } as any as IAlphaOAuthService;
  const mockUas = {
    upload: jest.fn(),
    deleteUpload: jest.fn()
  } as any as IAlphaUploadApiService;
  const mockLbs = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  } as any as IAlphaLocalBusService;

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
    const fakePath = 'fake-path';
    const fakeTitle = 'fake-title';
    const fakeKey = 'fake-key';
    const fakeCode = 'fake-code';
    const postNavigationLog =
      jest.fn().mockReturnValue('Post Navigation Log');
    const getTranslation =
      jest.fn(() => `'${fakeKey}' : '${fakeCode}'`);
    const isProduction = true;

    const modalStyleClass = 'custom-modal-style';

    // check that all default methods are running
    service.signIn('me', 'myPwd', true)
      .subscribe({
        next: ok => expect(ok).toBeFalsy()
      });
    const p = service.publish(
      'payload', 'theChannel');
    expect(p).toEqual(0);
    service.upload({}, () => 0)
      .subscribe({
        next: res => expect(res).toEqual('')
      });
    service.deleteUpload('')
      .subscribe({
        next: () => expect(true).toBeTruthy()
      });
    const subId = service.subscribe(() => {
    }, 'x');
    expect(subId).toEqual(-1);
    service.unsubscribe(subId);
    expect(true).toBeTruthy();

    service.init(
      mockDialogService,
      postNavigationLog,
      getTranslation,
      isProduction,
      mockOas,
      mockUas,
      mockLbs,
      modalStyleClass);

    expect(service.ds).toEqual(mockDialogService);
    expect(service.postNavigationLog(fakePath, fakeTitle))
      .toBe('Post Navigation Log');
    expect(service.getTr(fakeKey, fakeCode))
      .toBe(`'${fakeKey}' : '${fakeCode}'`);
    expect(service.isProduction).toBe(isProduction);
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
