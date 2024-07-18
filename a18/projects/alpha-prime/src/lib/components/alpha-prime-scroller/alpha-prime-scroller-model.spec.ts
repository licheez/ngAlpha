import {AlphaPrimeScrollerModel} from './alpha-prime-scroller-model';
import {Observable, Subscriber} from "rxjs";

interface ILine {
  id: string;
  name: string;
}

describe('AlphaPrimeScrollerModel', () => {
  let model: AlphaPrimeScrollerModel<ILine>;
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
  const feedNok = jest.fn(
    () => {
      return new Observable<ILine[]>(
        (subscriber: Subscriber<ILine[]>) => {
          setTimeout(() => {
            subscriber.error('someError');
          }, 10)
        });
    });

  beforeEach(() => {
    jest.useFakeTimers();
    model = new AlphaPrimeScrollerModel<ILine>(
      feed, 2);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create an instance', () => {
    expect(model).toBeTruthy();
    expect(model.feed).toEqual(feed);
    expect(model.take).toEqual(2);
    expect(model.visibleFrom).toEqual(0);
    expect(model.visibleTo).toEqual(0);
    expect(model.nbRows).toEqual(0);
    expect(model.rows).toEqual([]);
  });

  describe('loadItems', () => {

    it('should loadItems with success', () => {
      const onLoadingSpy =
        jest.spyOn(model, 'onLoading');
      const onLoadedSpy =
        jest.spyOn(model, 'onLoaded');
      const load = model.loadItems();
      expect(onLoadingSpy).toHaveBeenCalled();
      load.subscribe(
        {
          next: () => {
            expect(model.busy).toBeTruthy();
          }
        });
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      expect(model.busy).toBeFalsy();
      expect(onLoadedSpy).toHaveBeenCalledWith(lines[0]);

      const vRows = model.vRows;
      expect(vRows.length).toEqual(2);
    });

    it('should loadItems handling the feed error', () => {
      model.feed = feedNok;
      const onLoadingSpy =
        jest.spyOn(model, 'onLoading');
      const onLoadedSpy =
        jest.spyOn(model, 'onLoaded');
      const load = model.loadItems();
      expect(onLoadingSpy).toHaveBeenCalled();
      load.subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(0);
      expect(model.busy).toBeFalsy();
      expect(onLoadedSpy).not.toHaveBeenCalled();
    });

  });

  describe('loadNextItems', () => {

    it('should loadNextItems with success', () => {
      // loading page 1
      model.loadItems().subscribe({
        next: line => {
          expect(line).toEqual(lines[0]);
          // loading page 2
          model.loadNextItems(1).subscribe({
            next: (moreItems) => {
              expect(model.nbRows).toEqual(3);
              expect(moreItems).toBeTruthy();
              // loading page 3... returns empty
              model.loadNextItems(3).subscribe({
                next: (moreItems) => {
                  expect(model.nbRows).toEqual(3)
                  expect(moreItems).toBeFalsy();
                }
              });
            }
          });
        }
      });
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      expect(model.endReached).toBeFalsy();

      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(3);
      expect(model.endReached).toBeFalsy();

      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(3);
      expect(model.endReached).toBeTruthy();
    });

    it('should loadNextItems handling the feed error', () => {
      // loading page 1
      model.loadItems().subscribe({
        next: line => {
          expect(line).toEqual(lines[0]);
          // loading page 2
          // change the feed method so that it fails
          model.feed = feedNok;
          model.loadNextItems(1).subscribe({
            error: e => {
              expect(e).toEqual('someError');
            }
          });
        }
      });
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      jest.advanceTimersByTime(10);
    });

  });

  it('should return 0 finding line with id 1', () => {
    model.loadItems().subscribe({
      next: () => {
        const i = model.findItemIndex(
          '1', item => item.id);
        expect(i).toEqual(0);
      }
    });
    jest.advanceTimersByTime(10);
  });

  describe('removeItem', () => {

    it('should remove a non existing item', () => {
      model.loadItems().subscribe({
        next: () => {
          const line = model.removeItem(
            '3', item => item.id);
          expect(model.nbRows).toEqual(2);
          expect(line).toBeNull();
        }
      });
      jest.advanceTimersByTime(10);
    });

    it('should remove the first item', () => {
      model.loadItems().subscribe({
        next: () => {
          const line = model.removeItem(
            '1', item => item.id);
          expect(model.nbRows).toEqual(1);
          expect(line?.id).toEqual('2');
        }
      });
      jest.advanceTimersByTime(10);
    });

    it('should remove the last item and then all', () => {
      model.loadItems().subscribe({
        next: () => {
          let line = model.removeItem(
            '2', item => item.id);
          expect(model.nbRows).toEqual(1);
          expect(line).not.toBeNull();
          expect(line!.id).toEqual('1');

          line = model.removeItem(
            '1', item => item.id);
          expect(model.nbRows).toEqual(0);
          expect(line?.id).toBeNull();
        }
      });
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(0);
    });

  });

  describe('replaceItem', () => {
    it('should replace an existing item', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      const oldRow = model.rows[0];
      const oldLine = oldRow.data;
      const updatedLine: ILine = {id: oldLine.id, name: 'newName'};
      model.replaceItem(updatedLine,
        item => item.id);
      expect(model.nbRows).toEqual(2);
      const newRow = model.rows[0];
      expect(oldRow.id).not.toEqual(newRow.id);
      expect(newRow.data.id).toEqual('1');
      expect(newRow.data.name).toEqual('newName');
    });

    it('should handle replace with a non existing item', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      const updatedLine: ILine = {id: 'otherId', name: 'newName'};
      model.replaceItem(updatedLine,
        item => item.id);
      expect(model.nbRows).toEqual(2);
    });

  });

  describe('insertItem', () => {

    it ('should insert an item between 1 and 2', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      const vTo = model.visibleTo;
      model.insertItem(1, {
        id: '1.5',
        name: 'insertedItem'
      });
      expect(model.nbRows).toEqual(3);
      expect(model.rows[0].data.id).toEqual('1');
      expect(model.rows[1].data.id).toEqual('1.5');
      expect(model.rows[2].data.id).toEqual('2');
      expect(model.visibleTo).toEqual(vTo + 1);
    });

    it ('should insert an item a line 0', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      model.insertItem(0, {
        id: '0.5',
        name: 'insertedItem'
      });
      expect(model.nbRows).toEqual(3);
      expect(model.rows[0].data.id).toEqual('0.5');
      expect(model.rows[1].data.id).toEqual('1');
      expect(model.rows[2].data.id).toEqual('2');
    });

    it ('should insert an item a line 4', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      model.insertItem(4, {
        id: '2.5',
        name: 'insertedItem'
      });
      expect(model.nbRows).toEqual(3);
      expect(model.rows[0].data.id).toEqual('1');
      expect(model.rows[1].data.id).toEqual('2');
      expect(model.rows[2].data.id).toEqual('2.5');
    });

  });

  describe('prepend item', () => {
    it('should prepend an item', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      model.prependItem({
        id: 'p',
        name: 'prependedItem'
      });
      expect(model.nbRows).toEqual(3);
      expect(model.rows[0].data.id).toEqual('p');
      expect(model.rows[1].data.id).toEqual('1');
      expect(model.rows[2].data.id).toEqual('2');
      expect(model.visibleFrom).toEqual(0);
      expect(model.visibleTo).toEqual(3);
    });
  });

  describe('append item', () => {
    it('should append an item', () => {
      model.loadItems().subscribe();
      jest.advanceTimersByTime(10);
      expect(model.nbRows).toEqual(2);
      model.appendItem({
        id: 'a',
        name: 'appendedItem'
      });
      expect(model.nbRows).toEqual(3);
      expect(model.rows[0].data.id).toEqual('1');
      expect(model.rows[1].data.id).toEqual('2');
      expect(model.rows[2].data.id).toEqual('a');
      expect(model.visibleTo).toEqual(3);
    });
  });

  it('should slide items', () => {
    model.loadItems().subscribe();
    jest.advanceTimersByTime(10);
    expect(model.nbRows).toEqual(2);
    model.slideItems(10, 20);
    expect(model.visibleFrom).toEqual(10);
    expect(model.visibleTo).toEqual(20);
  });

});
