import { AlphaPrimeScrollerRow } from './alpha-prime-scroller-row';

describe('AlphaPrimeScrollerRow', () => {
  let row: AlphaPrimeScrollerRow<any>;

  beforeEach(() => {
    row = new AlphaPrimeScrollerRow({ id: 1, name: 'Test' });
  });

  it('should create', () => {
    expect(row).toBeTruthy();
  });

  it('should initialize with data', () => {
    expect(row.data).toEqual({ id: 1, name: 'Test' });
  });

  it('should have default values', () => {
    expect(row.selected).toBe(false);
    expect(row.disabled).toBe(false);
    expect(row.measuredHeight).toBe(-1);
    expect(row.measuredTop).toBe(-1);
    expect(row.measuredBottom).toBe(-1);
    expect(row.position).toBe('unknown');
  });

  it('should generate unique id', () => {
    const row1 = new AlphaPrimeScrollerRow({ id: 1 });
    const row2 = new AlphaPrimeScrollerRow({ id: 1 });
    expect(row1.id).not.toEqual(row2.id);
  });

  it('should measure height correctly', () => {
    const mockElement = {
      offsetHeight: 50
    };
    const margin = 5;
    const result = row.measureHeight(mockElement, margin);

    expect(result).toBe(margin);
    expect(row.measuredHeight).toBe(55);
  });

  it('should not reduce measured height', () => {
    const mockElement1 = { offsetHeight: 50 };
    const mockElement2 = { offsetHeight: 30 };

    row.measureHeight(mockElement1, 5);
    expect(row.measuredHeight).toBe(55);

    row.measureHeight(mockElement2, 5);
    expect(row.measuredHeight).toBe(55); // Should remain 55, not reduce to 35
  });

  it('should return dims string', () => {
    row.measuredTop = 10;
    row.measuredBottom = 60;
    row.measuredHeight = 50;
    row.visibleHeight = 50;
    row.hiddenHeight = 0;
    row.position = 'fullyVisible';

    const dims = row.dims;
    expect(dims).toContain('fullyVisible');
    expect(dims).toContain('10'); // top
    expect(dims).toContain('60'); // bottom
  });
});

