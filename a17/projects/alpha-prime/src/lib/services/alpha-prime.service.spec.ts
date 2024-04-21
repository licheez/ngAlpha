import {TestBed} from '@angular/core/testing';

import {AlphaPrimeService} from './alpha-prime.service';
import {DialogService} from "primeng/dynamicdialog";
import {jest} from "@jest/globals";
import {of} from "rxjs";

describe('AlphaPrimeService', () => {
  let service: AlphaPrimeService;
  let mockDialogService: DialogService;

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
    const signIn =
      jest.fn(() => of(false));
    const upload =
      jest.fn(() => of(''));
    const deleteUpload =
      jest.fn(() => of({}));
    const subscribe =
      jest.fn(() => -1);
    const unSubscribe =
      jest.fn(() => {
      });
    const publish =
      jest.fn(() => 0);
    const modalStyleClass = 'custom-modal-style';

    // check that all default methods are running
    service.oas.signIn('me', 'myPwd', true)
      .subscribe({
        next: ok => expect(ok).toBeFalsy()
      });
    const p = service.lbs.publish('payload');
    expect(p).toEqual(0);
    service.uas.upload({}, () => {})
      .subscribe({
        next: res => expect(res).toEqual('')
      });
    service.uas.deleteUpload('')
      .subscribe({
        next: () => expect(true).toBeTruthy()
      });
    const subId = service.lbs.subscribe(() => {
    }, 'x');
    expect(subId).toEqual(-1);
    service.lbs.unSubscribe(subId);
    expect(true).toBeTruthy();

    service.init(
      mockDialogService,
      postNavigationLog,
      getTranslation,
      isProduction,
      {
        signIn
      },
      {
        upload,
        deleteUpload
      },
      {
        publish,
        subscribe,
        unSubscribe
      },
      modalStyleClass);

    expect(service.ds).toEqual(mockDialogService);
    expect(service.postNavigationLog(fakePath, fakeTitle))
      .toBe('Post Navigation Log');
    expect(service.getTr(fakeKey, fakeCode))
      .toBe(`'${fakeKey}' : '${fakeCode}'`);
    expect(service.isProduction).toBe(isProduction);
    expect(service.oas.signIn).toBe(signIn);
    expect(service.uas.upload).toBe(upload);
    expect(service.uas.deleteUpload).toBe(deleteUpload);
    expect(service.lbs.publish).toBe(publish);
    expect(service.lbs.subscribe).toBe(subscribe);
    expect(service.lbs.unSubscribe).toBe(unSubscribe);
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
