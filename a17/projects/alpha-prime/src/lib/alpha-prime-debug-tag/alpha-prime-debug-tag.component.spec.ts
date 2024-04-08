import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimeDebugTagComponent } from './alpha-prime-debug-tag.component';
import {AlphaPrimeService} from "../alpha-prime.service";

describe('AlphaPrimeDebugTagComponent', () => {
  let component: AlphaPrimeDebugTagComponent;
  let fixture: ComponentFixture<AlphaPrimeDebugTagComponent>;
  let service: AlphaPrimeService;
  let localStore: { [key: string]: string } = {};
  let locationSpy : jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ AlphaPrimeService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaPrimeDebugTagComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AlphaPrimeService);
    fixture.detectChanges();

    // Mock LocalStorage
    const localStorageMock = (function() {
      return {
        getItem: function(key: string) {
          return localStore[key];
        },
        setItem: function(key: string, value: any) {
          localStore[key] = value.toString();
        },
        removeItem: function(key: string) {
          delete localStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Mock Location
    const locationMock = {
      reload: jest.fn()
    } as any;

    // jest.spyOn method to spy on the 'window.location' object
    // @ts-ignore
    locationSpy = jest.spyOn(window, 'location',
      'get').mockReturnValue(locationMock);
  });

  afterEach(() => {
    localStore = {};
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should set visible to false when AlphaPrimeService is in production', () => {
      service.isProduction = true;
      component.ngOnInit();
      expect(localStorage.getItem('alphaHideDebugTag')).toEqual('true');
      expect(component.visible).toBeFalsy();
    });

    it('should set visible based on local storage when AlphaPrimeService is not in production', () => {
      service.isProduction = false;
      localStorage.setItem('alphaHideDebugTag', 'false');
      component.ngOnInit();
      expect(component.visible).toBeTruthy();
    });
  });

  describe('hide', () => {

    it('should hide debug tag and reload the page', () => {
      AlphaPrimeDebugTagComponent.hide(true);
      expect(localStorage.getItem('alphaHideDebugTag')).toEqual('true');
      expect(locationSpy).toHaveBeenCalled();
    });

    it('should un hide debug tag and reload the page', () => {
      AlphaPrimeDebugTagComponent.hide(false);
      expect(localStorage.getItem('alphaHideDebugTag')).toBeUndefined();
      expect(locationSpy).toHaveBeenCalled();
    });

  });

  describe('hidden', () => {
    it('should return true when debug tag is hidden', () => {
      localStorage.setItem('alphaHideDebugTag', 'true');
      expect(AlphaPrimeDebugTagComponent.hidden).toBeTruthy();
    });

    it('should return false when debug tag is not hidden', () => {
      localStorage.removeItem('alphaHideDebugTag');
      expect(AlphaPrimeDebugTagComponent.hidden).toBeFalsy();
    });
  });

});
