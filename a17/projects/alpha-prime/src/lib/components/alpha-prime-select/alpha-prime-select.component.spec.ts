import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeSelectComponent } from './alpha-prime-select.component';
import {AlphaPrimeSelectInfo} from "./alpha-prime-select-info";

describe('AlphaPrimeSelectComponent', () => {
  let localStore: { [key: string]: string } = {};
  let component: AlphaPrimeSelectComponent;
  let fixture: ComponentFixture<AlphaPrimeSelectComponent>;
  const options = [
    {
      id: '1',
      caption: 'c1',
      disabled: false,
      data: {info: 'i1'}
    },
    {
      id: '2',
      caption: 'c2',
      disabled: true,
      data: {info: 'i2'}
    }
  ];
  const asi =
    AlphaPrimeSelectInfo.First(options);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSelectComponent);
    component = fixture.componentInstance;

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

  afterEach(()=> {
    localStore = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.name.length).toBeGreaterThan(1);
  });

  describe('asi setter / getter', () => {
    it('should set asi as undefined ', () => {
      component.asi = undefined;
      expect(component['_asi']).toBeUndefined();
      expect(component.options.length).toEqual(0);
      expect(component.optionId).toBeUndefined();
      expect(component.asi).toBeUndefined();
    });
    it('should set asi ', () => {
      component.asi = asi;
      expect(component['_asi']).toBe(asi);
      expect(component.options.length).toEqual(2);
      expect(component.optionId).toEqual(asi.options[0].id);
      expect(component.asi).toBe(asi);
    });
  });

  describe('optionId setter / getter', () => {
    it('should set option id to a given value', () => {
      component.asi = AlphaPrimeSelectInfo.LsOrFirst(
        options, 'lsKey');
      const id = options[0].id;
      component.optionId = id;
      expect(component.optionId).toEqual(id);
      const lsId = localStorage.getItem('lsKey');
      expect(lsId).toEqual(id);
    });
  });

  it('should handle onOptionChange', () => {
    component.asi = asi;
    expect(component.options.length).toEqual(2);
    const spy1 = jest.spyOn(component.optionIdChange, 'emit');
    const spy2 = jest.spyOn(component.optionChange, 'emit');
    component.onOptionChange('1');
    expect(component.optionId).toEqual('1');
    expect(spy1).toHaveBeenCalledWith('1');
    expect(spy2).toHaveBeenCalledWith(options[0]);
  });

  it('should handle onClear', () => {
    const spy1 = jest.spyOn(component.optionIdChange, 'emit');
    const spy2 = jest.spyOn(component.optionChange, 'emit');
    component.onClear();
    expect(component.optionId).toBeUndefined();
    expect(spy1).toHaveBeenCalledWith(undefined);
    expect(spy2).toHaveBeenCalledWith(undefined);
  });

  it('should handle onAdd', () => {
    const spy = jest.spyOn(component.addClicked, 'emit');
    component.onAdd();
    expect(spy).toHaveBeenCalled();
  });

});
