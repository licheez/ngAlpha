# Alpha OAuth Service (a.k.a. alpha-oas)

This package was build using Angular 17.2.0

It exposes
* two main services
  * AlphaAosService
  * AlphaAosInterceptor
* two important classes
  * AlphaPrincipal
  * AlphaUser
* and one enum
  * AlphaAuthStatusEnum

## AlphaOasService

The AlphaOasService is a service intended for managing user authentication in an Angular 17.2.0 application. It uses the @Injectable decorator to allow for its use throughout the Angular application, and follows the singleton pattern via providedIn: 'root'.

It employs @angular/common/http::HttpClient for calls to HTTP REST API endpoints for managing user sessions and authentication.

### Features:
* Handling user sign in and sign out operations.
* Managing refreshing of access tokens.
* Storing access and refresh token details in the session and local storage respectively.
* Populating and managing Principal details upon user authentication.

### Core Methods:
* **init**: The method initializes the authentication process and sets the service URLs and delegate methods that handle errors and state changes and returns an Observable.
* **signIn**: It accepts username, password and rememberMe as parameters. On successful login, it calls the storeIdentity method.
* **signOut**: This method clears session and local storage and updates the principal status to anonymous.
* **authorize**: It takes in a http request of type Observable and processes this request. If the access token is expired or is about to expire, it triggers token refresh before handling the http request.
* **editUserInfo**: This method is used to update user information in the principal.

### Helper Methods:
* **private storeIdentity**: This method stores access token, refresh token and user details and updates the principal status.
* **private getMe**: This method retrieves user information by making HTTP get request to the given 'getMe' URL.
* **useSignIn, useRefresh, useAuthorize**: These methods can be used to override the default signIn, refresh and authorize logic respectively in the service.

### Note:
* The main extension points of the service are methods **signIn**, **signOut**, and **authorize**. They integrate with the actual login form, logout button, and secure HTTP requests respectively.
* The service leverages includes error handling and optional features like refresh token handling.
* It provides flexibility to change specific parts of the authentication and authorization process through utility methods: useSignIn, useRefresh and useAuthorize.

### Initialization

In order to work as expected, you'll need to
* inject the OasInterceptor.
* initialize the service at the very start of your angular application.

#### Inject the Interceptor

you'll need to inject the OasInterceptor

This can be done into the **app.config.ts** class

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AlphaOasInterceptor } from "@pvway/alpha-oas";

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AlphaOasInterceptor, multi: true }
  ]
};

```

#### Call the service init method

This is usually done in the onNgInit method of the app.component.

``` typescript
import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {environment} from "../environments/environment";

import {AlphaTsService} from "@pvway/alpha-ts";
import {AlphaOasService, AlphaPrincipal} from "@pvway/alpha-oas";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaLbsService} from "@pvway/alpha-lbs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  pendingInitCount = 2;

  title = 'a17';

  constructor(
    private mLs: AlphaLsService,
    private mLbs: AlphaLbsService,
    private mOas: AlphaOasService,
    private mTs: AlphaTsService) {
  }

  ngOnInit() {

    // INITIALIZING OAUTH SERVICE
    // --------------------------
    const getMeUrl = environment.apiHost + '/getMe';
    const refreshUrl = environment.apiHost + '/token';
    const signInUrl = environment.apiHost + '/token';
    const watchOasStateChanges = (principal: AlphaPrincipal) => {
      this.mLbs.publish(principal, 'PRINCIPAL_UPDATED');
    }
    this.mOas.init(
      getMeUrl, refreshUrl, signInUrl,
      this.mLs.postErrorLog, watchOasStateChanges)
      .subscribe({
        next: oasStatus => {
          console.log(oasStatus);
          this.pendingInitCount--;
        }
      });

    // INITIALIZING TRANSLATION SERVICE
    // --------------------------------
    const tcUpdateUrl = environment.apiHost + '/getTranslationCacheUpdate';
    this.mTs.init(tcUpdateUrl).subscribe({
      next: tsStatus => {
        console.log(tsStatus);
        this.pendingInitCount--;
      }
    });
  }

}

