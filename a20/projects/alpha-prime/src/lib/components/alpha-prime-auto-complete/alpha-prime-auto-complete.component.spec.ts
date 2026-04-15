import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {AlphaPrimeAutoCompleteComponent} from './alpha-prime-auto-complete.component';
import {of, Observable, throwError} from 'rxjs';
import {IAlphaPrimeAutoCompleteEntry} from './alpha-prime-auto-complete';
import {signal} from '@angular/core';

describe('AlphaPrimeAutoCompleteComponent', () => {
  let component: AlphaPrimeAutoCompleteComponent;
  let fixture: ComponentFixture<AlphaPrimeAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeAutoCompleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debounce empty query and emits cleared after timeout', fakeAsync(() => {
    spyOn(component.cleared, 'emit');
    component.onFeed({query: ''});
    expect(component.feedTimer).toBeDefined();
    tick(component.timeout);
    expect(component.cleared.emit).toHaveBeenCalled();
    expect(component.feedTimer).toBeUndefined();
  }));

  it('converts "*" to "%" and feeds suggestions', fakeAsync(() => {
    const feederSpy = jasmine.createSpy('feeder').and.returnValue(of([
      {id: '1', caption: 'Apple'} as IAlphaPrimeAutoCompleteEntry
    ]));
    (component as any).feeder = feederSpy;

    component.onFeed({query: '*'});
    tick(component.timeout);

    expect(feederSpy).toHaveBeenCalledWith('%');
    expect(component.suggestions().length).toBe(1);
    expect(component.searching).toBeFalse();
  }));

  it('clears unsubscribes feed and empties suggestions', fakeAsync(() => {
    let unsubscribed = false;
    const obs = new Observable<IAlphaPrimeAutoCompleteEntry[]>(() => {
      // no emissions needed for this test; return teardown to mark unsubscribe
      return () => {
        unsubscribed = true;
      };
    });
    (component as any).feeder = () => obs;

    component.onFeed({query: 'a'});
    tick(component.timeout);
    expect(component.feed).toBeDefined();

    component.clear(true);
    expect(component.feed).toBeUndefined();
    expect(component.suggestions().length).toBe(0);
    // ensure teardown ran (unsubscribed became true)
    expect(unsubscribed).toBeTrue();
  }));

  it('onSelected emits and clears when clearOnSelect is true', fakeAsync(() => {
    spyOn(component.selected, 'emit');
    spyOn(component.cleared, 'emit');

    component.clearOnSelect = true;
    const entry = {id: '2', caption: 'Banana'} as IAlphaPrimeAutoCompleteEntry;

    component.onSelected({originalEvent: null, value: entry} as any);

    expect(component.selected.emit).toHaveBeenCalledWith(entry);
    expect(component.term).toBe('Banana');
    expect(component.valid).toBeTrue();

    // the component schedules a short clear when clearOnSelect is true
    tick(100);
    expect(component.suggestions().length).toBe(0);
    expect(component.term).toBe('');
    // clear(false) should not emit cleared
    expect(component.cleared.emit).not.toHaveBeenCalled();
  }));

  it('onAdd emits current term', () => {
    spyOn(component.addClicked, 'emit');
    component.term = 'my-term';
    component.onAdd();
    expect(component.addClicked.emit).toHaveBeenCalledWith('my-term');
  });

  it('ngOnDestroy cleans pending timer and subscription', fakeAsync(() => {
    let unsubscribed = false;
    const obs = new Observable<IAlphaPrimeAutoCompleteEntry[]>(() => {
      return () => {
        unsubscribed = true;
      };
    });
    (component as any).feeder = () => obs;

    component.onFeed({query: 'x'});
    // let the timer fire and create the subscription
    tick(component.timeout);
    expect(component.feed).toBeDefined();

    component.ngOnDestroy();

    expect(component.feedTimer).toBeUndefined();
    expect(component.feed).toBeUndefined();
    // ensure teardown ran
    expect(unsubscribed).toBeTrue();
  }));

  it('should use the default feeder if none is provided', fakeAsync(() => {
    component.feeder('').subscribe({
      next: (entries) => {
        expect(entries).toEqual([]);
      },
      error: () => {
        fail('Default feeder should not error');
      }
    });
  }));

  it('should set entry correctly', fakeAsync(() => {
    component.entry = undefined;
    expect(component.model).toBeUndefined();
    expect(component.term).toEqual('');
    expect(component.valid).toBeFalse();

    const entry = {id: '1', caption: 'Apple'} as IAlphaPrimeAutoCompleteEntry;
    component.entry = entry;
    expect(component.model).toEqual(entry);
    expect(component.term).toEqual(entry.caption);
    expect(component.valid).toBeTrue();
  }));

  it('should manage sm flag', fakeAsync(() => {
    (component as any).sm = signal(true);
    expect(component.inputStyle).toEqual(component.smInputStyle);
  }));

  it('clears existing feedTimer when onFeed is called', fakeAsync(() => {
    // arrange: create an existing timer
    component.feedTimer = setTimeout(() => {
    }, 1000);
    const previousTimer = component.feedTimer;

    // spy the global clearTimeout
    const clearSpy = spyOn(window as any, 'clearTimeout');

    // act: call onFeed which should clear the previous timer synchronously
    component.onFeed({query: 'x'});

    // assert
    expect(clearSpy).toHaveBeenCalledWith(previousTimer);

    // cleanup: remove any newly created timer to avoid leaking timers
    if (component.feedTimer) {
      clearTimeout(component.feedTimer);
      component.feedTimer = undefined;
    }
  }));

  it('should log feed error', fakeAsync(() => {
    const spy = spyOn(console, 'error');
    component.feeder = () => throwError(() => 'Feeder error');

    component.onFeed({ query: 'error' });
    // timer should be scheduled
    expect(component.feedTimer).toBeDefined();

    // advance time to fire the timeout and subscribe (which errors)
    tick(component.timeout);

    expect(spy).toHaveBeenCalledWith('Feeder error');
    expect(component.searchFailed).toBeTrue();
    expect(component.searching).toBeFalse();

    // cleanup to avoid leaking timers/subscriptions
    if (component.feed) {
      component.feed.unsubscribe();
      component.feed = undefined;
    }
    if (component.feedTimer) {
      clearTimeout(component.feedTimer);
      component.feedTimer = undefined;
    }
  }));

  it('onClear calls clear(true)', () => {
    const clearSpy = spyOn(component, 'clear');
    component.onClear();
    expect(clearSpy).toHaveBeenCalledWith(true);
  });

});
