import { TestBed } from '@angular/core/testing';

import { AlphaPrimeService } from './alpha-prime.service';
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
        { provide: DialogService, useValue: { open: jest.fn() } }
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
    const upload =
      jest.fn(() => of(''));
    const deleteUpload =
      jest.fn((id: string)=>of({}));
    const modalStyleClass = 'custom-modal-style';

    service.init(
      mockDialogService,
      postNavigationLog,
      getTranslation,
      isProduction,
      upload,
      deleteUpload,
      modalStyleClass);

    expect(service.ds).toEqual(mockDialogService);
    expect(service.postNavigationLog(fakePath, fakeTitle))
      .toBe('Post Navigation Log');
    expect(service.getTr(fakeKey, fakeCode))
      .toBe(`'${fakeKey}' : '${fakeCode}'`);
    expect(service.isProduction).toBe(isProduction);
    expect(service.upload).toBe(upload);
    expect(service.deleteUpload).toBe(deleteUpload);
    expect(service.modalStyleClass).toBe(modalStyleClass);
  });

  it ('should getTr', () => {
    const tr = service.getTr('key','translation');
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
