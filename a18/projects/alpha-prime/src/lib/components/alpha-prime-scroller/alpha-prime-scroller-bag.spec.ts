import { AlphaPrimeScrollerBag } from './alpha-prime-scroller-bag';
import {AlphaPrimeScrollerRow} from "./alpha-prime-scroller-row";

describe('AlphaPrimeScrollerBag', () => {

  const row0 =
    new AlphaPrimeScrollerRow<any>({});
  row0.measuredHeight = 1;

  const row1 =
    new AlphaPrimeScrollerRow<any>({});
  row1.measuredHeight = 2;

  const row2 =
    new AlphaPrimeScrollerRow<any>({});
  row2.measuredHeight = 3;

  const row3 =
    new AlphaPrimeScrollerRow<any>({});
  row3.measuredHeight = 5;

  const row4 =
    new AlphaPrimeScrollerRow<any>({});
  row4.measuredHeight = 8;

  const allRows: AlphaPrimeScrollerRow<any>[] = [
    row0, row1, row2, row3, row4
  ];

  it('should create an instance', () => {
    const sb = new AlphaPrimeScrollerBag(allRows);
    expect(sb).toBeTruthy();
    expect(sb.rows.length).toEqual(allRows.length);
    expect(sb.nbRows).toEqual(allRows.length);
    expect(sb.totalHeightOfInvisibleRowsAbove).toEqual(0);
    expect(sb.totalHeightOfInvisibleRowsBellow).toEqual(0);
    expect(sb.firstVisibleRow).toEqual(-1);
    expect(sb.lastVisibleRow).toEqual(-1);
  });

  describe('analyseRows', () => {

    it('should handle fixed height 2 when space above is 0', () => {
      // panelHeight 7 contentHeight 19 (sum of row measured height)
      // spaceAbove 0 => panelBottom 7
      const ph = 7;
      const ch = 19;
      const sa = 0;
      const pb = sa + ph;

      const sb = new AlphaPrimeScrollerBag(allRows);

      sb.rows.forEach(row => {
        row.measuredTop = -1;
        row.measuredBottom = -1;
        row.position = 'unknown';
        row.visibleHeight = -1;
        row.hiddenHeight = -1;
      });

      // fixedHeight is 2
      sb.analyseRows(ch, 2, sa, pb);

      expect(row0.measuredTop).toEqual(0);
      expect(row0.measuredBottom).toEqual(2);
      expect(row0.position).toEqual('fullyVisible');

      expect(row1.measuredTop).toEqual(2);
      expect(row1.measuredBottom).toEqual(4);
      expect(row1.position).toEqual('fullyVisible');

      expect(row2.measuredTop).toEqual(4);
      expect(row2.measuredBottom).toEqual(6);
      expect(row2.position).toEqual('fullyVisible');

      expect(row3.measuredTop).toEqual(6);
      expect(row3.measuredBottom).toEqual(8);
      expect(row3.position).toEqual('partiallyBellow');

      expect(row4.measuredTop).toEqual(8);
      expect(row4.measuredBottom).toEqual(10);
      expect(row4.position).toEqual('bellow');

      expect(sb.firstVisibleRow).toEqual(0);
      expect(sb.lastVisibleRow).toEqual(3);
      expect(sb.totalHeightOfInvisibleRowsAbove).toEqual(0);
      expect(sb.totalHeightOfInvisibleRowsBellow).toEqual(2);
    });

    it('should handle fixed height 2 when space above is 3', () => {
      // panelHeight 7 contentHeight 19 (sum of row measured height)
      // spaceAbove 0 => panelBottom 7
      const ph = 7;
      const ch = 19;
      const sa = 3;
      const pb = sa + ph;

      const sb = new AlphaPrimeScrollerBag(allRows);

      sb.rows.forEach(row => {
        row.measuredTop = -1;
        row.measuredBottom = -1;
        row.position = 'unknown';
        row.visibleHeight = -1;
        row.hiddenHeight = -1;
      });

      // fixedHeight is 2
      sb.analyseRows(ch, 2, sa, pb);

      expect(row0.measuredTop).toEqual(0);
      expect(row0.measuredBottom).toEqual(2);
      expect(row0.position).toEqual('above');
      expect(row0.visibleHeight).toEqual(0);
      expect(row0.hiddenHeight).toEqual(2);

      expect(row1.measuredTop).toEqual(2);
      expect(row1.measuredBottom).toEqual(4);
      expect(row1.position).toEqual('partiallyAbove');
      expect(row1.visibleHeight).toEqual(-1);
      expect(row1.hiddenHeight).toEqual(3);

      expect(row2.measuredTop).toEqual(4);
      expect(row2.measuredBottom).toEqual(6);
      expect(row2.position).toEqual('fullyVisible');
      expect(row2.visibleHeight).toEqual(2);
      expect(row2.hiddenHeight).toEqual(0);

      expect(row3.measuredTop).toEqual(6);
      expect(row3.measuredBottom).toEqual(8);
      expect(row3.position).toEqual('fullyVisible');
      expect(row3.visibleHeight).toEqual(2);
      expect(row3.hiddenHeight).toEqual(0);

      expect(row4.measuredTop).toEqual(8);
      expect(row4.measuredBottom).toEqual(10);
      expect(row4.position).toEqual('fullyVisible');
      expect(row4.visibleHeight).toEqual(2);
      expect(row4.hiddenHeight).toEqual(0);

      expect(sb.firstVisibleRow).toEqual(1);
      expect(sb.lastVisibleRow).toEqual(4);
      expect(sb.totalHeightOfInvisibleRowsAbove).toEqual(2);
      expect(sb.totalHeightOfInvisibleRowsBellow).toEqual(0);
    });

    it('should handle item measuredHeight when space above is 0', () => {
      // panelHeight 7 contentHeight 19 (sum of row measured height)
      // spaceAbove 0 => panelBottom 7
      const ph = 7;
      const ch = 19;
      const sa = 0;
      const pb = sa + ph;

      const sb = new AlphaPrimeScrollerBag(allRows);

      sb.rows.forEach(row => {
        row.measuredTop = -1;
        row.measuredBottom = -1;
        row.position = 'unknown';
        row.visibleHeight = -1;
        row.hiddenHeight = -1;
      });

      sb.analyseRows(ch, -1, sa, pb);

      // row height 1
      expect(row0.measuredTop).toEqual(0);
      expect(row0.measuredBottom).toEqual(1);
      expect(row0.position).toEqual('fullyVisible');
      expect(row0.visibleHeight).toEqual(1);
      expect(row0.hiddenHeight).toEqual(0);

      // row height 2
      expect(row1.measuredTop).toEqual(1);
      expect(row1.measuredBottom).toEqual(3);
      expect(row1.position).toEqual('fullyVisible');
      expect(row1.visibleHeight).toEqual(2);
      expect(row1.hiddenHeight).toEqual(0);

      // row height 3
      expect(row2.measuredTop).toEqual(3);
      expect(row2.measuredBottom).toEqual(6);
      expect(row2.position).toEqual('fullyVisible');
      expect(row2.visibleHeight).toEqual(3);
      expect(row2.hiddenHeight).toEqual(0);

      // row height 5
      expect(row3.measuredTop).toEqual(6);
      expect(row3.measuredBottom).toEqual(11);
      expect(row3.position).toEqual('partiallyBellow');
      expect(row3.visibleHeight).toEqual(1);
      expect(row3.hiddenHeight).toEqual(4);

      // row height 8
      expect(row4.measuredTop).toEqual(11);
      expect(row4.measuredBottom).toEqual(19);
      expect(row4.position).toEqual('bellow');
      expect(row4.visibleHeight).toEqual(0);
      expect(row4.hiddenHeight).toEqual(8);

      expect(sb.firstVisibleRow).toEqual(0);
      expect(sb.lastVisibleRow).toEqual(3);
      expect(sb.totalHeightOfInvisibleRowsAbove).toEqual(0);
      expect(sb.totalHeightOfInvisibleRowsBellow).toEqual(8);
    });

    it('should handle item measuredHeight -1 when space above is 0', () => {
      // panelHeight 7 contentHeight 19 (sum of row measured height)
      // spaceAbove 0 => panelBottom 7
      const ph = 7;
      const ch = 19;
      const sa = 0;
      const pb = sa + ph;

      const sb = new AlphaPrimeScrollerBag(allRows);

      sb.rows.forEach(row => {
        row.measuredTop = -1;
        row.measuredBottom = -1;
        row.position = 'unknown';
        row.visibleHeight = -1;
        row.hiddenHeight = -1;
      });

      row4.measuredHeight = -1;

      sb.analyseRows(ch, -1, sa, pb);

      // row 0 height 1
      expect(row0.measuredTop).toEqual(0);
      expect(row0.measuredBottom).toEqual(1);
      expect(row0.position).toEqual('fullyVisible');
      expect(row0.visibleHeight).toEqual(1);
      expect(row0.hiddenHeight).toEqual(0);

      // row 1 height 2
      expect(row1.measuredTop).toEqual(1);
      expect(row1.measuredBottom).toEqual(3);
      expect(row1.position).toEqual('fullyVisible');
      expect(row1.visibleHeight).toEqual(2);
      expect(row1.hiddenHeight).toEqual(0);

      // row 2 height 3
      expect(row2.measuredTop).toEqual(3);
      expect(row2.measuredBottom).toEqual(6);
      expect(row2.position).toEqual('fullyVisible');
      expect(row2.visibleHeight).toEqual(3);
      expect(row2.hiddenHeight).toEqual(0);

      // row 3 height 5
      expect(row3.measuredTop).toEqual(6);
      expect(row3.measuredBottom).toEqual(11);
      expect(row3.position).toEqual('partiallyBellow');
      expect(row3.visibleHeight).toEqual(1);
      expect(row3.hiddenHeight).toEqual(4);

      // row 4 height 8
      expect(row4.measuredTop).toEqual(11);
      expect(row4.measuredBottom).toEqual(14.8);
      expect(row4.position).toEqual('bellow');
      expect(row4.visibleHeight).toEqual(0);
      expect(row4.hiddenHeight).toEqual(3.8);

      expect(sb.firstVisibleRow).toEqual(0);
      expect(sb.lastVisibleRow).toEqual(3);
      expect(sb.totalHeightOfInvisibleRowsAbove).toEqual(0);
      expect(sb.totalHeightOfInvisibleRowsBellow).toEqual(3.8);
    });

  });
});
