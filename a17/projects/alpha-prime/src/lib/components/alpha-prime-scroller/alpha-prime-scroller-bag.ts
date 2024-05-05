import {AlphaPrimeScrollerRow} from "./alpha-prime-scroller-row";

export class AlphaPrimeScrollerBag {
  // totalHeightOfInvisibleRowsAbove & totalHeightOfInvisibleRowsAbove
  // will sum the height of the invisible rows above and below
  // those values will replace the actual paddingTop
  // paddingBottom on successful injection
  totalHeightOfInvisibleRowsAbove = 0;
  totalHeightOfInvisibleRowsBellow = 0;
  firstVisibleRow = -1;
  lastVisibleRow = -1;

  rows: AlphaPrimeScrollerRow<any>[];
  nbRows: number;

  constructor(rows: AlphaPrimeScrollerRow<any>[]) {
    this.rows = rows;
    this.nbRows = rows.length;
  }

  /**
   * Analyzes the rows in a panel and calculates their positions and heights.
   *
   * @param {number} contentHeight - The total height of the panel's content.
   * @param {number} fixedHeight - The fixed height of each row. Set to 0 for variable height.
   * @param {number} spaceAbove - The space above the scrolling window.
   * @param {number} panelBottom - The bottom position of the panel.
   * @return {void}
   */
  analyseRows(
    contentHeight: number,
    fixedHeight: number,
    spaceAbove: number,
    panelBottom: number): void {

    //const nbRows = this.rows.length;
    const avgHeight = contentHeight / this.nbRows;
    let offset = 0;
    let hiddenHeight = 0;

    this.firstVisibleRow = -1;
    this.lastVisibleRow = -1;
    this.totalHeightOfInvisibleRowsAbove = 0;
    this.totalHeightOfInvisibleRowsBellow = 0;

    for (let i = 0; i < this.nbRows; i++) {
      const row = this.rows[i];
      row.measuredTop = offset;

      let height = fixedHeight > 0
        ? fixedHeight : row.measuredHeight;

      if (height < 0) {
        height = avgHeight;
        row.measuredHeight = avgHeight;
        //console.log(`row ${i} has no height. avg = ${height}`);
      }
      row.measuredBottom = offset + height;

      if (spaceAbove > row.measuredBottom) {
        // this row is fully above the scrolling window
        row.position = 'above';
        row.visibleHeight = 0;
        row.hiddenHeight = height;
        this.totalHeightOfInvisibleRowsAbove += height;
      } else {
        if (this.firstVisibleRow < 0) {
          // capture the index (i) of the first
          // fully or partially visible row
          this.firstVisibleRow = i;
        }
        if (spaceAbove > row.measuredTop) {
          // this row is partially above the scrolling window
          row.position = 'partiallyAbove';
          row.visibleHeight = height - spaceAbove;
          hiddenHeight = height - row.visibleHeight;
          row.hiddenHeight = hiddenHeight;
        } else {
          if (row.measuredTop > panelBottom) {
            // this row is fully bellow the scrolling window
            row.position = 'bellow';
            row.visibleHeight = 0;
            row.hiddenHeight = height;
            this.totalHeightOfInvisibleRowsBellow += height;
            if (this.lastVisibleRow < 0) {
              // capture the index (i) of the first
              // fully invisible row
              this.lastVisibleRow = i - 1;
            }
          }
          else {
            if (row.measuredBottom <= panelBottom){
              row.position = 'fullyVisible';
              row.visibleHeight = height;
              row.hiddenHeight = 0;
            } else {
              row.position = 'partiallyBellow';
              hiddenHeight = row.measuredBottom - panelBottom;
              row.visibleHeight = height - hiddenHeight;
              row.hiddenHeight = hiddenHeight;
            }
          }
        }
      }
      offset += height;
    }

    if (this.lastVisibleRow < 0) {
      // all rows are visible
      this.lastVisibleRow = this.rows.length - 1;
    }

  }
}
