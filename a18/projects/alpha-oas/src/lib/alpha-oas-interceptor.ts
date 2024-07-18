import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn} from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { AlphaSessionData } from "./alpha-session-data";

export class AlphaOasInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const eReq = AlphaOasInterceptor.enrichReq(req);
    return next.handle(eReq);
  }

  static handlerFn(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const eReq = this.enrichReq(req);
    return next(eReq);
  }

  private static enrichReq(req: HttpRequest<any>): HttpRequest<any> {
    let headers = req.headers;

    // getting languageCode
    // set by the principal when setting the user
    let languageCode =
      sessionStorage.getItem('alphaLanguageCode');
    if (!languageCode) {
      const nav = window.navigator as any;
      const userLang = (nav.language || nav.userLanguage) as string;
      languageCode = userLang
        ? userLang.substring(0, 2)?.toLowerCase()
        : 'en';
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
    let clientId = localStorage.getItem('alphaClientId');
    if (clientId == null)
    {
      clientId = uuidV4();
      localStorage.setItem('alphaClientId', clientId);
    }
    // always add the client-id header
    headers = headers.append('client-id', clientId);

    /**
     * when an accessToken is present insert the authorization header
     * using the accessToken with the bearer scheme
     */
    const sd = AlphaSessionData.retrieve();
    const token = sd?.accessToken;
    if (token) {
      headers = headers.append(
        'authorization',
        `bearer ${token}`);
    }

    return req.clone({ headers });
  }

}
