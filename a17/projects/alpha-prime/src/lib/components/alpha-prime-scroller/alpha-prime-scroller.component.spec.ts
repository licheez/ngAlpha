import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeScrollerComponent } from './alpha-prime-scroller.component';
import {ElementRef, EventEmitter} from "@angular/core";
import {AlphaPrimeScrollerModel} from "./alpha-prime-scroller-model";
import {Observable, Subscriber} from "rxjs";

interface ILine {
  id: string,
  name: string
}

describe('AlphaPrimeScrollerComponent', () => {
  let component: AlphaPrimeScrollerComponent;
  let fixture: ComponentFixture<AlphaPrimeScrollerComponent>;
  const lines: ILine[] = [
    {id: '1', name: 'one'},
    {id: '2', name: 'two'},
    {id: '3', name: 'three'}
  ];
  const feed = jest.fn(
    (skip: number, take: number) => {
      return new Observable<ILine[]>(
        (subscriber: Subscriber<ILine[]>) => {
          setTimeout(() => {
            const pagedLines = lines.slice(skip, skip + take);
            subscriber.next(pagedLines);
            subscriber.complete();
          }, 10)
        });
    });
  const model = new AlphaPrimeScrollerModel(feed);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeScrollerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeScrollerComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['_allItemsFetched']).toBeFalsy();
    expect(component.paddingTop).toEqual(0);
    expect(component.paddingBottom).toEqual(0);
    expect(component.busy).toBeFalsy();
    expect(component['_model']).toBeUndefined();
    expect(component.rows.length).toEqual(0);
    expect(component.mirror).toBeFalsy();
    expect(component.showProgressBar).toBeTruthy();
    expect(component.fixedHeight).toEqual(-1);
    expect(component.allItemsFetched).toBeInstanceOf(EventEmitter);
    expect(component.scrolled).toBeInstanceOf(EventEmitter);
    expect(component.scrollPanelRef).toBeUndefined();
    expect(component['scrollPanel'].scrollTop).toEqual(0);
    expect(component['scrollPanel'].scrollHeight).toEqual(0);
    expect(component['scrollPanel'].clientHeight).toEqual(0);
  });

  it('should set/get the model', () => {
    const spy = jest.spyOn(component.allItemsFetched, 'emit');
    component.model = model;
    expect(component.model).toEqual(model);
    component.paddingTop = 1;
    component.paddingBottom = 1;
    model.loadItems().subscribe();
    jest.advanceTimersByTime(10);
    expect(component['_allItemsFetched']).toBeTruthy();
    expect(component.paddingTop).toEqual(0);
    expect(component.paddingBottom).toEqual(0);
    expect(component.rows.length).toEqual(lines.length);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('ngOnDestroy should call stopListening', () => {
    component.scrollPanelRef = {
      nativeElement: {
        removeEventListener: jest.fn(),
        addEventListener: jest.fn()
      }
    } as unknown as ElementRef;

    const stopListeningSpy =
      jest.spyOn(component, 'stopListening');
    component.ngOnDestroy();
    expect(stopListeningSpy).toHaveBeenCalled();
  });

  it('ngAfterViewInit should call startListening', () => {
    component.scrollPanelRef = {
      nativeElement: {
        removeEventListener: jest.fn(),
        addEventListener: jest.fn()
      }
    } as unknown as ElementRef;
    const spyInstance =
      jest.spyOn(component, 'startListening');
    component.ngAfterViewInit();
    expect(spyInstance).toHaveBeenCalled();
  });

  describe('handleScroll', () => {

    it('should return directly when model is undefined', ()=>{
      const spy = jest.spyOn(component.scrolled, 'emit');
      component.handleScroll();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call slideUp', () => {
      component.scrollPanelRef = {
        nativeElement: {
          scrollTop: 1, // value used by spaceAbove
          clientHeight: 7,
          scrollHeight: 10,
          removeEventListener: jest.fn(),
          addEventListener: jest.fn()
        }
      } as unknown as ElementRef;
      const spy = jest.spyOn(component.scrolled, 'emit');
      const spySlide = jest.spyOn(component, 'slideUp');
      // fake conditions to enter first if block
      component.paddingTop = 5;
      model.visibleFrom = 1;

      component.model = model;
      component.handleScroll();
      expect(spy).toHaveBeenCalledWith(1);
      expect(spySlide).toHaveBeenCalled();
    });

    it('should call slideDown', () => {
      component.scrollPanelRef = {
        nativeElement: {
          scrollTop: 1, // value used by spaceAbove
          clientHeight: 7,
          scrollHeight: 10, // value used by contentHeight
          removeEventListener: jest.fn(),
          addEventListener: jest.fn()
        }
      } as unknown as ElementRef;
      const spy = jest.spyOn(component.scrolled, 'emit');
      const spySlide = jest.spyOn(component, 'slideDown');

      // fake conditions to enter slideDown
      component.paddingTop = 0;
      component.model.visibleTo = 3;

      component.model = model;
      component.handleScroll();
      expect(spy).toHaveBeenCalled();
      expect(spySlide).toHaveBeenCalled();
    });

    it('should feed but all is already fetched', () => {
      component.scrollPanelRef = {
        nativeElement: {
          scrollTop: 1, // value used by spaceAbove
          clientHeight: 7,
          scrollHeight: 10, // value used by contentHeight
          removeEventListener: jest.fn(),
          addEventListener: jest.fn()
        }
      } as unknown as ElementRef;
      const spySlideUp =
        jest.spyOn(component, 'slideUp');
      const spySlideDown =
        jest.spyOn(component, 'slideDown');
      const spyLoad = jest.spyOn(model,'loadNextItems');

      // fake conditions to enter slideDown
      component.paddingTop = 0;
      component.model.visibleTo = 5;

      component.model = model;
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.endReached).toBeTruthy();
      expect(component['_allItemsFetched']).toBeTruthy();

      component.handleScroll();
      expect(spySlideDown).not.toHaveBeenCalled();
      expect(spySlideUp).not.toHaveBeenCalled();
      expect(spyLoad).not.toHaveBeenCalled();
    });

    it('should feed next items with success 1', () => {
      component.scrollPanelRef = {
        nativeElement: {
          scrollTop: 1, // value used by spaceAbove
          clientHeight: 7,
          scrollHeight: 10, // value used by contentHeight
          removeEventListener: jest.fn(),
          addEventListener: jest.fn()
        }
      } as unknown as ElementRef;
      const spySlideUp =
        jest.spyOn(component, 'slideUp');
      const spySlideDown =
        jest.spyOn(component, 'slideDown');

      // fake conditions to enter slideDown
      component.paddingTop = 0;
      component.model.visibleTo = 5;

      component.model = model;
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.endReached).toBeTruthy();
      expect(component['_allItemsFetched']).toBeTruthy();
      // let's fake that there are some extra items to load
      model.endReached = false;
      component['_allItemsFetched'] = false;
      const feedNext = jest.fn(
        () => {
          return new Observable<boolean>(
            (subscriber: Subscriber<boolean>) => {
              setTimeout(() => {
                subscriber.next(true);
                subscriber.complete();
              }, 10)
            });
        });
      model.loadNextItems = feedNext;

      component.handleScroll();
      expect(spySlideDown).not.toHaveBeenCalled();
      expect(spySlideUp).not.toHaveBeenCalled();
      expect(feedNext).toHaveBeenCalled();
      jest.advanceTimersByTime(10);
    });

    it('should feed next items with success 2', () => {
      component.scrollPanelRef = {
        nativeElement: {
          scrollTop: 1, // value used by spaceAbove
          clientHeight: 7,
          scrollHeight: 10, // value used by contentHeight
          removeEventListener: jest.fn(),
          addEventListener: jest.fn()
        }
      } as unknown as ElementRef;
      const spySlideUp =
        jest.spyOn(component, 'slideUp');
      const spySlideDown =
        jest.spyOn(component, 'slideDown');
      const spyLoad =
        jest.spyOn(model,'loadNextItems');

      // fake conditions to enter slideDown
      component.paddingTop = 0;
      component.model.visibleTo = 5;

      component.model = model;
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.endReached).toBeTruthy();
      expect(component['_allItemsFetched']).toBeTruthy();
      // let's fake that there are some extra items to load
      model.endReached = false;
      component['_allItemsFetched'] = false;
      const feedNext = jest.fn(
        () => {
          return new Observable<boolean>(
            (subscriber: Subscriber<boolean>) => {
              setTimeout(() => {
                subscriber.next(false);
                subscriber.complete();
              }, 10)
            });
        });
      model.loadNextItems = feedNext;

      component.handleScroll();
      expect(spySlideDown).not.toHaveBeenCalled();
      expect(spySlideUp).not.toHaveBeenCalled();
      expect(spyLoad).toHaveBeenCalled();
      expect(feedNext).toHaveBeenCalled();
      jest.advanceTimersByTime(10);
    });

    it('should feed next items handling feed error', () => {
      component.scrollPanelRef = {
        nativeElement: {
          scrollTop: 1, // value used by spaceAbove
          clientHeight: 7,
          scrollHeight: 10, // value used by contentHeight
          removeEventListener: jest.fn(),
          addEventListener: jest.fn()
        }
      } as unknown as ElementRef;
      const spySlideUp =
        jest.spyOn(component, 'slideUp');
      const spySlideDown =
        jest.spyOn(component, 'slideDown');
      const spyLoad =
        jest.spyOn(model,'loadNextItems');

      // fake conditions to enter slideDown
      component.paddingTop = 0;
      component.model.visibleTo = 5;

      component.model = model;
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.endReached).toBeTruthy();
      expect(component['_allItemsFetched']).toBeTruthy();
      // let's fake that there are some extra items to load
      model.endReached = false;
      component['_allItemsFetched'] = false;
      const feedNext = jest.fn(
        () => {
          return new Observable<boolean>(
            (subscriber: Subscriber<boolean>) => {
              setTimeout(() => {
                subscriber.error('someError');
                subscriber.complete();
              }, 10)
            });
        });

      model.loadNextItems = feedNext;

      component.handleScroll();
      expect(spySlideDown).not.toHaveBeenCalled();
      expect(spySlideUp).not.toHaveBeenCalled();
      expect(spyLoad).toHaveBeenCalled();
      expect(feedNext).toHaveBeenCalled();
      jest.advanceTimersByTime(10);
    });

  });


});
