import { TestBed } from '@angular/core/testing';

import { AlphaPrimeModalService } from './alpha-prime-modal.service';

describe('AlphaPrimeModalService', () => {
  let service: AlphaPrimeModalService;
  const dsOpen = jest.fn();
  const postNavigationLog = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaPrimeModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should init', () => {
    service.init(dsOpen, postNavigationLog,  'someClass');
    expect(service['dsOpen']).toEqual(dsOpen);
    expect(service['postNavigationLog']).toEqual(postNavigationLog);
    expect(service['modalStyleClass']).toEqual('someClass');
  });

  it ('should init without styleClass', () => {
    service.init(dsOpen, postNavigationLog);
    expect(service['dsOpen']).toEqual(dsOpen);
    expect(service['postNavigationLog']).toEqual(postNavigationLog);
    expect(service['modalStyleClass']).toBeUndefined();
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
    const dsOpen= jest.fn((component: any, ddc: any) => {
        // this simulates the behaviour of the modal component
        console.log('modal opens', ddc);
        ddc.data.setInstance(component);
      });

    const component: any = {};
    service.init(
      dsOpen, postNavigationLog, 'globalClass');
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
