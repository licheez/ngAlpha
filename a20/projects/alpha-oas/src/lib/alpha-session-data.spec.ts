import { AlphaSessionData } from './alpha-session-data';

describe('AlphaSessionData', () => {
  let mockStorage: Storage;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    mockStorage = {
      getItem: (key: string): string | null => store[key] ?? null,
      setItem: (key: string, value: string): void => { store[key] = value; },
      removeItem: (key: string): void => { delete store[key]; },
      clear: (): void => { Object.keys(store).forEach(k => delete store[k]); },
      key: (index: number): string | null => Object.keys(store)[index] ?? null,
      get length() { return Object.keys(store).length; }
    };
  });

  it('should assign properties via constructor', () => {
    const session = new AlphaSessionData(
      true, 'token', 1000, 2000);
    expect(session.rememberMe).toBeTrue();
    expect(session.accessToken).toBe('token');
    expect(session.receptionTs).toBe(1000);
    expect(session.expirationTs).toBe(2000);
  });

  it('should return true for isExpiredOrExpiring if expirationTs is less than 60s from now', () => {
    const now = new Date().getTime();
    const session = new AlphaSessionData(true, 'token', now, now + 59000);
    expect(session.isExpiredOrExpiring).toBeTrue();
  });

  it('should return false for isExpiredOrExpiring if expirationTs is more than 60s from now', () => {
    const now = new Date().getTime();
    const session = new AlphaSessionData(true, 'token', now, now + 61000);
    expect(session.isExpiredOrExpiring).toBeFalse();
  });

  it('should compute timestamps correctly in getTimestamps', () => {
    const before = new Date().getTime();
    const { receptionTs, expirationTs } = AlphaSessionData.getTimestamps(120);
    expect(receptionTs).toBeGreaterThanOrEqual(before);
    expect(expirationTs - receptionTs).toBe(120000);
  });

  it('should store all fields in storage', () => {
    const session = new AlphaSessionData(false, 'abc', 123, 456);
    session.store(mockStorage);
    expect(store['alphaRememberMe']).toBe('false');
    expect(store['alphaAccessToken']).toBe('abc');
    expect(store['alphaReceptionTs']).toBe('123');
    expect(store['alphaExpirationTs']).toBe('456');
  });

  it('should retrieve all fields from storage', () => {
    store['alphaRememberMe'] = 'true';
    store['alphaAccessToken'] = 'xyz';
    store['alphaReceptionTs'] = '111';
    store['alphaExpirationTs'] = '222';
    const session = AlphaSessionData.retrieve(mockStorage);
    expect(session).toBeTruthy();
    expect(session?.rememberMe).toBeTrue();
    expect(session?.accessToken).toBe('xyz');
    expect(session?.receptionTs).toBe(111);
    expect(session?.expirationTs).toBe(222);
  });

  it('should return null if rememberMe is missing in storage', () => {
    expect(AlphaSessionData.retrieve(mockStorage)).toBeNull();
  });

  it('should use default values for missing fields in storage', () => {
    store['alphaRememberMe'] = 'false';
    const session = AlphaSessionData.retrieve(mockStorage);
    expect(session).toBeTruthy();
    expect(session?.rememberMe).toBeFalse();
    expect(session?.accessToken).toBe('');
    expect(session?.receptionTs).toBe(0);
    expect(session?.expirationTs).toBe(0);
  });

  it('should clear all fields from storage', () => {
    store['alphaRememberMe'] = 'true';
    store['alphaAccessToken'] = 'token';
    store['alphaReceptionTs'] = '123';
    store['alphaExpirationTs'] = '456';
    AlphaSessionData.clear(mockStorage);
    expect(store['alphaRememberMe']).toBeUndefined();
    expect(store['alphaAccessToken']).toBeUndefined();
    expect(store['alphaReceptionTs']).toBeUndefined();
    expect(store['alphaExpirationTs']).toBeUndefined();
  });
});

