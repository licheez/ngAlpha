import { AlphaRefreshData } from './alpha-refresh-data';

describe('AlphaRefreshData', () => {

  let localStore: { [key: string]: string } = {};

  beforeEach(() => {
    const localStorageMock = (function() {
      return {
        getItem: function(key: string) {
          return localStore[key];
        },
        setItem: function(key: string, value: any) {
          localStore[key] = value.toString();
        },
        removeItem: function(key: string) {
          delete localStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    localStore = {}
  });

  it('should create an instance', () => {
    const rd = new AlphaRefreshData('refreshToken');
    expect(rd).toBeTruthy();
  });

  it('should store, retrieve and then clear', () => {
    const rd = new AlphaRefreshData('refreshToken');
    rd.store();
    let data = AlphaRefreshData.retrieve();
    expect(data).toBeTruthy();
    expect(data!.refreshToken).toEqual('refreshToken');
    AlphaRefreshData.clear();
    data = AlphaRefreshData.retrieve();
    expect(data).toBeNull();
  });

});
