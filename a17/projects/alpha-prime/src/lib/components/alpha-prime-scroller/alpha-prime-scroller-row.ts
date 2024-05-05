import {v4 as uuidV4} from 'uuid';

export class AlphaPrimeScrollerRow<T> {
  data: T;
  selected = false;
  disabled = false;
  id = uuidV4();

  /** Evaluated when the method measureHeight is invoked.
   * The measureHeight method is invoked by the [ngStyle] tag
   */
  measuredHeight = -1;

  /** This value is evaluated by the analyseRows method.
   * The analyseRows method is invoked from the ScrollerBag class
   */
  measuredTop = -1;
  /** This value is evaluated by the analyseRows method.
   * The analyseRows method is invoked from the ScrollerBag class
   */
  measuredBottom = -1;

  /**
   * This value is evaluated by the analyseRows method.
   * The analyseRows method is invoked from the ScrollerBag class
   * */
  position: 'unknown' | 'above' | 'partiallyAbove' | 'fullyVisible' |
    'partiallyBellow' | 'bellow' = 'unknown';

  /**
   * This value is evaluated by the analyseRows method.
   * The analyseRows method is invoked from the ScrollerBag class
   * */
  visibleHeight: number = -1;
  /**
   * This value is evaluated by the analyseRows method.
   * The analyseRows method is invoked from the ScrollerBag class
   * */
  hiddenHeight: number = -1;

  get dims(): string {
    const p = this.position;
    const t = Math.round(this.measuredTop);
    const b = Math.round(this.measuredBottom);
    const h = Math.round(this.measuredHeight);
    const vh = Math.round(this.visibleHeight);
    const hh = Math.round(this.hiddenHeight);
    return `p:${p} t:${t} b:${b} h:${h} vh:${vh} hh:${hh}`
  }

  constructor(data: T) {
    this.data = data;
  }

  /**
   This method is called by the html container for this row
   see [ngStyle] tag
   the method
   * sets the measureHeight of the row including the margin
   * and returns the margin
   Remark: there is no processing on the margin.
   The margin is passed as an input parameter
   and returned without any transformation
   This make sure that the measuredHeight is set for
   every row when processed by the *ngFor
   <div *ngFor="let row of chModel.vRows; trackBy: trackByFn"
   #loopItem
   [ngStyle]="{'margin-bottom.px': row.measureHeight(loopItem, 5)}" >
   */
  measureHeight(loopItem: any, margin: number): number {
    const offsetHeight = loopItem.offsetHeight;
    if (offsetHeight > 0
      && this.measuredHeight < offsetHeight) {
      this.measuredHeight = offsetHeight + margin;
    }
    return margin;
  }
}