```

Let's explain what's happening under the hook.

The init method will actually try to reauthenticate the user and populate the principal using **open OAuth** so that on completion of the process the principal is set and the user (and all its properties) are set.

It covers the following use cases

#### Use Case 1: The user was authenticated and refreshes the browser
* pre-conditions:
  * the user was authenticated and tokens (access token and refresh token) are present in the sessions storage
  * the user refreshes the browser's page
* primary flow: the OasService will call the **getMe** end point provided in the init signature. This call reach an authorized end point on the server side that will return user information such as its userId, username and languageCode along with a map of string/string properties such as its first name, last name... any think you want actually.
* post-conditions:
  * the principal is set with a populated user
  * the principal status is _Authenticated_

#### USe Case 2: The browser was closed (i.e. session data was erased)
* pre-conditions:
  * the user was authenticated in a former session (i.e. a refresh token is present in ths localStorage)
  * in the meantime he closed and reopened the browser so that the oas data in session storage is gone
* primary low: the OasService will call the **refresh** end point provided in the init signature. On successful refresh the service then calls the getMe method for populating the principal and the user.
* post-conditions:
  * the session storage accessToken is set back to new (fresh) values
  * a new refresh token is stored in the localStorage
  * the principal user is set with a populated user
  * the principal status is _Authenticated_

#### Use Case 3: The user signed out or this is the first time he connects
* pre-conditions:
  * the oas data is not present in the sessionStorage
  * the refresh data is not present in the localStorage
* primary flow: the OasService will set the principal status to anonymous and the user to null
* post-conditions:
  * the principal user is null
  * the principal status is Anonymous

The init method expects 5 parameters (all optional)
* **getMeUrl**: the url of the protected server enc point called for getting back the user profile
* **refreshUrl**: the url of the open end point of the identity server (Open OAuth refresh flow)
* **signInUrl**: the url of the open end point of the identity server (OPen OAuth Client credentials flow)
* **postErrorLogCallBack**: an optional delegate that can log errors to the server
* **watchStatusChangesCallBack**: an option delegate that can be used to handle state updates of the principal

In the code here above we are using

* the postErrorLog method from the [alpha-ls](https://www.npmjs.com/package/@pvway/alpha-ls) component
* the publish method from the [alpha-lbs](https://www.npmjs.com/package/@pvway/alpha-lbs) component


## Usage

See here after a small API call that needs to be authorized.

```typescript
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {AlphaLsService} from "@pvway/alpha-ls";
import {AlphaOasService} from "@pvway/alpha-oas";

@Injectable({
  providedIn: 'root'
})
export class DemoApiService {
  
  private mContext = 'DemoApiService';

  constructor(
    private mLs: AlphaLsService,
    private mOas: AlphaOasService,
    private mHttp: HttpClient) { }
  
  // Authenticated method retrieving the main account balance
  getMainAccountBalance(): Observable<number> {
    const url = environment.apiHost + '/Accounts/GetMainAccountBalance';
    const call = this.mHttp.get<number>(url)
      .pipe(
        catchError((error: HttpErrorResponse)=> {
          this.mLs.postErrorLog(this.mContext, 'getMainAccountBalance', 
            JSON.stringify(error));
          return throwError(() => error)
        }));
    return this.mOas.authorize(call);
  }
  
}
```

As you can see the authorize method is called.

This method will wrap the logic for making sure the http request is authorized using a valid Authorization bearer.

It will also take care of automatically and transparently renewing any expired token using the OpenOAuth refresh flow.

## Server side considerations

If you are providing the identity provider server you'll need to make sure it returns the following data to the OasService

```typescript
export interface IAlphaAuthEnvelop {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: IAlphaUser;
}

export interface IAlphaUser {
  userId: string;
  username: string;
  languageCode: string;
  properties: Map<string, any>
}

```
* the **IAlphaAuthEnvelop** is a very classical Open OAuth return object that should contain an extra IAlphaUser object
* the **IAlphaUser** should contain the userId, the username and the (iso) languageCode for the connected user. It also contains a string/any dictionary where you can pass any data you may need in the client

## See also

This component is part of a suite of integrated components

* [AlphaLocalSubService](https://www.npmjs.com/package/@pvway/alpha-lbs)
* [AlphaLoggingService](https://www.npmjs.com/package/@pvway/alpha-ls)
