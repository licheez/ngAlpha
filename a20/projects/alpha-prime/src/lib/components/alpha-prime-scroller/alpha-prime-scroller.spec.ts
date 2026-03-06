import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimeScroller } from './alpha-prime-scroller';
import { AlphaPrimeScrollerModel } from './alpha-prime-scroller-model';
import { Observable, Subscriber } from 'rxjs';

interface ILine {
  id: string,
  name: string
}

describe('AlphaPrimeScroller', () => {
  let component: AlphaPrimeScroller;
  let fixture: ComponentFixture<AlphaPrimeScroller>;

  const lines: ILine[] = [
    {id: '1', name: 'one'},
    {id: '2', name: 'two'},
    {id: '3', name: 'three'}
  ];

  const feed = (skip: number, take: number) => {
    return new Observable<ILine[]>(
      (subscriber: Subscriber<ILine[]>) => {
        setTimeout(() => {
          const pagedLines = lines.slice(skip, skip + take);
          subscriber.next(pagedLines);
          subscriber.complete();
        }, 10)
      });
  };

  const model = new AlphaPrimeScrollerModel(feed);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeScroller]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeScroller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.paddingTop()).toBe(0);
    expect(component.paddingBottom()).toBe(0);
  });

  it('should have output events', () => {
    expect(component.allItemsFetched).toBeDefined();
    expect(component.scrolled).toBeDefined();
  });
});

