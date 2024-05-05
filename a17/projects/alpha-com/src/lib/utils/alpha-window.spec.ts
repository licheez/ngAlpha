import { AlphaWindow } from './alpha-window';

describe('AlphaWindow', () => {

  const originalNav = window.navigator;
  afterEach(() => {
    // After each test, we reset the window.navigator object to its original state
    Object.defineProperty(window, 'navigator', {
      value: originalNav,
      configurable: true
    });
  });

  it('should create an instance', () => {
    expect(new AlphaWindow()).toBeTruthy();
  });

  it('should return "en" if navigator.language is undefined', () => {
    // Given
    Object.defineProperty(window, 'navigator', {
      value: {},
      configurable: true
    });

    // When
    const actual = AlphaWindow.navigatorLanguageCode;

    // Then
    expect(actual).toBe('en');
  });

  it('should return the first two characters of navigator.language in lower case', () => {
    // Given
    Object.defineProperty(window, 'navigator', {
      value: {
        language: 'EN-US'
      },
      configurable: true
    });

    // When
    const actual = AlphaWindow.navigatorLanguageCode;

    // Then
    expect(actual).toBe('en');
  });

  it('should return the first two characters of navigator.userLanguage in lower case if navigator.language is not available', () => {
    // Given
    Object.defineProperty(window, 'navigator', {
      value: {
        userLanguage: 'EN-US'
      },
      configurable: true
    });

    // When
    const actual = AlphaWindow.navigatorLanguageCode;

    // Then
    expect(actual).toBe('en');
  });

  it('should return width', () => {

    let mw: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    Object.defineProperty(window, 'innerWidth', {
      value: 1200,
      configurable: true
    });
    mw = AlphaWindow.mediaWidth;
    expect(mw).toEqual('xl');

    Object.defineProperty(window, 'innerWidth', {
      value: 992,
      configurable: true
    });
    mw = AlphaWindow.mediaWidth;
    expect(mw).toEqual('lg');

    Object.defineProperty(window, 'innerWidth', {
      value: 768,
      configurable: true
    });
    mw = AlphaWindow.mediaWidth;
    expect(mw).toEqual('md');

    Object.defineProperty(window, 'innerWidth', {
      value: 576,
      configurable: true
    });
    mw = AlphaWindow.mediaWidth;
    expect(mw).toEqual('sm');

    Object.defineProperty(window, 'innerWidth', {
      value: 575,
      configurable: true
    });
    mw = AlphaWindow.mediaWidth;
    expect(mw).toEqual('xs');

  });
});

