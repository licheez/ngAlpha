import { TestBed } from '@angular/core/testing';

import { AlphaPrimeModalService } from './alpha-prime-modal.service';
import {DialogService} from "primeng/dynamicdialog";

describe('AlphaPrimeModalService', () => {
  let service: AlphaPrimeModalService;
  const dialogServiceMock = {
    open: jest.fn()
  } as unknown as DialogService;
  const postNavigationLogMock = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaPrimeModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should init', () => {
    service.init(dialogServiceMock, postNavigationLogMock, 'someClass');
    expect(service['_ds']).toEqual(dialogServiceMock);
    expect(service['_postNavigationLog']).toEqual(postNavigationLogMock);
    expect(service['_modalStyleClass']).toEqual('someClass');
  });

  it ('should init without styleClass', () => {
    service.init(dialogServiceMock, postNavigationLogMock);
    expect(service['_ds']).toEqual(dialogServiceMock);
    expect(service['_postNavigationLog']).toEqual(postNavigationLogMock);
    expect(service['_modalStyleClass']).toBeUndefined();
  });

  it('openModal should fail when not initialized', () => {
    const component: any = {};
    service
        .openModal<any>(component, 'anchor', 'modal')
        .subscribe({
          error: e => {
            console.log('it should raise an error');
            expect(e).toEqual('AlphaPrimeModalService is not initialized');
          }
        });
  });

  it('openModal should open the modal', () => {
    // Let's mock dialogService with
    // the open method that will pass the component to the
    // ddc.data instance
    const dialogServiceMock = {
      open: jest.fn((component: any, ddc: any) => {
        // this simulates the behaviour of the modal component
        console.log('modal opens', ddc);
        ddc.data.setInstance(component);
      })
    } as unknown as DialogService;

    const component: any = {};
    service.init(
      dialogServiceMock, postNavigationLogMock, 'globalClass');
    service
      .openModal<any>(component, 'anchor', 'modal')
      .subscribe({
        next: c => {
          console.log('the modal is open');
          expect(c).toEqual(component);
        }
      });
  });

});
