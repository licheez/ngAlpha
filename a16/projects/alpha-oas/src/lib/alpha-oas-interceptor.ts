import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { AlphaSessionData } from "./alpha-session-data";

export class AlphaOasInterceptor implements HttpInterceptor {

  private readonly clientId: string;

  constructor() {
    /**
     * the ClientId (client-id header) identifies the client.
     * There will be one client-id for each browser.
     * With this in place it will be possible to
     * map a new user to his browsing history
     * ClientId is only generated once and stored in
     * the browser localstorage associated to the url
     */
    const clientId = localStorage.getItem('alphaClientId');
    if (clientId) {
      this.clientId = clientId;
    } else
    {
      this.clientId = uuidV4();
      localStorage.setItem('alphaClientId', this.clientId);
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    let oReq: HttpRequest<any>;
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

    // always add the client-id header
    headers = headers.append('client-id', this.clientId);

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

    oReq = req.clone({ headers });

    return next.handle(oReq);
  }

}
