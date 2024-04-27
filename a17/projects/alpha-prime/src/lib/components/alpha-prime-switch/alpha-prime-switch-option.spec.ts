import { AlphaPrimeSwitchOption } from './alpha-prime-switch-option';

describe('AlphaPrimeSwitchOption', () => {
  let localStore: { [key: string]: string } = {};

  beforeEach(() => {
    const localStorageMock = (function () {
      return {
        getItem: function (key: string) {
          return localStore[key];
        },
        setItem: function (key: string, value: any) {
          localStore[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete localStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});
  });

  afterEach(() => {
    localStore = {};
  });

  it('should create an instance and read localStorage', () => {
    localStorage.setItem('lsKey', 'true');
    const so = new AlphaPrimeSwitchOption(
      'id','caption',false,'lsKey'
    );
    expect(so).toBeTruthy();
    expect(so.id).toEqual('id');
    expect(so.caption).toEqual('caption');
    expect(so.lsItemKey).toEqual('lsKey');
    expect(so.selected).toBeTruthy();
  });

  it('should create an instance w/o localStorage', () => {
    const so = new AlphaPrimeSwitchOption(
      'id','caption',false,'lsKey'
    );
    expect(so).toBeTruthy();
    expect(so.id).toEqual('id');
    expect(so.caption).toEqual('caption');
    expect(so.lsItemKey).toEqual('lsKey');
    expect(so.selected).toBeFalsy();
  });

});
