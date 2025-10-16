import { AlphaRefreshData } from './alpha-refresh-data';

describe('AlphaRefreshData', () => {
  let mockStorage: Storage;

  beforeEach(() => {
    const store: Record<string, string> = {};
    mockStorage = {
      getItem: (key: string): string | null => store[key] ?? null,
      setItem: (key: string, value: string): void => { store[key] = value; },
      removeItem: (key: string): void => { delete store[key]; },
      clear: (): void => { Object.keys(store).forEach(k => delete store[k]); },
      key: (index: number): string | null => Object.keys(store)[index] ?? null,
      get length() { return Object.keys(store).length; }
    };
  });

  it('should create instance and store refreshToken', () => {
    const data = new AlphaRefreshData('token123');
    expect(data.refreshToken).toBe('token123');
  });

  it('should store refreshToken in storage', () => {
    const data = new AlphaRefreshData('token456');
    data.store(mockStorage);
    expect(mockStorage.getItem('alphaRefreshToken')).toBe('token456');
  });

  it('should retrieve refreshToken from storage', () => {
    mockStorage.setItem('alphaRefreshToken', 'token789');
    const data = AlphaRefreshData.retrieve(mockStorage);
    expect(data).toBeTruthy();
    expect(data?.refreshToken).toBe('token789');
  });

  it('should return null if refreshToken not in storage', () => {
    mockStorage.removeItem('alphaRefreshToken');
    const data = AlphaRefreshData.retrieve(mockStorage);
    expect(data).toBeNull();
  });

  it('should clear refreshToken from storage', () => {
    mockStorage.setItem('alphaRefreshToken', 'token000');
    AlphaRefreshData.clear(mockStorage);
    expect(mockStorage.getItem('alphaRefreshToken')).toBeNull();
  });
});

