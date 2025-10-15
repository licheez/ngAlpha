/**
 * Represents the authentication status of the principal.
 * Used to track the current state in OAuth flows.
 */
export enum AlphaAuthStatusEnum {
  Undefined,
  Anonymous,
  Authenticating,
  Refreshing,
  Authenticated
}

/**
 * Represents a user in the authentication system.
 * Contains identity, language, and custom properties.
 */
export interface IAlphaUser {
  /** Unique identifier for the user. */
  userId: string;
  /** Username or display name. */
  username: string;
  /** Language code for localization. */
  languageCode: string;
  /** Custom user properties. */
  properties: Map<string, any>
}

/**
 * Envelope containing authentication tokens and user information.
 * Used for exchanging authentication data between client and backend.
 */
export interface IAlphaAuthEnvelop {
  /** Access token for API requests. */
  accessToken: string;
  /** Token expiry duration in seconds. */
  expiresIn: number;
  /** Refresh token for renewing access. */
  refreshToken: string;
  /** Authenticated user information. */
  user: IAlphaUser;
}

/**
 * Represents the principal (current authentication context).
 * Tracks status, user, language, and authentication flags.
 */
export interface IAlphaPrincipal {
  /** Current authentication status. */
  status: AlphaAuthStatusEnum;
  /** Authenticated user or null if anonymous. */
  user: IAlphaUser | null;
  /** Session language code. */
  languageCode: string;
  /** True if authenticated. */
  isAuthenticated: boolean;
  /** True if anonymous. */
  isAnonymous: boolean;
  /** True if currently authenticating. */
  isAuthenticating: boolean;
  /** Sets the session language code. */
  setSessionLanguageCode(lc: string): void;
}
