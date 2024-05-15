import {AlphaPrimeScrollerRow} from "./alpha-prime-scroller-row";
import {Observable, Subscriber} from "rxjs";

export class AlphaPrimeScrollerModel<T> {
  onLoading: () => any = () => {};
  onLoaded: (item: T | undefined) => any = () => {};

  // for debugging purpose
  spaceAbove = -1;
  panelHeight = -1;
  panelBottom = -1;
  contentHeight = -1;
  spaceBellow = -1;
  paddingTop = -1;
  paddingBottom = -1;
  visibleFrom = 0;
  visibleTo = 0;

  get dims(): string {
    const sa = Math.round(this.spaceAbove);
    const ph = Math.round(this.panelHeight);
    const pb = Math.round(this.panelBottom);
    const ch = Math.round(this.contentHeight);
    const sb = Math.round(this.spaceBellow);
    const padT = Math.round(this.paddingTop);
    const padB = Math.round(this.paddingBottom);
    const vf = this.visibleFrom;
    const vt = this.visibleTo;
    return `sa: ${sa} ph: ${ph} pb:${pb} ch: ${ch} sb:${sb} padT:${padT} padB: ${padB} vf:${vf} vt:${vt}`;
  }

  rows: AlphaPrimeScrollerRow<T>[] = [];
  get nbRows() {
    return this.rows.length;
  };
  endReached = false;

  /** visible rows */
  get vRows(): AlphaPrimeScrollerRow<T>[] {
    return this.rows.slice(this.visibleFrom, this.visibleTo);
  }
  busy = false;

  feed: (skip: number, take: number) => Observable<T[]>;
  take = 10;

  constructor(
    feed: (skip: number, take: number) => Observable<T[]>,
    take?: number) {
    this.feed = feed;
    if (take) {
      this.take = take;
    }
  }

  loadItems(): Observable<T | undefined> {

    this.endReached = false;
    this.onLoading();
    return new Observable<T | undefined>(
      (subscriber: Subscriber<T | undefined>) => {
        this.busy = true;

        this.feed(this.nbRows, this.take)
          .subscribe({
            next: (items: T[]) => {
              this.populateItems(items);
              const item = items.length > 0
                ? items[0] : undefined;
              subscriber.next(item);
              this.busy = false;
              this.endReached = items.length < this.take;
              this.onLoaded(item);
            },
            error: error => {
              console.log(error);
              subscriber.error(error);
              this.busy = false;
            }
          });
      });
  }

  /**
   * called when the list is scrolled till end.
   * Returns false when the number or retrieved
   * items is zero
   * @param from
   */
  loadNextItems(from: number): Observable<boolean> {
    return new Observable(
      (subscriber: Subscriber<any>) => {
        this.busy = true;
        this.feed(this.nbRows, this.take)
          .subscribe({
            next: (items: T[]) => {
              this.appendItems(items, from);
              this.busy = false;
              this.endReached = items.length === 0;
              subscriber.next(!this.endReached);
            },
            error: (error) => {
              console.error('loadNextItems failed with', error);
              this.busy = false;
              subscriber.error(error);
            }
          });
      });
  }

  private populateItems(items: T[]): void {
    this.rows = items.map(
      (item: T) => {
        return new AlphaPrimeScrollerRow<T>(item);
      });
    this.visibleFrom = 0;
    this.visibleTo = items.length;
  }

  findItemIndex(val: any, getVal: (item: T) => any): number {
    return this.rows
      .findIndex(
        (row: AlphaPrimeScrollerRow<T>) => {
          const rowItem = row.data;
          const rowVal = getVal(rowItem);
          return val === rowVal;
        });
  }

  /** removes the element with id = itemId and returns
   * (0) null when not found
   * (1) the element directly following when available
   * (2) the element directly preceding when deleting the last item
   * (3) null if the rows are emptied
   */
  removeItem(itemId: any, getId: (item: T) => any): T | null {
    const i = this.findItemIndex(itemId, getId);
    if (i < 0) {
      return null;
    }
    return this.removeItems(i, 1);
  }

  /** removes the element with id = itemId and returns
   * (0) null when not found
   * (1) the element directly following when available
   * (2) the element directly preceding when deleting the last item
   * (3) null if the rows are emptied
   */
  removeItems(start: number, deleteCount: number): T | null {
    if (deleteCount >= this.nbRows) {
      this.rows = [];
      return null;
    }
    this.rows.splice(start, deleteCount);
    if (start >= this.rows.length) {
      // get the last element
      start = this.rows.length - 1;
    }
    return this.rows[start].data;
  }

  replaceItem(item: T, getId: (item: T) => any): void {
    const itemId = getId(item);
    const i = this.findItemIndex(itemId, getId);
    if (i < 0) {
      return;
    }
    const row = new AlphaPrimeScrollerRow(item);
    this.rows.splice(i, 1, row);
  }

  insertItem(start: number, item: T) {
    const row = new AlphaPrimeScrollerRow<T>(item);
    this.rows.splice(start, 0, row);
    this.visibleTo++;
  }

  prependItem(item: T): void {
    const row = new AlphaPrimeScrollerRow<T>(item);
    this.rows.unshift(row);
    this.visibleFrom = 0;
    this.visibleTo++;
  }

  appendItem(item: T): void {
    const row = new AlphaPrimeScrollerRow<T>(item);
    this.rows.push(row);
    this.visibleTo++;
  }

  appendItems(items: T[], from: number): void {
    const rows = items.map(
      (item: T) => {
        return new AlphaPrimeScrollerRow<T>(item);
      });
    this.rows = this.rows.concat(rows);
    this.visibleFrom = from;
    this.visibleTo = this.rows.length;
  }

  slideItems(from: number, to: number) {
    this.visibleFrom = from;
    this.visibleTo = to;
  }

}
