import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Type } from '@angular/core';

import { AlphaPrimeModalService } from './alpha-prime-modal.service';
import { IAlphaPrimeModalConfig } from './alpha-prime-modal-abstractions';

describe('AlphaPrimeModalService', () => {
  let service: AlphaPrimeModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaPrimeModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('openModal emits instance and calls postNavigationLog; applies styleClass and draggable default', async () => {
    const postSpy = jasmine.createSpy('postNavigationLog');
    let capturedDdc: IAlphaPrimeModalConfig | undefined;

    const mockDsOpen = (component: Type<any>, ddc: IAlphaPrimeModalConfig) => {
      // capture the config and then simulate the framework providing the instance
      capturedDdc = ddc;
      // call setInstance synchronously to simulate component creation
      if (capturedDdc.data && typeof capturedDdc.data.setInstance === 'function') {
        capturedDdc.data.setInstance({ foo: 'bar' });
      }
      return null;
    };

    service.init(mockDsOpen, postSpy, 'my-modal-class');

    const result = await firstValueFrom(service.openModal(Object as any, 'anchorComp', 'myModal'));

    expect(result).toEqual({ foo: 'bar' });
    expect(capturedDdc).toBeDefined();
    expect(capturedDdc!.styleClass).toBe('my-modal-class');
    expect(capturedDdc!.draggable).toBeTrue();

    const expectedPath = 'anchorComp//myModal';
    const expectedTitle = 'modal myModal from anchorComp';
    expect(postSpy).toHaveBeenCalledWith(expectedPath, expectedTitle);
  });

  it('openModal allows caller-provided styleClass and preserves it', async () => {
    const postSpy = jasmine.createSpy('postNavigationLog');
    let capturedDdc: IAlphaPrimeModalConfig | undefined;

    const mockDsOpen = (component: Type<any>, ddc: IAlphaPrimeModalConfig) => {
      capturedDdc = ddc;
      capturedDdc.data.setInstance('ok');
      return null;
    };

    service.init(mockDsOpen, postSpy, 'global-style');

    const callerDdc: IAlphaPrimeModalConfig = { styleClass: 'caller-style' };

    const result = await firstValueFrom(service.openModal(Object as any, 'A', 'B', callerDdc));
    expect(result).toBe('ok');
    expect(capturedDdc).toBeDefined();
    // caller-provided styleClass should be preserved
    expect(capturedDdc!.styleClass).toBe('caller-style');
  });

  it('openModal when no postNavigationLog provided still returns instance', async () => {
    let capturedDdc: IAlphaPrimeModalConfig | undefined;

    const mockDsOpen = (component: Type<any>, ddc: IAlphaPrimeModalConfig) => {
      capturedDdc = ddc;
      capturedDdc.data.setInstance(42);
      return null;
    };

    // init without postNavigationLog and without modalStyleClass
    service.init(mockDsOpen);

    const result = await firstValueFrom(service.openModal(Object as any, 'x', 'y'));
    expect(result).toBe(42);
    expect(capturedDdc).toBeDefined();
  });
});

