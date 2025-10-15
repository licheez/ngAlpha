import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn} from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { AlphaSessionData } from "./alpha-session-data";

/**
 * HTTP interceptor for OAuth authentication and client identification.
 *
 * Responsibilities:
 * - Adds language, client, and authorization headers to outgoing requests.
 * - Generates and persists a unique client ID per browser.
 * - Retrieves and attaches access tokens from session storage.
 * - Supports custom storage injection for testing or advanced scenarios.
 *
 * Usage:
 * - Use as a provider for HTTP_INTERCEPTORS in Angular.
 * - Call `initStorage()` to override default browser storage if needed.
 * - Use static `handlerFn()` for functional interceptors in Angular 16+.
 */
export class AlphaOasInterceptor implements HttpInterceptor {
  /**
   * Session storage for language and access token. Defaults to browser sessionStorage.
   */
  private mSessionStorage: Storage = sessionStorage;
  /**
   * Local storage for client ID. Defaults to browser localStorage.
   */
  private mLocalStorage: Storage = localStorage;

  /**
   * Allows injection of custom storage objects for session and local storage.
   * Useful for testing or non-browser environments.
   * @param sStorage - Session storage object (default: browser sessionStorage).
   * @param lStorage - Local storage object (default: browser localStorage).
   */
  initStorage(
    sStorage: Storage = sessionStorage,
    lStorage: Storage = localStorage): void {
    this.mSessionStorage = sStorage;
    this.mLocalStorage = lStorage;
  }

  /**
   * Intercepts outgoing HTTP requests and enriches them with authentication and client headers.
   * @param req - The outgoing HTTP request.
   * @param next - The next handler in the interceptor chain.
   * @returns Observable emitting the HTTP event stream.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const eReq =
      AlphaOasInterceptor.enrichReq(
        req, this.mSessionStorage, this.mLocalStorage);
    return next.handle(eReq);
  }

  /**
   * Functional interceptor handler for Angular 16+.
   * Allows direct injection of storage for advanced scenarios or testing.
   * @param req - The outgoing HTTP request.
   * @param next - The next handler function.
   * @param sStorage - Session storage object (default: browser sessionStorage).
   * @param lStorage - Local storage object (default: browser localStorage).
   * @returns Observable emitting the HTTP event stream.
   */
  static handlerFn(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    sStorage: Storage = sessionStorage,
    lStorage: Storage = localStorage): Observable<HttpEvent<any>> {
    const eReq = this.enrichReq(req, sStorage, lStorage);
    return next(eReq);
  }

  /**
   * Enriches an HTTP request with language, client, and authorization headers.
   * - Adds 'language-code' header based on session or browser language.
   * - Adds 'client-id' header, generating and persisting a UUID if needed.
   * - Adds 'authorization' header if an access token is present in session storage.
   * @param req - The original HTTP request.
   * @param sStorage - Session storage object.
   * @param lStorage - Local storage object.
   * @returns The enriched HTTP request.
   */
  private static enrichReq(
    req: HttpRequest<any>,
    sStorage: Storage,
    lStorage: Storage): HttpRequest<any> {

    let headers = req.headers;

    // getting languageCode
    // set by the principal when setting the user
    let languageCode = sStorage.getItem('alphaLanguageCode');
    if (!languageCode) {
      const nav = window.navigator as any;
      const userLang = (nav.language || nav.userLanguage) as string;
      languageCode = userLang
        ? userLang.substring(0, 2)?.toLowerCase()
        : 'en';
      sStorage.setItem('alphaLanguageCode', languageCode);
    }

    // always add the language-code header
    headers = headers.append('language-code', languageCode);

    /**
     * the ClientId (client-id header) identifies the client.
     * There will be one client-id for each browser.
     * With this in place it will be possible to
     * map a new user to his browsing history
     * ClientId is only generated once and stored in
     * the browser localstorage associated to the url
     */
    let clientId = lStorage.getItem('alphaClientId');
    if (clientId == null)
    {
      clientId = uuidV4();
      lStorage.setItem('alphaClientId', clientId!);
    }
    // always add the client-id header
    headers = headers.append('client-id', clientId!);

    /**
     * when an accessToken is present insert the authorization header
     * using the accessToken with the bearer scheme
     */
    const sd = AlphaSessionData.retrieve(sStorage);
    const token = sd?.accessToken;
    if (token) {
      headers = headers.append(
        'authorization',
        `bearer ${token}`);
    }

    return req.clone({ headers });
  }

}
