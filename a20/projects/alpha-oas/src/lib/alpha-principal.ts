// noinspection JSUnresolvedReference

import {AlphaAuthStatusEnum, IAlphaPrincipal, IAlphaUser} from "./alpha-oas-abstractions";

/**
 * Represents the authentication principal for the current session.
 * Tracks authentication status, user identity, and session language.
 *
 * Responsibilities:
 * - Maintains the current authentication status (anonymous, authenticating, authenticated, etc.).
 * - Stores and manages the authenticated user object.
 * - Persists and retrieves the session language code for localization and HTTP header enrichment.
 * - Provides flags for authentication state (isAuthenticated, isAnonymous, isAuthenticating).
 * - Supports clearing user identity and session language on sign-out.
 *
 * Usage:
 * - Used by authentication services to manage and expose principal state.
 * - Interacts with browser sessionStorage for language code persistence.
 */
export class AlphaPrincipal implements IAlphaPrincipal {
  /**
   * Current authentication status of the principal.
   */
  private mStatus: AlphaAuthStatusEnum;
  /**
   * Gets the current authentication status.
   */
  get status(): AlphaAuthStatusEnum {
    return this.mStatus;
  }
  /**
   * Sets the authentication status.
   * @param status - New authentication status.
   */
  setStatus(status: AlphaAuthStatusEnum): void {
    this.mStatus = status;
  }

  /**
   * Current authenticated user, or null if anonymous.
   */
  private mUser: IAlphaUser | null;
  /**
   * Gets the current user object, or null if not authenticated.
   */
  get user(): IAlphaUser | null {
    return this.mUser;
  }
  /**
   * Sets the current user and updates the session language code.
   * @param user - Authenticated user object.
   */
  setUser(user: IAlphaUser): void {
    this.mUser = user;
    this.setSessionLanguageCode(user.languageCode);
  }
  /**
   * Persists the session language code for localization and HTTP header enrichment.
   * @param lc - Language code to persist.
   */
  setSessionLanguageCode(lc: string): void {
    // interceptor will use this value for inserting
    // the language-code header on each outgoing request
    sessionStorage.setItem('alphaLanguageCode', lc);
  }
  /**
   * Clears the user identity and removes the session language code from storage.
   */
  clearUser(): void {
    this.mUser = null;
    sessionStorage.removeItem('alphaLanguageCode');
  }

  /**
   * Gets the current session language code.
   * Returns the user's language if authenticated, or falls back to sessionStorage or browser language.
   */
  get languageCode(): string {
    if (this.mUser) {
      return this.mUser.languageCode;
    }
    const lsLc = sessionStorage.getItem('alphaLanguageCode');
    if (lsLc) {
      return lsLc;
    }
    const nav = window.navigator as any;
    const userLang = (nav.language || nav.userLanguage) as string;
    return userLang
      ? userLang.substring(0, 2).toLowerCase()
      : 'en';
  }

  /**
   * True if the principal is authenticated.
   */
  get isAuthenticated(): boolean {
    return this.mStatus === AlphaAuthStatusEnum.Authenticated;
  }

  /**
   * True if the principal is anonymous (not authenticated).
   */
  get isAnonymous(): boolean {
    return this.mStatus === AlphaAuthStatusEnum.Undefined
      || this.mStatus === AlphaAuthStatusEnum.Anonymous;
  }

  /**
   * True if the principal is in the process of authenticating or refreshing.
   */
  get isAuthenticating(): boolean {
    return this.mStatus === AlphaAuthStatusEnum.Authenticating
      || this.mStatus === AlphaAuthStatusEnum.Refreshing;
  }

  /**
   * Constructs a new principal with undefined status and no user.
   */
  constructor() {
    this.mStatus = AlphaAuthStatusEnum.Undefined;
    this.mUser = null;
  }

}
