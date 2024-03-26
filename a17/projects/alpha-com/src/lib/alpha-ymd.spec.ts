import dayjs from 'dayjs';
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
    const result = AlphaYmd.stringify(date);
    expect(result).toBe(dayjs(date).format('YYYY-MM-DD'));
  });

  it('checks instance format function', () => {
    const alphaYmd = new AlphaYmd(date);
    const result = alphaYmd.format();
    expect(result).toBe(dayjs(date).format('DD/MM/YYYY'));
  });

  it('checks static format function', () => {
    const result = AlphaYmd.format(date);
    expect(result).toBe(dayjs(date).format('DD/MM/YYYY'));
  });

  it('checks formatRange static function', () => {
    const result = AlphaYmd.formatRange(date, new Date());
    const sDate = dayjs(date).format('DD/MM/YYYY');
    const eDate = dayjs(new Date()).format('DD/MM/YYYY');
    expect(result).toBe(`${sDate}-${eDate}`);
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
