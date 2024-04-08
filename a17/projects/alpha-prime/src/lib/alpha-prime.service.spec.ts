import { TestBed } from '@angular/core/testing';

import { AlphaPrimeService } from './alpha-prime.service';
import {DialogService} from "primeng/dynamicdialog";

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
    const modalStyleClass = 'custom-modal-style';
    const postNavigationLog =
      jest.fn().mockReturnValue('Post Navigation Log');
    const getTranslation =
      jest.fn().mockReturnValue(`'${fakeKey}' : '${fakeCode}'`);
    const isProduction = true;

    service.init(
      mockDialogService,
      postNavigationLog, getTranslation,
      isProduction, modalStyleClass);

    expect(service.ds).toEqual(mockDialogService);
    expect(service.postNavigationLog(fakePath, fakeTitle))
      .toBe('Post Navigation Log');
    expect(service.getTr(fakeKey, fakeCode))
      .toBe(`'${fakeKey}' : '${fakeCode}'`);
    expect(service.isProduction).toBe(isProduction);
    expect(service.modalStyleClass).toBe(modalStyleClass);
  });

  it ('should getTr', () => {
    const tr = service.getTr('key','translation');
    expect(tr).toEqual("'key':'translation'");
  });

});
