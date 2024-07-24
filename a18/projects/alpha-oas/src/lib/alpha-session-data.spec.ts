import {AlphaSessionData} from './alpha-session-data';

describe('AlphaSessionData', () => {

  let store: { [key: string]: string } = {};

  beforeEach(() => {
    const sessionStorageMock = (function() {
      return {
        getItem: function(key: string) {
          return store[key];
        },
        setItem: function(key: string, value: any) {
          store[key] = value.toString();
        },
        removeItem: function(key: string) {
          delete store[key];
        }
      };

    })();
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
  });

  afterEach(() => {
    store = {}
  });

  it('should create an instance', () => {
    const sd = new AlphaSessionData(
      true, 'accessToken',
      1, 10);
    expect(sd).toBeTruthy();
  });

  it('should getUtcNow', () => {
    const sd = new AlphaSessionData(
      true, 'accessToken',
      1, 10);
    expect(sd.isExpiredOrExpiring).toBeTruthy();
  });

  it('should getTimestamps', () => {
    const ts = AlphaSessionData
      .getTimestamps(10);
    expect(ts.receptionTs).toBeGreaterThan(0);
    expect(ts.expirationTs).toBeGreaterThan(0);
  });

  it('should store and retrieve then clear', () => {
    const sd = new AlphaSessionData(
      true, 'accessToken',
      1, 10);
    sd.store();
    const data1 = AlphaSessionData.retrieve();
    expect(data1).toBeTruthy();
    AlphaSessionData.clear();
    const data2 = AlphaSessionData.retrieve();
    expect(data2).toBe(null);
  });

});
