import { AlphaPrimeScrollerModel } from './alpha-prime-scroller-model';
import { Observable, Subscriber } from 'rxjs';

interface ITestItem {
  id: string;
  name: string;
}

describe('AlphaPrimeScrollerModel', () => {
  let model: AlphaPrimeScrollerModel<ITestItem>;
  const testItems: ITestItem[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
    { id: '4', name: 'Item 4' },
    { id: '5', name: 'Item 5' }
  ];

  const feed = (skip: number, take: number) => {
    return new Observable<ITestItem[]>((subscriber: Subscriber<ITestItem[]>) => {
      setTimeout(() => {
        const pagedItems = testItems.slice(skip, skip + take);
        subscriber.next(pagedItems);
        subscriber.complete();
      }, 10);
    });
  };

  beforeEach(() => {
    model = new AlphaPrimeScrollerModel(feed, 2);
  });

  it('should create', () => {
    expect(model).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(model.rows).toEqual([]);
    expect(model.nbRows).toBe(0);
    expect(model.endReached).toBe(false);
    expect(model.busy).toBe(false);
    expect(model.take).toBe(2);
  });

  it('should load items', (done) => {
    model.loadItems().subscribe({
      next: (item) => {
        expect(model.nbRows).toBe(2);
        expect(model.vRows.length).toBe(2);
        expect(model.endReached).toBe(false);
        done();
      },
      error: () => done.fail()
    });
  });

  it('should populate rows on loadItems', (done) => {
    model.loadItems().subscribe({
      next: () => {
        expect(model.rows[0].data).toEqual(testItems[0]);
        expect(model.rows[1].data).toEqual(testItems[1]);
        done();
      },
      error: () => done.fail()
    });
  });

  it('should set endReached when fewer items than take', (done) => {
    const smallFeed = (skip: number, take: number) => {
      return new Observable<ITestItem[]>((subscriber: Subscriber<ITestItem[]>) => {
        setTimeout(() => {
          const pagedItems = testItems.slice(skip, skip + take);
          subscriber.next(pagedItems.slice(0, 1)); // Return only 1 item
          subscriber.complete();
        }, 10);
      });
    };

    const smallModel = new AlphaPrimeScrollerModel(smallFeed, 2);
    smallModel.loadItems().subscribe({
      next: () => {
        // Verify after the observable completes
        setTimeout(() => {
          expect(smallModel.endReached).toBe(true);
          done();
        }, 20);
      }
    });
  });

  it('should call onLoaded callback', (done) => {
    let onLoadedCalled = false;
    let callbackItem: any = null;
    model.onLoaded = (item: any) => {
      onLoadedCalled = true;
      callbackItem = item;
    };

    model.loadItems().subscribe({
      next: () => {
        setTimeout(() => {
          expect(onLoadedCalled).toBe(true);
          expect(callbackItem).toBeDefined();
          done();
        }, 20); // Wait for callback to be invoked
      }
    });
  });

  it('should find item by custom getter', (done) => {
    model.loadItems().subscribe({
      next: () => {
        const index = model.findItemIndex('1', (item) => item.id);
        expect(index).toBe(0);
        done();
      }
    });
  });

  it('should return -1 for not found item', (done) => {
    model.loadItems().subscribe({
      next: () => {
        const index = model.findItemIndex('99', (item) => item.id);
        expect(index).toBe(-1);
        done();
      }
    });
  });

  it('should slide items', (done) => {
    model.loadItems().subscribe({
      next: () => {
        model.slideItems(1, 2);
        expect(model.visibleFrom).toBe(1);
        expect(model.visibleTo).toBe(2);
        done();
      }
    });
  });

  it('should append items', (done) => {
    model.loadItems().subscribe({
      next: () => {
        const initialCount = model.nbRows;
        model.appendItem({ id: '6', name: 'Item 6' });
        expect(model.nbRows).toBe(initialCount + 1);
        done();
      }
    });
  });

  it('should get visible rows correctly', (done) => {
    model.loadItems().subscribe({
      next: () => {
        model.slideItems(0, 1);
        const vRows = model.vRows;
        expect(vRows.length).toBe(1);
        expect(vRows[0].data).toEqual(testItems[0]);
        done();
      }
    });
  });
});

