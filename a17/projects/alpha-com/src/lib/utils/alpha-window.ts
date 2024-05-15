export class AlphaWindow {

  /**
   * Retrieves the language code of the user's browser.
   *
   * @returns {string} The language code of the user's browser.
   */
  static get navigatorLanguageCode(): string {
    const nav = window.navigator as any;
    const userLang = (nav.language || nav.userLanguage) as string;
    return userLang
      ? userLang.substring(0, 2).toLowerCase()
      : 'en';
  }

  /**
   * Returns the media width based on the current viewport width.
   * The returned value can be one of the following: 'xs', 'sm', 'md', 'lg', 'xl'.
   *
   * @return {string} The media width.
   */
  static get mediaWidth(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
    const vw = Math
      .max(document.documentElement.clientWidth || 0,
        window.innerWidth || 0);
    if (vw >= 1200) {
      return 'xl';
    } else if (vw >= 992) {
      return 'lg';
    } else if (vw >= 768) {
      return 'md';
    } else if (vw >= 576) {
      return 'sm';
    } else {
      return 'xs';
    }
  }
}
