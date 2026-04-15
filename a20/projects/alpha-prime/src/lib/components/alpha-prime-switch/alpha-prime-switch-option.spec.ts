import { AlphaPrimeSwitchOption } from './alpha-prime-switch-option';

describe('AlphaPrimeSwitchOption', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create an instance and read localStorage when key exists', () => {
    localStorage.setItem('lsKey', 'true');

    const so = new AlphaPrimeSwitchOption('id', 'caption', false, 'lsKey');

    expect(so).toBeTruthy();
    expect(so.id).toBe('id');
    expect(so.caption).toBe('caption');
    expect(so.lsItemKey).toBe('lsKey');
    expect(so.selected).toBeTrue();
  });

  it('should create an instance without localStorage value', () => {
    const so = new AlphaPrimeSwitchOption('id', 'caption', false, 'lsKey');

    expect(so).toBeTruthy();
    expect(so.id).toBe('id');
    expect(so.caption).toBe('caption');
    expect(so.lsItemKey).toBe('lsKey');
    expect(so.selected).toBeFalse();
  });
});

