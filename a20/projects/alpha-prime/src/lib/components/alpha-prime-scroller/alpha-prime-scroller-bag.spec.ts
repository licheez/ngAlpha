import { AlphaPrimeScrollerBag } from './alpha-prime-scroller-bag';
import { AlphaPrimeScrollerRow } from './alpha-prime-scroller-row';

describe('AlphaPrimeScrollerBag', () => {
  let bag: AlphaPrimeScrollerBag;
  let rows: AlphaPrimeScrollerRow<any>[];

  beforeEach(() => {
    rows = [
      new AlphaPrimeScrollerRow({ id: 1 }),
      new AlphaPrimeScrollerRow({ id: 2 }),
      new AlphaPrimeScrollerRow({ id: 3 })
    ];
    rows[0].measuredHeight = 50;
    rows[1].measuredHeight = 50;
    rows[2].measuredHeight = 50;

    bag = new AlphaPrimeScrollerBag(rows);
  });

  it('should create', () => {
    expect(bag).toBeTruthy();
  });

  it('should initialize with rows', () => {
    expect(bag.rows).toEqual(rows);
    expect(bag.nbRows).toBe(3);
  });

  it('should have default values', () => {
    expect(bag.totalHeightOfInvisibleRowsAbove).toBe(0);
    expect(bag.totalHeightOfInvisibleRowsBellow).toBe(0);
    expect(bag.firstVisibleRow).toBe(-1);
    expect(bag.lastVisibleRow).toBe(-1);
  });

  it('should analyze rows correctly - all visible', () => {
    const contentHeight = 150;
    const fixedHeight = -1;
    const spaceAbove = 0;
    const panelBottom = 150;

    bag.analyseRows(contentHeight, fixedHeight, spaceAbove, panelBottom);

    expect(bag.firstVisibleRow).toBe(0);
    expect(bag.lastVisibleRow).toBe(2);
    expect(bag.totalHeightOfInvisibleRowsAbove).toBe(0);
    expect(bag.totalHeightOfInvisibleRowsBellow).toBe(0);
  });

  it('should analyze rows correctly - some above', () => {
    const contentHeight = 150;
    const fixedHeight = 50;
    const spaceAbove = 100;
    const panelBottom = 200;

    bag.analyseRows(contentHeight, fixedHeight, spaceAbove, panelBottom);

    expect(rows[0].position).toBe('above');
    expect(rows[1].position).toBe('partiallyAbove');
    expect(bag.totalHeightOfInvisibleRowsAbove).toBe(50);
  });

  it('should analyze rows correctly - some below', () => {
    const contentHeight = 150;
    const fixedHeight = 50;
    const spaceAbove = 0;
    const panelBottom = 100;

    bag.analyseRows(contentHeight, fixedHeight, spaceAbove, panelBottom);

    expect(rows[0].position).toBe('fullyVisible');
    expect(rows[1].position).toBe('fullyVisible');
    expect(rows[2].position).toBe('partiallyBellow');
  });

  it('should handle partial visibility', () => {
    const contentHeight = 150;
    const fixedHeight = 50;
    const spaceAbove = 25;
    const panelBottom = 125;

    bag.analyseRows(contentHeight, fixedHeight, spaceAbove, panelBottom);

    expect(rows[0].position).toBe('partiallyAbove');
    expect(rows[0].visibleHeight).toBeGreaterThan(0);
    expect(rows[0].hiddenHeight).toBeGreaterThan(0);
  });

  it('should estimate height for unmeasured rows', () => {
    const unmeasuredRows = [
      new AlphaPrimeScrollerRow({ id: 1 }),
      new AlphaPrimeScrollerRow({ id: 2 }),
      new AlphaPrimeScrollerRow({ id: 3 })
    ];
    // Don't set measuredHeight - they'll be -1

    const bagWithUnmeasured = new AlphaPrimeScrollerBag(unmeasuredRows);
    const contentHeight = 300;
    const fixedHeight = -1;
    const spaceAbove = 0;
    const panelBottom = 300;

    bagWithUnmeasured.analyseRows(contentHeight, fixedHeight, spaceAbove, panelBottom);

    // Should estimate average height
    expect(unmeasuredRows[0].measuredHeight).toBe(100); // 300 / 3
    expect(unmeasuredRows[1].measuredHeight).toBe(100);
  });

  it('should use fixed height when provided', () => {
    const contentHeight = 150;
    const fixedHeight = 75;
    const spaceAbove = 0;
    const panelBottom = 150;

    bag.analyseRows(contentHeight, fixedHeight, spaceAbove, panelBottom);

    expect(rows[0].measuredBottom).toBe(75);
    expect(rows[1].measuredBottom).toBe(150);
  });
});

