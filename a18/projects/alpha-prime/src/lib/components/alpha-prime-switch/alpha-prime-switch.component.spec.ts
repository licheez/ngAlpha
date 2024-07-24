import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeSwitchComponent } from './alpha-prime-switch.component';
import {EventEmitter} from "@angular/core";
import {IAlphaPrimeSwitchOption} from "./alpha-prime-switch-option";

describe('AlphaPrimeSwitchComponent', () => {
  let localStore: { [key: string]: string } = {};
  let component: AlphaPrimeSwitchComponent;
  let fixture: ComponentFixture<AlphaPrimeSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSwitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSwitchComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    const localStorageMock = (function () {
      return {
        getItem: function (key: string) {
          return localStore[key];
        },
        setItem: function (key: string, value: any) {
          localStore[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete localStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});
  });

  afterEach(() => {
    localStore = {};
  });

  it('should create', () => {
    const emptyOption = {
      caption: '', id: '', selected: true };
    expect(component).toBeTruthy();
    expect(component.name).not.toEqual('');
    expect(component.disabled).toBeFalsy();
    expect(component['_switchOption']).toEqual(emptyOption);
    expect(component.switchOption).toEqual(emptyOption);
    expect(component.switchOptionChange).toBeInstanceOf(EventEmitter);
  });

  it('should handle switchOption setter', () => {
    const lsKey = 'lsKey';
    const so: IAlphaPrimeSwitchOption = {
      caption: 'caption', id: 'id', selected: false, lsItemKey: lsKey
    };
    localStorage.setItem(lsKey, 'true');
    component.switchOption = so;
    expect(component.switchOption.caption).toEqual('caption');
    expect(component.switchOption.id).toEqual('id');
    expect(component.switchOption.selected).toBeTruthy();
  });

  describe('handle onChange', () => {

    it('should handle onChange checked', () => {
      const lsKey = 'lsKey';
      component.switchOption = {
        caption: 'caption', id: 'id', selected: false, lsItemKey: lsKey
      };
      component.onChange({checked: true});
      expect(component.switchOption.selected).toBeTruthy();
      const lsVal = localStorage.getItem(lsKey);
      expect(lsVal).toEqual('true');
    });

    it('should handle onChange unchecked', () => {
      const lsKey = 'lsKey';
      component.switchOption = {
        caption: 'caption', id: 'id', selected: true, lsItemKey: lsKey
      };
      component.onChange({checked: false});
      expect(component.switchOption.selected).toBeFalsy();
      const lsVal = localStorage.getItem(lsKey);
      expect(lsVal).toEqual('false');
    });
  });

  describe('handle onCaptionClicked', () => {
    it ('should handle onCaptionClicked', () => {
      component.switchOption = {
        caption: 'caption', id: 'id', selected: true
      };
      component.onCaptionClicked();
      expect(component.switchOption.selected).toBeFalsy();
      component.onCaptionClicked();
      expect(component.switchOption.selected).toBeTruthy();
    });
  });

});
