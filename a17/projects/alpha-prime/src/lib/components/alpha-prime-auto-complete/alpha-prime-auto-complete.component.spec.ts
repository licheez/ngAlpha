import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimeAutoCompleteComponent } from './alpha-prime-auto-complete.component';
import { FormsModule } from '@angular/forms';
import {AutoCompleteModule, AutoCompleteSelectEvent} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {Observable, Subscriber, Subscription} from "rxjs";
import {IAlphaPrimeAutoCompleteEntry} from "./alpha-prime-auto-complete";
import spyOn = jest.spyOn;

describe('AlphaPrimeAutoCompleteComponent', () => {
  let component: AlphaPrimeAutoCompleteComponent;
  let fixture: ComponentFixture<AlphaPrimeAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ButtonModule,
        AutoCompleteModule,
        InputTextModule,
        RippleModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    fixture = TestBed.createComponent(AlphaPrimeAutoCompleteComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  })

  it('should create and set the feeder', () => {
    expect(component).toBeTruthy();
    component.feeder('test').subscribe({
      next: entries =>
        expect(entries.length).toEqual(0)
    });
  });

  describe('inputStyle', () => {
    it('should have base style', ()  => {
      component.sm = false;
      expect(component.inputStyle)
        .toEqual(component.baseInputStyle);
    });
    it('should have sm style', ()  => {
      component.sm = true;
      expect(component.inputStyle)
        .toEqual(component.smInputStyle);
    });
  });

  describe('set entry', () => {
    it ('should set a undefined entry', () => {
      component.entry = undefined;
      expect(component.model).toBeUndefined();
      expect(component.term).toEqual('');
      expect(component.valid).toBeFalsy();
    });

    it ('should set a defined entry', () => {
      const entry: IAlphaPrimeAutoCompleteEntry = {
        id: '1',
        caption: 'caption',
        data: {}
      };
      component.entry = entry;
      expect(component.model).toBe(entry);
      expect(component.term).toEqual(entry.caption);
      expect(component.valid).toBeTruthy();
    });

  });

  describe('onFeed', () => {

    it('onFeed should clear the feedTimer',() => {
      // create a timer of 100ms
      const mockFn = jest.fn();
      const timer = setTimeout(mockFn, 100);
      component.feedTimer = timer;
      // calling onFeed will
      // (1) clear the existing timer
      // (2) create a new one
      component.onFeed({query: 'someValue'});
      // The initial time should have been cleared
      expect(component.feedTimer).not.toBe(timer);
    });

    it('onFeed should return directly when term is empty', () => {
      component.onFeed({query: ''});
      jest.runAllTimers();
      expect(component.feedTimer).toBeUndefined();
      expect(component.suggestions.length).toEqual(0);
      expect(component.model).toBeUndefined();
      expect(component.valid).toBeFalsy();
      expect(component.term).toEqual('');
    });

    it('onFeed should handle star term', () => {
      const entry: IAlphaPrimeAutoCompleteEntry = {
        id: '1',
        caption: 'caption',
        data: {}
      };
      component.feeder = () => new Observable<IAlphaPrimeAutoCompleteEntry[]>(
        (subscriber: Subscriber<IAlphaPrimeAutoCompleteEntry[]>) => {
          setTimeout(() => {
            subscriber.next([entry]);
            subscriber.complete();
          }, 100)
        });
      component.onFeed({query: '*'});
      jest.advanceTimersByTime(501);
      expect(component.term).toEqual('%');
      expect(component.searching).toBeTruthy();
      expect(component.valid).toBeFalsy();
      expect(component.searchFailed).toBeFalsy();
      jest.runAllTimers();
      expect(component.suggestions.length).toEqual(1);
      expect(component.searching).toBeFalsy();
    });

    it('onFeed should handle feed errors',() => {
      component.feeder = () => new Observable<IAlphaPrimeAutoCompleteEntry[]>(
        (subscriber: Subscriber<IAlphaPrimeAutoCompleteEntry[]>) => {
          setTimeout(() => {
            subscriber.error('someError');
          }, 100)
        });
      component.onFeed({query: 'anyTerm'});
      jest.advanceTimersByTime(501);
      expect(component.term).toEqual('anyTerm');
      expect(component.searching).toBeTruthy();
      expect(component.valid).toBeFalsy();
      expect(component.searchFailed).toBeFalsy();
      jest.runAllTimers();
      expect(component.suggestions.length).toEqual(0);
      expect(component.searching).toBeFalsy();
      expect(component.searchFailed).toBeTruthy();
    });

  });

  describe('clear', () => {
    it ('should clear', () => {
      component.feed = new Subscription();
      component.feedTimer = setTimeout(()=>{}, 10);
      component.clear(true);
      expect(component.feedTimer).toBeUndefined();
      expect(component.feed).toBeTruthy();
      expect(component.suggestions.length).toEqual(0);
      expect(component.model).toBeUndefined();
      expect(component.valid).toBeFalsy();
    })
  });

  describe('onSelected', () => {
    it('should handle onSelected', () => {
      const entry: IAlphaPrimeAutoCompleteEntry = {
        id: '1',
        caption: 'caption',
        data: {}
      };
      const event: AutoCompleteSelectEvent = {
        value: entry,
        originalEvent: new Event('select')
      };
      expect(component).toBeTruthy();
      component.clearOnSelect = true;
      component.onSelected(event);
      expect(component.term).toEqual(entry.caption);
      expect(component.valid).toBeTruthy();
      jest.runAllTimers();
      expect(component.valid).toBeFalsy();
    });
  });

  describe('onClear', () => {
    it('should handle onClear', () => {
      component.term = 'someValue';
      component.valid = true;
      component.onClear();
      expect(component.term).toEqual('');
      expect(component.valid).toBeFalsy();
    })
  });

  describe('onAdd', () => {
    it ('should handle onAdd', () => {
      spyOn(component.addClicked, 'emit');
      component.onAdd();
      expect(component.addClicked.emit)
        .toHaveBeenCalled();
    });
  });
});
