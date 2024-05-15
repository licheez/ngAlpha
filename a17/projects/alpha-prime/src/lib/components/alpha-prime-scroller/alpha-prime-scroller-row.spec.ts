import { AlphaPrimeScrollerRow } from './alpha-prime-scroller-row';

describe('AlphaPrimeScrollerRow', () => {
  const item = {
    id: 'someId',
    value: 'someValue'
  };
  it('should create an instance', () => {
    const row = new AlphaPrimeScrollerRow(item);
    expect(row).toBeTruthy();
    expect(row.data).toEqual(item);
    expect(row.selected).toBeFalsy();
    expect(row.disabled).toBeFalsy();
    expect(row.id.length).toEqual(36);
    expect(row.measuredHeight).toEqual(-1);
    expect(row.measuredTop).toEqual(-1);
    expect(row.measuredBottom).toEqual(-1);
  });
  it('should handle measureHeight', () => {
    const row = new AlphaPrimeScrollerRow(item);
    const loopItem = {
      offsetHeight: 10
    };
    row.measureHeight(loopItem, 5);
    expect(row.measuredHeight).toEqual(15);
  });
});
