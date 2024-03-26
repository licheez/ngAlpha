import {AlphaYmd} from "./alpha-ymd";

describe('AlphaYmd Class', () => {
  let date: Date;
  beforeEach(() => {
    date = new Date();
  });

  it('checks static parse function', () => {
    const result = AlphaYmd.parse(date.toISOString());
    expect(result).toBeInstanceOf(Date);
  });

  it('checks instance stringify function', () => {
    const date = new Date('2023/03/26 14:00:10');
    const alphaYmd = new AlphaYmd(date);
    const result = alphaYmd.stringify();
    expect(result).toEqual('2023-03-26');
  });

  it('checks static stringify function', () => {
    const date = new Date('2023/03/26 14:00:10');
    const result = AlphaYmd.stringify(date);
    expect(result).toEqual('2023-03-26');
  });

  it('checks instance format function', () => {
    const date = new Date('2023/03/26 14:00:10');
    const alphaYmd = new AlphaYmd(date);
    const result = alphaYmd.format();
    expect(result).toEqual('26/03/2023');
  });

  it('checks static format function', () => {
    const date = new Date('2023/03/26 14:00:10');
    // default sep is slash
    let result = AlphaYmd.format(date, 'YMD');
    expect(result).toEqual('2023/03/26');

    result = AlphaYmd.format(date, 'YMD', 'Slash');
    expect(result).toEqual('2023/03/26');

    result = AlphaYmd.format(date, 'YMD', 'Dash');
    expect(result).toEqual('2023-03-26');

    result = AlphaYmd.format(date, 'DMY', 'Dash');
    expect(result).toEqual('26-03-2023');
  });

  it('checks formatRange static function', () => {
    const dt1 = new Date('2023/03/26 14:00:10');
    const dt2 = new Date('2023/03/27 14:00:10');

    const result = AlphaYmd.formatRange(
      dt1, dt2,  ' - ');
    expect(result).toEqual('26/03/2023 - 27/03/2023');
  });

  it('checks toYmd static function', () => {
    const result = AlphaYmd.toYmd(date);
    expect(result).toBeInstanceOf(Date);
  });

  it('checks inYmdRange static function', () => {
    const minDate = new Date('2023-01-01');
    const midDate = new Date('2023-03-01');
    const maxDate = new Date('2023-12-31');
    const result = AlphaYmd.inYmdRange(midDate, minDate, maxDate);
    expect(result).toBe(true);
  });

  it('checks ymdEqual static function', () => {
    const result = AlphaYmd.ymdEqual(date, date);
    expect(result).toBe(true);
  });

  it('checks ymdCompare static function', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-12-31');
    const result = AlphaYmd.ymdCompare(date1, date2);
    expect(result).toBe(-1);
  });
});
