import { AlphaPrimeBoldifyPipe } from './alpha-prime-boldify.pipe';

describe('AlphaPrimeBoldifyPipe', () => {
  it('create an instance', () => {
    const pipe = new AlphaPrimeBoldifyPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return empty space when value is null', () => {
    const pipe = new AlphaPrimeBoldifyPipe();
    const r = pipe.transform(null);
    expect(r).toEqual('');
  });

  it('should return the value when args not present', () => {
    const pipe = new AlphaPrimeBoldifyPipe();
    const r = pipe.transform('someValue');
    expect(r).toEqual('someValue');
  });

  it('should return the value when args is null', () => {
    const pipe = new AlphaPrimeBoldifyPipe();
    const r = pipe.transform('someValue', null);
    expect(r).toEqual('someValue');
  });

  it('should return the value when the term is not found', () => {
    const pipe = new AlphaPrimeBoldifyPipe();
    const r = pipe.transform('long life to the King', 'queen');
    expect(r).toEqual('long life to the King');
  });

  it('should boldify when both value and search are set', () => {
    const pipe = new AlphaPrimeBoldifyPipe();
    const r = pipe.transform('Long live to the King', 'king');
    expect(r).toEqual('Long live to the <strong>King</strong>');
  });

});
